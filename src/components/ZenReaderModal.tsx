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
  Bookmark,
  Check,
  List,
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
  const [bookmarked, setBookmarked] = useState(false);

  // Load user reading preferences
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("zenlib_theme") as ReadingTheme | null;
      if (savedTheme) setTheme(savedTheme);

      const savedFontSize = localStorage.getItem("zenlib_fontsize");
      if (savedFontSize) setFontSize(Number(savedFontSize));
    } catch {
      // ignore in SSR or restricted storage
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

  const currentChapter: BookChapter =
    book.chapters[currentChapterIndex] || book.chapters[0];

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
      const updated = Math.min(Math.max(prev + delta, 14), 23);
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
      bg: "bg-[#fbf7ee]",
      text: "text-[#3c3836]",
      border: "border-[#ebdccb]",
      header: "bg-[#fbf7ee]/90",
      activeTab: "bg-[#ebdccb] text-[#3c3836]",
    },
    dark: {
      bg: "bg-[#0c0d0e]",
      text: "text-[#e4e4e7]",
      border: "border-zinc-800",
      header: "bg-[#0c0d0e]/90",
      activeTab: "bg-zinc-800 text-white",
    },
    light: {
      bg: "bg-white",
      text: "text-zinc-900",
      border: "border-zinc-200",
      header: "bg-white/90",
      activeTab: "bg-zinc-100 text-zinc-900",
    },
    green: {
      bg: "bg-[#ecf4ec]",
      text: "text-[#243324]",
      border: "border-[#d1e4d1]",
      header: "bg-[#ecf4ec]/90",
      activeTab: "bg-[#d1e4d1] text-[#243324]",
    },
  };

  const currentThemeConfig = themeClasses[theme];
  const progressPercent = Math.round(
    ((currentChapterIndex + 1) / book.chapters.length) * 100
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col ${currentThemeConfig.bg} ${currentThemeConfig.text} transition-colors duration-200 select-text overflow-hidden`}
    >
      {/* Top Header Bar */}
      <header
        className={`sticky top-0 z-20 flex h-14 items-center justify-between border-b ${currentThemeConfig.border} ${currentThemeConfig.header} px-4 backdrop-blur-md transition-colors`}
      >
        <div className="flex items-center gap-3 truncate max-w-sm sm:max-w-md">
          <button
            onClick={() => setShowToc(!showToc)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:opacity-75 transition-opacity"
            title="查看目录"
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">目录</span>
          </button>
          <div className="h-4 w-px bg-current opacity-20"></div>
          <div className="flex flex-col truncate">
            <span className="text-xs font-bold truncate">{book.title}</span>
            <span className="text-[11px] opacity-70 truncate">{book.author}</span>
          </div>
        </div>

        {/* Reader Controls */}
        <div className="flex items-center gap-2">
          {/* Font size adjustments */}
          <div className="hidden sm:flex items-center gap-1 border-r border-current/15 pr-3 mr-1">
            <button
              onClick={() => handleFontSizeChange(-1)}
              className="p-1.5 rounded text-xs font-mono font-bold hover:bg-current/10"
              title="减小字号"
            >
              A-
            </button>
            <span className="text-[11px] font-mono px-1">{fontSize}px</span>
            <button
              onClick={() => handleFontSizeChange(1)}
              className="p-1.5 rounded text-xs font-mono font-bold hover:bg-current/10"
              title="增大字号"
            >
              A+
            </button>
          </div>

          {/* Theme Palette Switcher */}
          <div className="flex items-center gap-1 border-r border-current/15 pr-2 mr-1">
            <button
              onClick={() => handleThemeChange("sepia")}
              className={`h-5 w-5 rounded-full bg-[#fbf7ee] border border-amber-200 ${
                theme === "sepia" ? "ring-2 ring-amber-500 scale-110" : ""
              }`}
              title="羊皮纸暖调"
            />
            <button
              onClick={() => handleThemeChange("dark")}
              className={`h-5 w-5 rounded-full bg-[#18181b] border border-zinc-700 ${
                theme === "dark" ? "ring-2 ring-blue-500 scale-110" : ""
              }`}
              title="曜石黑暗夜"
            />
            <button
              onClick={() => handleThemeChange("green")}
              className={`h-5 w-5 rounded-full bg-[#ecf4ec] border border-emerald-300 ${
                theme === "green" ? "ring-2 ring-emerald-500 scale-110" : ""
              }`}
              title="护眼抹茶绿"
            />
            <button
              onClick={() => handleThemeChange("light")}
              className={`h-5 w-5 rounded-full bg-white border border-zinc-300 ${
                theme === "light" ? "ring-2 ring-zinc-700 scale-110" : ""
              }`}
              title="极简纯白"
            />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-current/10 transition-colors"
            title="退出阅读 (ESC)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Progress Line */}
      <div className="w-full bg-current/10 h-0.5">
        <div
          className="bg-blue-600 h-0.5 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Content Area */}
      <div className="relative flex-1 overflow-y-auto px-4 py-8 sm:py-12 flex justify-center">
        {/* Table of Contents Drawer */}
        {showToc && (
          <div
            className={`absolute left-0 top-0 bottom-0 z-30 w-72 sm:w-80 shadow-2xl border-r ${currentThemeConfig.border} ${currentThemeConfig.bg} p-6 overflow-y-auto transition-all`}
          >
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-current/15">
              <span className="font-bold text-sm flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                <span>全书目录 ({book.chapters.length} 章节)</span>
              </span>
              <button
                onClick={() => setShowToc(false)}
                className="p-1 hover:bg-current/10 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              {book.chapters.map((chap, idx) => (
                <button
                  key={chap.id}
                  onClick={() => {
                    setCurrentChapterIndex(idx);
                    setShowToc(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    idx === currentChapterIndex
                      ? currentThemeConfig.activeTab + " font-bold"
                      : "hover:bg-current/5 opacity-80"
                  }`}
                >
                  <span className="truncate pr-2">{chap.title}</span>
                  {idx === currentChapterIndex && <Check className="h-3 w-3 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reader Article Body */}
        <article
          className="w-full max-w-2xl mx-auto flex flex-col justify-between"
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
        >
          <div>
            {/* Chapter Header */}
            <div className="mb-8 pb-4 border-b border-current/15">
              <div className="text-xs font-mono tracking-wider opacity-60 mb-2 uppercase">
                {book.title} · Chapter {currentChapterIndex + 1} of {book.chapters.length}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {currentChapter.title}
              </h2>
            </div>

            {/* Chapter Text Content */}
            <div className="space-y-6 font-serif tracking-normal whitespace-pre-line leading-relaxed">
              {currentChapter.content}
            </div>
          </div>

          {/* Chapter Bottom Navigation */}
          <div className="mt-16 pt-8 border-t border-current/15 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs">
            <button
              onClick={() => {
                if (currentChapterIndex > 0) {
                  setCurrentChapterIndex(currentChapterIndex - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              disabled={currentChapterIndex === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-current/20 disabled:opacity-30 hover:bg-current/5 transition-colors font-medium"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>上一章</span>
            </button>

            <span className="opacity-70 font-mono text-[11px]">
              进度：{currentChapterIndex + 1} / {book.chapters.length} ({progressPercent}%) · 左右方向键翻章
            </span>

            <button
              onClick={() => {
                if (currentChapterIndex < book.chapters.length - 1) {
                  setCurrentChapterIndex(currentChapterIndex + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              disabled={currentChapterIndex === book.chapters.length - 1}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-current/20 disabled:opacity-30 hover:bg-current/5 transition-colors font-medium"
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
