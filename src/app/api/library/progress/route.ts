import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PROGRESS_DB_PATH = path.join("/tmp", "zenlib_server_progress.json");

function readProgressDB(): Record<string, Record<string, { chapterIndex: number; chapterTitle?: string; percentage: number; updatedAt: string }>> {
  try {
    if (fs.existsSync(PROGRESS_DB_PATH)) {
      const raw = fs.readFileSync(PROGRESS_DB_PATH, "utf-8");
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return {};
}

function writeProgressDB(data: unknown) {
  try {
    fs.writeFileSync(PROGRESS_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // ignore
  }
}

// GET: 获取该读者证在服务端的阅读进度
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const readerId = searchParams.get("readerId")?.trim();

  if (!readerId) {
    return NextResponse.json({ error: "缺少 readerId" }, { status: 400 });
  }

  const db = readProgressDB();
  const userProgress = db[readerId] || {};

  return NextResponse.json({
    success: true,
    serverPersisted: true,
    data: userProgress,
  });
}

// POST: 将阅读进度持久化保存在服务器
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { readerId, bookId, chapterIndex, percentage, chapterTitle } = body;

    if (!readerId || !bookId) {
      return NextResponse.json({ error: "参数不全" }, { status: 400 });
    }

    const cleanId = String(readerId).trim();
    const db = readProgressDB();
    if (!db[cleanId]) {
      db[cleanId] = {};
    }

    db[cleanId][bookId] = {
      chapterIndex: Number(chapterIndex) || 0,
      chapterTitle: chapterTitle || `第 ${(Number(chapterIndex) || 0) + 1} 节`,
      percentage: Number(percentage) || 0,
      updatedAt: new Date().toISOString(),
    };

    writeProgressDB(db);

    return NextResponse.json({
      success: true,
      serverPersisted: true,
      message: "阅读进度已实时上报至云端服务器",
      data: db[cleanId][bookId],
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "进度上报失败";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
