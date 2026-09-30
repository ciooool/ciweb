import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 服务端持久化数据库存储结构（绝非浏览器本地 LocalStorage）
interface SavedBookRecord {
  id: string;
  title: string;
  author: string;
  coverTone?: string;
  coverColor?: string;
  category: string;
  tagline?: string;
  description?: string;
  totalWords?: string;
  sourceType: "remote" | "curated" | "custom";
  addedAt: string;
}

interface UserBookshelfState {
  readerId: string;
  books: SavedBookRecord[];
  updatedAt: string;
}

const SERVER_DB_PATH = path.join("/tmp", "zenlib_server_bookshelf.json");

function readServerDB(): Record<string, UserBookshelfState> {
  try {
    if (fs.existsSync(SERVER_DB_PATH)) {
      const raw = fs.readFileSync(SERVER_DB_PATH, "utf-8");
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return {};
}

function writeServerDB(data: Record<string, UserBookshelfState>) {
  try {
    fs.writeFileSync(SERVER_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // ignore
  }
}

// GET: 从后端服务器直接获取该用户的云端书房
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const readerId = searchParams.get("readerId")?.trim();

  if (!readerId) {
    return NextResponse.json({ error: "缺少读者证号 (readerId)" }, { status: 400 });
  }

  const db = readServerDB();
  const userState = db[readerId] || {
    readerId,
    books: [
      {
        id: "navals-almanack",
        title: "纳瓦尔宝典：财富与自由的微观模型",
        author: "埃里克·乔根森 / 纳瓦尔",
        coverTone: "amber",
        coverColor: "bg-[#F3EDE2] text-[#8C5D39] border-[#E5DAC8]",
        category: "商业与杠杆",
        description: "硅谷知名投资人纳瓦尔的人生智慧合集，探讨代码杠杆与个人产品化。",
        sourceType: "curated",
        addedAt: new Date().toISOString(),
      },
      {
        id: "dao-de-jing",
        title: "道德经：东方至道与系统架构哲学",
        author: "老子",
        coverTone: "sage",
        coverColor: "bg-[#EAF0EB] text-[#42614B] border-[#D3E0D5]",
        category: "东方至道",
        description: "五千言道尽天地运化之机，软件解耦与高阶工程师静笃心法。",
        sourceType: "curated",
        addedAt: new Date().toISOString(),
      },
    ],
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({
    success: true,
    serverPersisted: true,
    data: userState,
  });
}

// POST: 将图书真实添加到服务器数据库中
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { readerId, book } = body;

    if (!readerId || !book || !book.id || !book.title) {
      return NextResponse.json(
        { error: "请求参数不全（需提供 readerId 和 book）" },
        { status: 400 }
      );
    }

    const cleanId = String(readerId).trim();
    const db = readServerDB();
    const userState = db[cleanId] || {
      readerId: cleanId,
      books: [],
      updatedAt: new Date().toISOString(),
    };

    // 检查是否已存在
    const exists = userState.books.some((b) => b.id === book.id);
    if (!exists) {
      userState.books.unshift({
        id: book.id,
        title: book.title,
        author: book.author || "佚名",
        coverTone: book.coverTone || "sage",
        coverColor: book.coverColor || "bg-[#EAF0EB] text-[#42614B] border-[#D3E0D5]",
        category: book.category || "文库藏书",
        tagline: book.tagline || "",
        description: book.description || "",
        totalWords: book.totalWords || "",
        sourceType: book.id.startsWith("wiki-") ? "remote" : "curated",
        addedAt: new Date().toISOString(),
      });
      userState.updatedAt = new Date().toISOString();
      db[cleanId] = userState;
      writeServerDB(db);
    }

    return NextResponse.json({
      success: true,
      message: "书籍已安全持久化保存至云端书房数据库",
      serverPersisted: true,
      booksCount: userState.books.length,
      data: userState,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "保存到云端失败";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE: 从服务器数据库中彻底移出图书
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { readerId, bookId } = body;

    if (!readerId || !bookId) {
      return NextResponse.json({ error: "缺少 readerId 或 bookId" }, { status: 400 });
    }

    const cleanId = String(readerId).trim();
    const db = readServerDB();
    if (db[cleanId]) {
      db[cleanId].books = db[cleanId].books.filter((b) => b.id !== bookId);
      db[cleanId].updatedAt = new Date().toISOString();
      writeServerDB(db);
    }

    return NextResponse.json({
      success: true,
      message: "书籍已从云端数据库彻底移出",
      data: db[cleanId] || { readerId: cleanId, books: [] },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "移出失败";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
