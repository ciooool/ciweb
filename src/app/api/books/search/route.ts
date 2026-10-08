import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ error: "请输入搜索书名或关键词" }, { status: 400 });
  }

  try {
    // 强制使用 variant=zh-hans (简体中文智能转换) 与 srnamespace=0 (仅正文空间，剔除作者分类碎片页)
    const targetUrl = `https://zh.wikisource.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      query
    )}&srnamespace=0&variant=zh-hans&uselang=zh-hans&srlimit=15&format=json&utf8=1`;

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "CiWebReader/2.0 (Mozilla/5.0; Personal Atelier Open Books)",
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // 1小时缓存
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `远程书源服务响应异常: ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const rawResults = data.query?.search || [];

    // 过滤与格式化结果，清洗 HTML 标签
    const cleanResults = rawResults.map((item: { title: string; pageid: number; snippet: string; wordcount: number }) => {
      const cleanSnippet = item.snippet
        .replace(/<span[^>]*>/gi, "")
        .replace(/<\/span>/gi, "")
        .replace(/<[^>]+>/gi, "")
        .replace(/&quot;/gi, '"')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .trim();

      // 根据标题哈希生成优雅的精装书封底色
      const tones = ["xuan", "celadon", "terracotta", "indigo", "ink", "amber"] as const;
      const hash = item.title.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const assignedTone = tones[hash % tones.length];

      return {
        id: `wiki-${item.pageid}`,
        rawTitle: item.title,
        title: item.title.replace(/^Author:/, "作者：").replace(/[《》]/g, ""),
        author: "公版数字典藏",
        snippet: cleanSnippet || "收录于开放中文数字文库，支持纯净在线完整阅读。",
        wordcount: item.wordcount ? `约 ${item.wordcount} 字` : "全本",
        category: "文库典籍",
        coverTone: assignedTone,
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
