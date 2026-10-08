import { NextRequest, NextResponse } from "next/server";

interface ChapterMeta {
  id: string;
  title: string;
  pageTitle: string;
  content: string;
}

// 辅助清洗 HTML 为纯净排版文本
function cleanHtmlText(rawHtml: string): string {
  return rawHtml
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<table[^>]*>[\s\S]*?<\/table>/gi, "")
    .replace(/<div class="ws-header[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<div id="headerContainer"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<div class="sister-project[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<span class="mw-editsection"[^>]*>[\s\S]*?<\/span>/gi, "")
    .replace(/<sup class="reference"[^>]*>[\s\S]*?<\/sup>/gi, "")
    .replace(/<p[^>]*>/gi, "\n\n  ")
    .replace(/<\/p>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&#8203;/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// 抓取单个 Wiki 页面内容
async function fetchWikiPage(pageName: string): Promise<{ title: string; html: string; pageid: number; links: { ns: number; "*": string }[] } | null> {
  const url = `https://zh.wikisource.org/w/api.php?action=parse&page=${encodeURIComponent(
    pageName
  )}&prop=text|links&variant=zh-hans&uselang=zh-hans&format=json&utf8=1`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "CiWebReader/2.0 (Mozilla/5.0; Personal Atelier Open Books)",
      Accept: "application/json",
    },
    next: { revalidate: 86400 }, // 24小时缓存
  });

  if (!res.ok) return null;
  const json = await res.json();
  if (json.error || !json.parse) return null;

  return {
    title: json.parse.title || pageName,
    html: json.parse.text?.["*"] || "",
    pageid: json.parse.pageid || 0,
    links: json.parse.links || [],
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title")?.trim();
  const chapterTitle = searchParams.get("chapterTitle")?.trim();

  if (!title) {
    return NextResponse.json({ error: "缺少书籍标题 (title)" }, { status: 400 });
  }

  try {
    // 场景 A：客户端正在翻阅具体某一章 (按需动态加载该章节完整长文本)
    if (chapterTitle) {
      const pageData = await fetchWikiPage(chapterTitle);
      if (!pageData) {
        return NextResponse.json({ error: `未能抓取到章节 [${chapterTitle}] 内容` }, { status: 404 });
      }

      const content = cleanHtmlText(pageData.html);
      return NextResponse.json({
        success: true,
        chapter: {
          id: `chap-${pageData.pageid || Date.now()}`,
          title: chapterTitle.replace(/^[^/]+\//, ""),
          pageTitle: chapterTitle,
          content: content || "（本章节正文暂未录入开放文库）",
        },
      });
    }

    // 场景 B：初次打开整本书籍，获取全书目录架构及第一章内容
    const mainPage = await fetchWikiPage(title);
    if (!mainPage) {
      return NextResponse.json({ error: `未找到书籍《${title}》` }, { status: 404 });
    }

    const { html, links, pageid } = mainPage;

    // 清理掉顶部导航条表格（例如：←彷徨、故事新编→），避免上一本书和下一本书混入章节
    const cleanBodyHtml = html
      .replace(/<table[^>]*class="[^"]*ws-header[^"]*"[^>]*>[\s\S]*?<\/table>/gi, "")
      .replace(/<div[^>]*id="headerContainer"[^>]*>[\s\S]*?<\/div>/gi, "")
      .replace(/<table[^>]*style="[^"]*background:[^"]*"[^>]*>[\s\S]*?<\/table>/gi, "");

    // 1. 尝试从页面链接中识别全书分卷/分回章节
    const chapterCandidates: { title: string; pageTitle: string }[] = [];

    // 从 HTML 中的 a 标签顺序提取正文章节链接
    const linkMatches = Array.from(
      cleanBodyHtml.matchAll(/<a\s+href=["']\/wiki\/([^"']+)["'][^>]*>([^<]+)<\/a>/g)
    );

    for (const match of linkMatches) {
      const rawHref = decodeURIComponent(match[1]);
      const linkText = match[2].trim();

      // 过滤非正文章节的无用链接
      if (
        rawHref.startsWith("Author:") ||
        rawHref.startsWith("Portal:") ||
        rawHref.startsWith("Help:") ||
        rawHref.startsWith("Special:") ||
        rawHref.startsWith("Wikisource:") ||
        rawHref.includes("#") ||
        linkText === "姊妹计划" ||
        linkText.includes("编辑") ||
        linkText.length > 40
      ) {
        continue;
      }

      // 匹配符合该书的章节链接（如 "红楼梦/第001回", "朝花夕拾/从百草园到三味书屋", 或包含"第X回/章/卷"）
      const isSubpage = rawHref.startsWith(`${title}/`) || rawHref.startsWith(`${mainPage.title}/`);
      const isChapterNumbered = /第[0-9一二三四五六七八九十百千]+[回章节卷]/.test(rawHref) || /第[0-9一二三四五六七八九十百千]+[回章节卷]/.test(linkText);
      const isEssayTitle = isSubpage || (match[0].includes("class=\"ws-") === false && linkText.length >= 2 && linkText.length <= 25);

      if (isSubpage || isChapterNumbered || isEssayTitle) {
        // 去重
        if (!chapterCandidates.some((c) => c.pageTitle === rawHref)) {
          chapterCandidates.push({
            title: linkText || rawHref.replace(/^[^/]+\//, ""),
            pageTitle: rawHref,
          });
        }
      }
    }

    let chapters: ChapterMeta[] = [];

    // 2. 如果成功识别出章节列表（如《朝花夕拾》12篇，《红楼梦》120回）
    if (chapterCandidates.length > 1) {
      // 立即抓取第 1 章的完整长文，确保打开瞬间就有丰厚正文可读
      const firstChapMeta = chapterCandidates[0];
      const firstChapData = await fetchWikiPage(firstChapMeta.pageTitle);
      const firstChapContent = firstChapData ? cleanHtmlText(firstChapData.html) : "正在加载第一章正文...";

      chapters = chapterCandidates.map((c, idx) => ({
        id: `ch-${idx + 1}`,
        title: c.title,
        pageTitle: c.pageTitle,
        // 第一章立即填充，后续章节由阅读器翻页时动态加载
        content: idx === 0 ? firstChapContent : "",
      }));
    } else {
      // 3. 单页书籍（如《道德经》全文在一页中，按章节标题或自然段切分）
      const fullCleanText = cleanHtmlText(html);

      // 尝试按章节标题（如“第一章”、“第1回”、“一、”）切分
      const splits = fullCleanText.split(/\n(?=(?:第[0-9一二三四五六七八九十百]+[章节回卷]|[一二三四五六七八九十百]+[、\s]))/g);

      if (splits.length > 2) {
        chapters = splits.map((chunk, idx) => {
          const lines = chunk.trim().split("\n");
          const chapterHeading = lines[0]?.slice(0, 30).trim() || `第 ${idx + 1} 章`;
          return {
            id: `sec-${idx + 1}`,
            title: chapterHeading,
            pageTitle: title,
            content: chunk.trim(),
          };
        });
      } else {
        // 若无明显章节标记，按每 ~1800 字切分成连续阅读单元，杜绝“只有两页”
        const chunkSize = 1800;
        const totalChunks = Math.ceil(fullCleanText.length / chunkSize) || 1;
        chapters = [];

        for (let i = 0; i < totalChunks; i++) {
          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, fullCleanText.length);
          chapters.push({
            id: `chunk-${i + 1}`,
            title: `第 ${i + 1} 篇 / 节`,
            pageTitle: title,
            content: fullCleanText.slice(start, end).trim(),
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      book: {
        id: `online-${pageid || Date.now()}`,
        title: mainPage.title || title,
        author: "公版数字文库典藏",
        coverTone: "celadon",
        coverColor: "bg-[#EAF0EB] text-[#42614B] border-[#D3E0D5]",
        category: "文库原典",
        tagline: `全书共 ${chapters.length} 章节，支持无缝翻阅精读`,
        description: `开放文库全本典籍，已智能解析为 ${chapters.length} 章节，支持动态翻章与多端漫游。`,
        curatorNote: "【真实全章节排版】完整长篇典籍，按需动态加载全本内容。",
        rating: 5.0,
        totalWords: `共 ${chapters.length} 章节`,
        estimatedReadTime: `${Math.max(5, chapters.length * 10)} 分钟`,
        chapters,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "解析远程图书异常";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
