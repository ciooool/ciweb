import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 跨设备云端读者证存储结构
interface ReaderSyncData {
  readerId: string;
  bookshelf: string[];
  progress: Record<string, { chapterIndex: number; percentage: number; updatedAt: string }>;
  updatedAt: string;
}

// 轻量级持久化文件路径（在生产环境与本地均可用）
const STORAGE_FILE = path.join("/tmp", "zenlib_reader_sync.json");

function readStorage(): Record<string, ReaderSyncData> {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const content = fs.readFileSync(STORAGE_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch {
    // ignore
  }
  return {};
}

function writeStorage(data: Record<string, ReaderSyncData>) {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // ignore
  }
}

// GET: 根据读者证号拉取云端书房数据
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const readerId = searchParams.get("readerId")?.trim();

  if (!readerId) {
    return NextResponse.json(
      { error: "缺少读者证号 (readerId)" },
      { status: 400 }
    );
  }

  const allData = readStorage();
  const userData = allData[readerId] || {
    readerId,
    bookshelf: ["navals-almanack", "dao-de-jing"],
    progress: {},
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({
    success: true,
    data: userData,
  });
}

// POST: 手机或电脑将本地书房与进度推送到云端进行双向同步
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { readerId, bookshelf, progress } = body;

    if (!readerId || typeof readerId !== "string") {
      return NextResponse.json(
        { error: "请输入有效的读者证号" },
        { status: 400 }
      );
    }

    const cleanId = readerId.trim();
    const allData = readStorage();
    const existing = allData[cleanId] || {
      readerId: cleanId,
      bookshelf: [],
      progress: {},
      updatedAt: new Date().toISOString(),
    };

    // 智能合并跨设备数据（避免丢弃某端的新数据）
    const mergedBookshelf = Array.from(
      new Set([...(bookshelf || []), ...(existing.bookshelf || [])])
    );

    const mergedProgress = {
      ...(existing.progress || {}),
      ...(progress || {}),
    };

    const updatedData: ReaderSyncData = {
      readerId: cleanId,
      bookshelf: mergedBookshelf,
      progress: mergedProgress,
      updatedAt: new Date().toISOString(),
    };

    allData[cleanId] = updatedData;
    writeStorage(allData);

    return NextResponse.json({
      success: true,
      data: updatedData,
      message: "云端书房同步成功",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "同步失败";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
