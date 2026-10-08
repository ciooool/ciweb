"use client";

import React, { useState, useEffect } from "react";
import { Book, BookChapter } from "@/data/libraryData";
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Type,
  Palette,
  Check,
  List,
  Loader2,
  Sparkles,
} from "lucide-react";

interface ZenReaderModalProps {
  book: Book;
  initialChapterIndex?: number;
  onClose: () => void;
  onProgressUpdate?: (bookId: string, chapterIndex: number) => void;
}

type ReadingTheme = "sepia" | "dark" | "light" | "green";

export default function ZenReaderModal({
  book,
  initialChapterIndex = 0,
  onClose,
  onProgressUpdate,
}: ZenReaderModalProps) {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(initialChapterIndex);
  const [fontSize, setFontSize] = useState<number>(17); // 15 - 22
  const [theme, setTheme] = useState<ReadingTheme>("sepia");
  const [showToc, setShowToc] = useState(false);

  // 动态章节正文缓存：避免反复拉取
  const [dynamicChaptersContent, setDynamicChaptersContent] = useState<Record<number, string>>({});
  const [isLoadingChapter, setIsLoadingChapter] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Load user reading preferences
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("zenlib_theme") as ReadingTheme | null;
      if (savedTheme) setTheme(savedTheme);

      const savedFontSize = localStorage.getItem("zenlib_fontsize");
      if (savedFontSize) setFontSize(Number(savedFontSize));
    } catch {
      // ignore
    }
  }, []);

  // Update progress
  useEffect(() => {
    try {
      const storageKey = `zenlib_progress_${book.id}`;
      const progressData = {
        chapterIndex: currentChapterIndex,
        totalChapters: book.chapters.length,
        percentage: Math.round(((currentChapterIndex + 1) / book.chapters.length) * 100),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(storageKey, JSON.stringify(progressData));

      if (onProgressUpdate) {
        onProgressUpdate(book.id, currentChapterIndex);
      }
    } catch {
      // ignore
    }
  }, [book.id, book.chapters.length, currentChapterIndex, onProgressUpdate]);

  const currentChapter: BookChapter =
    book.chapters[currentChapterIndex] || book.chapters[0];

  // 核心特性：按需从服务端动态拉取任意章节完整正文
  useEffect(() => {
    if (!currentChapter) return;

    // 若已经有缓存或静态正文长于 50 字，直接展示，不重复发请求
    if (
      dynamicChaptersContent[currentChapterIndex] ||
      (currentChapter.content && currentChapter.content.length > 50)
    ) {
      setFetchError(null);
      return;
    }

    const targetTitle = book.remoteTitle || book.title;
    const targetChapter = currentChapter.pageTitle || currentChapter.title;

    setIsLoadingChapter(true);
    setFetchError(null);

    fetch(
      `/api/books/read?title=${encodeURIComponent(targetTitle)}&chapterTitle=${encodeURIComponent(
        targetChapter
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.chapter?.content) {
          setDynamicChaptersContent((prev) => ({
            ...prev,
            [currentChapterIndex]: data.chapter.content,
          }));
        } else {
          setFetchError(data.error || "本章节正在校对中");
        }
      })
      .catch(() => {
        setFetchError("章节传输中断，请重试");
      })
      .finally(() => {
        setIsLoadingChapter(false);
      });
  }, [currentChapterIndex, currentChapter, book.remoteTitle, book.title, dynamicChaptersContent]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        if (currentChapterIndex < book.chapters.length - 1) {
          setCurrentChapterIndex((prev) => prev + 1);
        }
      } else if (e.key === "ArrowLeft") {
        if (currentChapterIndex > 0) {
          setCurrentChapterIndex((prev) => prev - 1);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentChapterIndex, book.chapters.length, onClose]);

  const handleThemeChange = (newTheme: ReadingTheme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem("zenlib_theme", newTheme);
    } catch {
      // ignore
    }
  };

  const handleFontSizeChange = (delta: number) => {
    setFontSize((prev) => {
      const updated = Math.min(Math.max(prev + delta, 14), 24);
      try {
        localStorage.setItem("zenlib_fontsize", String(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const themeClasses: Record<
    ReadingTheme,
    { bg: string; text: string; border: string; header: string; activeTab: string }
  > = {
    sepia: {
      bg: "bg-[#FAF7F0]",
      text: "text-[#2B2927]",
      border: "border-[#E8DFC8]",
      header: "bg-[#FAF7F0]/95",
      activeTab: "bg-[#EAE1D0] text-[#2B2927]",
    },
    dark: {
      bg: "bg-[#18181A]",
      text: "text-[#EDE9E3]",
      border: "border-[#2D2D32]",
      header: "bg-[#18181A]/95",
      activeTab: "bg-[#2B2B30] text-white",
    },
    light: {
      bg: "bg-white",
      text: "text-zinc-900",
      border: "border-zinc-200",
      header: "bg-white/95",
      activeTab: "bg-zinc-100 text-zinc-900",
    },
    green: {
      bg: "bg-[#EBF2EC]",
      text: "text-[#1C362B]",
      border: "border-[#D0E2D4]",
      header: "bg-[#EBF2EC]/95",
      activeTab: "bg-[#D6E6DB] text-[#1C362B]",
    },
  };

  const currentThemeConfig = themeClasses[theme];
  const progressPercent = Math.round(
    ((currentChapterIndex + 1) / book.chapters.length) * 100
  );

  const activeContent =
    dynamicChaptersContent[currentChapterIndex] || currentChapter.content || "";

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col ${currentThemeConfig.bg} ${currentThemeConfig.text} transition-colors duration-200 select-text overflow-hidden`}
    >
      {/* 顶栏控制台 */}
      <header
        className={`sticky top-0 z-20 flex h-14 items-center justify-between border-b ${currentThemeConfig.border} ${currentThemeConfig.header} px-4 backdrop-blur-md transition-colors`}
      >
        <div className="flex items-center gap-3 truncate max-w-sm sm:max-w-md">
          <button
            onClick={() => setShowToc(!showToc)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-serif font-medium hover:opacity-75 transition-opacity border border-current/20"
            title="查看完整目录"
          >
            <List className="h-4 w-4" />
            <span>全书目录 ({book.chapters.length} 章节)</span>
          </button>
          <div className="h-4 w-px bg-current opacity-20" />
          <div className="flex flex-col truncate">
            <span className="text-xs font-bold font-serif truncate">{book.title}</span>
            <span className="text-[11px] opacity-70 font-serif truncate">{book.author}</span>
          </div>
        </div>

        {/* 阅读器偏好配置 */}
        <div className="flex items-center gap-2">
          {/* 字号缩放 */}
          <div className="hidden sm:flex items-center gap-1 border-r border-current/15 pr-3 mr-1">
            <Type className="h-3.5 w-3.5 opacity-60 mr-1" />
            <button
              onClick={() => handleFontSizeChange(-1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-current/10 text-xs font-bold"
              title="减小字号"
            >
              A-
            </button>
            <span className="text-xs font-mono px-1 opacity-75">{fontSize}</span>
            <button
              onClick={() => handleFontSizeChange(1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-current/10 text-xs font-bold"
              title="增大字号"
            >
              A+
            </button>
          </div>

          {/* 配色切换 */}
          <div className="flex items-center gap-1 sm:gap-1.5 border-r border-current/15 pr-3 mr-1">
            <Palette className="h-3.5 w-3.5 opacity-60 mr-1 hidden sm:inline" />
            <button
              onClick={() => handleThemeChange("sepia")}
              className={`w-6 h-6 rounded-full bg-[#FAF7F0] border-2 transition-transform ${
                theme === "sepia" ? "border-amber-700 scale-110 shadow-xs" : "border-[#E8DFC8]"
              }`}
              title="宣纸米黄"
            />
            <button
              onClick={() => handleThemeChange("green")}
              className={`w-6 h-6 rounded-full bg-[#EBF2EC] border-2 transition-transform ${
                theme === "green" ? "border-emerald-700 scale-110 shadow-xs" : "border-[#D0E2D4]"
              }`}
              title="抹茶浅绿"
            />
            <button
              onClick={() => handleThemeChange("light")}
              className={`w-6 h-6 rounded-full bg-white border-2 transition-transform ${
                theme === "light" ? "border-zinc-800 scale-110 shadow-xs" : "border-zinc-300"
              }`}
              title="纯净冷白"
            />
            <button
              onClick={() => handleThemeChange("dark")}
              className={`w-6 h-6 rounded-full bg-[#18181A] border-2 transition-transform ${
                theme === "dark" ? "border-zinc-400 scale-110 shadow-xs" : "border-zinc-700"
              }`}
              title="玄石墨夜"
            />
          </div>

          {/* 关闭阅读器 */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-current/10 transition-colors"
            title="关闭阅读器 (ESC)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* 阅读器主视口 */}
      <div className="relative flex-1 overflow-y-auto px-4 py-8 sm:py-12 flex justify-center">
        {/* 全书目录抽屉 */}
        {showToc && (
          <div
            className={`fixed sm:absolute left-0 top-14 bottom-0 z-30 w-80 sm:w-96 shadow-2xl border-r ${currentThemeConfig.border} ${currentThemeConfig.bg} p-6 overflow-y-auto transition-all`}
          >
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-current/15">
              <span className="font-bold text-sm font-serif flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                <span>全书完整目录 ({book.chapters.length} 章节)</span>
              </span>
              <button
                onClick={() => setShowToc(false)}
                className="p-1 hover:bg-current/10 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              {book.chapters.map((chap, idx) => (
                <button
                  key={chap.id || idx}
                  onClick={() => {
                    setCurrentChapterIndex(idx);
                    setShowToc(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-serif transition-colors flex items-center justify-between ${
                    idx === currentChapterIndex
                      ? currentThemeConfig.activeTab + " font-bold"
                      : "hover:bg-current/5 opacity-80"
                  }`}
                >
                  <span className="truncate pr-2">
                    {chap.title}
                  </span>
                  {idx === currentChapterIndex && <Check className="h-3 w-3 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 正文版心 */}
        <article
          className="w-full max-w-2xl mx-auto flex flex-col justify-between"
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
        >
          <div>
            {/* 章节标题区 */}
            <div className="mb-8 pb-4 border-b border-current/15">
              <div className="text-xs font-mono tracking-wider opacity-60 mb-2 uppercase flex items-center justify-between">
                <span>
                  {book.title} · 第 {currentChapterIndex + 1} / {book.chapters.length} 章
                </span>
                <span className="font-serif text-[11px] opacity-75">
                  进度：{progressPercent}%
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
                {currentChapter.title}
              </h2>
            </div>

            {/* 动态正文渲染 */}
            {isLoadingChapter ? (
              <div className="py-24 text-center font-serif space-y-3">
                <Loader2 className="h-8 w-8 animate-spin mx-auto opacity-60" />
                <p className="text-sm opacity-80">
                  正在翻阅《{book.title}》{currentChapter.title} 完整正文...
                </p>
                <p className="text-xs opacity-40">从开放文库云端实时同步长文</p>
              </div>
            ) : fetchError ? (
              <div className="py-16 text-center font-serif space-y-3">
                <p className="text-sm text-red-600/80">{fetchError}</p>
                <button
                  onClick={() => {
                    // 重试
                    setIsLoadingChapter(true);
                    setFetchError(null);
                    const targetTitle = book.remoteTitle || book.title;
                    const targetChapter = currentChapter.pageTitle || currentChapter.title;
                    fetch(
                      `/api/books/read?title=${encodeURIComponent(targetTitle)}&chapterTitle=${encodeURIComponent(
                        targetChapter
                      )}`
                    )
                      .then((r) => r.json())
                      .then((d) => {
                        if (d.success && d.chapter?.content) {
                          setDynamicChaptersContent((p) => ({ ...p, [currentChapterIndex]: d.chapter.content }));
                        }
                      })
                      .finally(() => setIsLoadingChapter(false));
                  }}
                  className="px-4 py-1.5 rounded-lg border border-current/20 text-xs hover:bg-current/10"
                >
                  重新加载此章
                </button>
              </div>
            ) : (
              <div className="space-y-6 font-serif tracking-normal whitespace-pre-line leading-relaxed">
                {activeContent || "（本章节暂未录入正文）"}
              </div>
            )}
          </div>

          {/* 底部翻章与导航条 */}
          <div className="mt-16 pt-8 border-t border-current/15 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs">
            <button
              onClick={() => {
                if (currentChapterIndex > 0) {
                  setCurrentChapterIndex(currentChapterIndex - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              disabled={currentChapterIndex === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-current/20 disabled:opacity-30 hover:bg-current/5 transition-colors font-serif font-medium"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>上一章</span>
            </button>

            <span className="opacity-70 font-mono text-[11px] text-center">
              第 {currentChapterIndex + 1} / {book.chapters.length} 章节 ({progressPercent}%) · 支持左右方向键翻章
            </span>

            <button
              onClick={() => {
                if (currentChapterIndex < book.chapters.length - 1) {
                  setCurrentChapterIndex(currentChapterIndex - 1 + 2);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              disabled={currentChapterIndex === book.chapters.length - 1}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-current/20 disabled:opacity-30 hover:bg-current/5 transition-colors font-serif font-medium"
            >
              <span>下一章</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
