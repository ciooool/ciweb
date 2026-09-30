import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ error: "请输入搜索书名或关键词" }, { status: 400 });
  }

  try {
    // 实时请求公共中文开放文库 API (支持搜索全网数十万部中文古典与近现代公版大作)
    const targetUrl = `https://zh.wikisource.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      query
    )}&srlimit=12&format=json&utf8=1`;

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "CiWebReader/2.0 (Mozilla/5.0; Personal Atelier Open Books)",
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // 1小时缓存提升响应速度
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `远程书源服务响应异常: ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const rawResults = data.query?.search || [];

    // 过滤与格式化结果，清除 HTML 标签
    const cleanResults = rawResults.map((item: { title: string; pageid: number; snippet: string; wordcount: number }) => {
      const cleanSnippet = item.snippet
        .replace(/<span[^>]*>/gi, "")
        .replace(/<\/span>/gi, "")
        .replace(/<[^>]+>/gi, "")
        .trim();

      return {
        id: `wiki-${item.pageid}`,
        rawTitle: item.title,
        title: item.title.replace(/^Author:/, "作者名录："),
        snippet: cleanSnippet || "收录于开放中文数字文库，支持在线完整精读。",
        wordcount: item.wordcount ? `约 ${item.wordcount} 字` : "全本",
        category: "文库典籍",
        source: "开放中文文库 (在线动态拉取)",
      };
    });

    return NextResponse.json({
      success: true,
      query,
      count: cleanResults.length,
      data: cleanResults,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "检索书源网络失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
