import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title")?.trim();

  if (!title) {
    return NextResponse.json({ error: "缺少书籍标题 (title)" }, { status: 400 });
  }

  try {
    const targetUrl = `https://zh.wikisource.org/w/api.php?action=parse&page=${encodeURIComponent(
      title
    )}&prop=text|sections&format=json&utf8=1`;

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "CiWebReader/2.0 (Mozilla/5.0; Personal Atelier Open Books)",
        Accept: "application/json",
      },
      next: { revalidate: 86400 }, // 24小时静态缓存，保证响应极快
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `远程书源响应失败: ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    if (data.error) {
      return NextResponse.json(
        { error: data.error.info || "未找到该书籍内容" },
        { status: 404 }
      );
    }

    const rawHtml = data.parse?.text?.["*"] || "";
    
    // 纯净化清洗 HTML：剔除无用脚本、导航条、模板和编辑按钮
    const cleanText = rawHtml
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<table[^>]*>[\s\S]*?<\/table>/gi, "")
      .replace(/<div id="headerContainer"[^>]*>[\s\S]*?<\/div>/gi, "")
      .replace(/<div class="sister-project[^>]*>[\s\S]*?<\/div>/gi, "")
      .replace(/<span class="mw-editsection"[^>]*>[\s\S]*?<\/span>/gi, "")
      .replace(/<[^>]+>/g, "\n")
      .replace(/&#8203;/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    // 智能章节切分：优先按“一、二、三”、“第X章”、“第X节”或者自然分段切分
    const chapterSplits = cleanText.split(/\n(?=[一二三四五六七八九十百]+[、\s]|第[0-9一二三四五六七八九十百]+[章节回卷])/g);

    let chapters: { id: string; title: string; content: string }[] = [];
    if (chapterSplits.length > 1) {
      chapters = chapterSplits.map((chunk: string, idx: number) => {
        const lines = chunk.trim().split("\n");
        const chapterTitle = lines[0]?.slice(0, 30).trim() || `第 ${idx + 1} 节`;
        const content = lines.slice(1).join("\n").trim() || lines[0] || "";
        return {
          id: `remote-ch-${idx + 1}`,
          title: chapterTitle,
          content,
        };
      });
    } else {
      // 篇幅适中或单篇，切分为阅读单元
      chapters = [
        {
          id: "remote-ch-1",
          title: "正文全篇",
          content: cleanText,
        },
      ];
    }

    return NextResponse.json({
      success: true,
      book: {
        id: `online-${data.parse?.pageid || Date.now()}`,
        title: data.parse?.title || title,
        author: "开放中文文库在线馆藏",
        coverTone: "sage",
        coverColor: "bg-[#EAF0EB] text-[#42614B] border-[#D3E0D5]",
        category: "文库原典",
        tagline: "来自开放中文数字图书馆的实时动态典籍",
        description: `全网实时动态拉取，纯净排版，全书约 ${Math.round(cleanText.length / 1000)}k 字。`,
        curatorNote: "【云端开放书源】实时在线抓取清洗呈现，永久免广告沉浸阅读。",
        rating: 5.0,
        totalWords: `约 ${cleanText.length} 字`,
        estimatedReadTime: `${Math.max(2, Math.round(cleanText.length / 400))} 分钟`,
        chapters,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "解析远程图书失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
