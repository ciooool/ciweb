"use client";

import React, { useState, useEffect } from "react";
import { Book, curatedBooks } from "@/data/libraryData";
import ZenReaderModal from "@/components/ZenReaderModal";
import {
  BookOpen,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Clock,
  Star,
  Compass,
  UploadCloud,
  ChevronRight,
  Library,
  Flame,
  CheckCircle2,
  Trash2,
} from "lucide-react";

export default function ZenLibrary() {
  const [activeTab, setActiveTab] = useState<"curated" | "bookshelf" | "import">("curated");
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  const [myBookshelfIds, setMyBookshelfIds] = useState<string[]>([]);
  const [readingProgressMap, setReadingProgressMap] = useState<
    Record<string, { chapterIndex: number; percentage: number; updatedAt: string }>
  >({});
  
  // Custom uploaded books in localStorage
  const [customBooks, setCustomBooks] = useState<Book[]>([]);

  // Active reading modal state
  const [readingBook, setReadingBook] = useState<Book | null>(null);
  const [readingChapterIndex, setReadingChapterIndex] = useState<number>(0);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const savedShelf = localStorage.getItem("zenlib_my_bookshelf");
      if (savedShelf) {
        setMyBookshelfIds(JSON.parse(savedShelf));
      } else {
        // Default seed: Naval's almanack & Dao De Jing
        setMyBookshelfIds(["navals-almanack", "dao-de-jing"]);
      }

      const savedCustom = localStorage.getItem("zenlib_custom_books");
      if (savedCustom) {
        setCustomBooks(JSON.parse(savedCustom));
      }

      // Load progress map
      const allBooks = [...curatedBooks, ...(savedCustom ? JSON.parse(savedCustom) : [])];
      const progMap: Record<string, { chapterIndex: number; percentage: number; updatedAt: string }> = {};
      allBooks.forEach((b) => {
        const item = localStorage.getItem(`zenlib_progress_${b.id}`);
        if (item) {
          progMap[b.id] = JSON.parse(item);
        }
      });
      setReadingProgressMap(progMap);
    } catch {
      // ignore
    }
  }, []);

  const allAvailableBooks = [...curatedBooks, ...customBooks];

  // Toggle bookshelf membership
  const toggleBookshelf = (bookId: string) => {
    let updated: string[];
    if (myBookshelfIds.includes(bookId)) {
      updated = myBookshelfIds.filter((id) => id !== bookId);
    } else {
      updated = [...myBookshelfIds, bookId];
    }
    setMyBookshelfIds(updated);
    try {
      localStorage.setItem("zenlib_my_bookshelf", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Open book in Zen Reader
  const handleOpenReader = (book: Book, chapterIdx = 0) => {
    setReadingBook(book);
    setReadingChapterIndex(chapterIdx);
  };

  // Handle local file drop (.txt or .md)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      // Simple auto-splitting into chapters
      const rawChapters = text.split(/(?=第[0-9一二三四五六七八九十百]+[章节回卷])/g);
      const chapters = rawChapters.length > 1
        ? rawChapters.map((content, idx) => ({
            id: `local-ch-${idx + 1}`,
            title: content.slice(0, 30).split("\n")[0].trim() || `第 ${idx + 1} 节`,
            content: content.trim(),
          }))
        : [
            {
              id: "local-ch-1",
              title: "全文阅读",
              content: text.trim(),
            },
          ];

      const newCustomBook: Book = {
        id: `custom-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        author: "本地导入书籍",
        coverGradient: "from-zinc-700 via-zinc-800 to-zinc-950",
        category: "人文沉思",
        tagline: "本地拖拽导入的专属私有书籍",
        description: `于本地导入，共包含 ${chapters.length} 个章节，纯客户端解析保存。`,
        rating: 5.0,
        totalWords: `约 ${Math.round(text.length / 1000)}k 字`,
        estimatedReadTime: `${Math.max(1, Math.round(text.length / 500))} 分钟`,
        chapters,
      };

      const updatedCustom = [newCustomBook, ...customBooks];
      setCustomBooks(updatedCustom);
      const updatedShelf = [newCustomBook.id, ...myBookshelfIds];
      setMyBookshelfIds(updatedShelf);

      try {
        localStorage.setItem("zenlib_custom_books", JSON.stringify(updatedCustom));
        localStorage.setItem("zenlib_my_bookshelf", JSON.stringify(updatedShelf));
      } catch {
        // ignore
      }

      // Auto start reading!
      handleOpenReader(newCustomBook, 0);
    };
    reader.readAsText(file);
  };

  // Weekly featured book
  const weeklyBook = curatedBooks.find((b) => b.isWeeklyPick) || curatedBooks[0];

  // Category filter
  const categories = ["全部", "哲学与智慧", "独立开发与商业", "工程心法", "人文沉思"];
  const filteredBooks =
    selectedCategory === "全部"
      ? curatedBooks
      : curatedBooks.filter((b) => b.category === selectedCategory);

  const bookshelfBooks = allAvailableBooks.filter((b) => myBookshelfIds.includes(b.id));

  return (
    <section id="library" className="py-16 md:py-24 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-gradient-to-b from-transparent via-zinc-50/50 to-transparent dark:via-zinc-900/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
              <Library className="h-3.5 w-3.5" />
              <span>ZenLib · 沉浸式数字禅房</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              灵感书房与免费阅读阁
            </h2>
            <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
              受公共图书馆纯粹阅读体验启发：<strong>纯净零广告</strong>。沉淀精选传世经典与极客心法，支持个人书房断点续读与本地书籍拖拽即读。
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-800/80 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>本地在读书房已就绪</span>
          </div>
        </div>

        {/* --- 1. Weekly Pick Hero Banner --- */}
        {weeklyBook && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-indigo-950 to-zinc-950 text-white p-6 sm:p-8 md:p-10 mb-12 shadow-xl border border-zinc-800">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-4">
                  <Flame className="h-3.5 w-3.5" />
                  <span>本周主理人精选好书</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                  {weeklyBook.title}
                </h3>
                <p className="text-xs font-mono text-blue-300 mb-4">
                  著：{weeklyBook.author} · {weeklyBook.totalWords} · {weeklyBook.estimatedReadTime}
                </p>

                <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                  {weeklyBook.description}
                </p>

                {weeklyBook.curatorNote && (
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 italic mb-6">
                    {weeklyBook.curatorNote}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleOpenReader(weeklyBook, 0)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-100 transition-all hover:scale-[1.02] shadow-sm"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>即刻沉浸阅读</span>
                  </button>

                  <button
                    onClick={() => toggleBookshelf(weeklyBook.id)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
                      myBookshelfIds.includes(weeklyBook.id)
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                    }`}
                  >
                    {myBookshelfIds.includes(weeklyBook.id) ? (
                      <>
                        <BookmarkCheck className="h-4 w-4 text-emerald-400" />
                        <span>已在我的书房</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4" />
                        <span>加入我的书房</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Aesthetic Book spine/card representation */}
              <div className="shrink-0 w-full sm:w-64 h-48 sm:h-64 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-700 to-purple-900 p-6 flex flex-col justify-between shadow-2xl border border-white/20 transform sm:rotate-2 hover:rotate-0 transition-transform">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono tracking-widest uppercase opacity-80">
                    {weeklyBook.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-300 text-xs font-bold">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>{weeklyBook.rating}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-lg text-white leading-tight mb-1">
                    {weeklyBook.title}
                  </h4>
                  <p className="text-xs opacity-80 text-zinc-200">{weeklyBook.tagline}</p>
                </div>

                <div className="text-[11px] font-mono opacity-60 border-t border-white/20 pt-2">
                  ZenLib Reader Edition
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 2. Tab Navigation & Controls --- */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("curated")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "curated"
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>发现精选藏书</span>
            </button>

            <button
              onClick={() => setActiveTab("bookshelf")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "bookshelf"
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>我的在读书房</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400">
                {myBookshelfIds.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("import")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "import"
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>导入本地自选书</span>
            </button>
          </div>

          {activeTab === "curated" && (
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    selectedCategory === cat
                      ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white font-medium"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- View 1: Curated Library Grid --- */}
        {activeTab === "curated" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => {
              const inShelf = myBookshelfIds.includes(book.id);
              const progress = readingProgressMap[book.id];

              return (
                <div
                  key={book.id}
                  className="flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all hover:shadow-md"
                >
                  <div>
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                        {book.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span>{book.rating}</span>
                      </div>
                    </div>

                    {/* Book spine aesthetic bar */}
                    <div
                      className={`h-2.5 w-16 rounded-full bg-gradient-to-r ${book.coverGradient} mb-4`}
                    />

                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                      著：{book.author} · {book.totalWords}
                    </p>

                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
                      {book.description}
                    </p>
                  </div>

                  <div>
                    {/* Reading progress if any */}
                    {progress && (
                      <div className="mb-4">
                        <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                          <span>已读到第 {progress.chapterIndex + 1} 章</span>
                          <span>{progress.percentage}%</span>
                        </div>
                        <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1">
                          <div
                            className="bg-blue-600 h-1 rounded-full"
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <button
                        onClick={() =>
                          handleOpenReader(book, progress ? progress.chapterIndex : 0)
                        }
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{progress ? "继续阅读" : "沉浸阅读"}</span>
                      </button>

                      <button
                        onClick={() => toggleBookshelf(book.id)}
                        className={`p-2 rounded-xl border text-xs transition-colors ${
                          inShelf
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                            : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800 text-zinc-500"
                        }`}
                        title={inShelf ? "移出书房" : "加入书房"}
                      >
                        {inShelf ? (
                          <BookmarkCheck className="h-4 w-4" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- View 2: My Bookshelf --- */}
        {activeTab === "bookshelf" && (
          <div>
            {bookshelfBooks.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl">
                <BookOpen className="h-10 w-10 text-zinc-400 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">
                  书房空空如也
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
                  在“发现精选藏书”中点击“加入我的书房”，或者导入本地 TXT/MD 书籍。
                </p>
                <button
                  onClick={() => setActiveTab("curated")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-semibold"
                >
                  去发现好书
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookshelfBooks.map((book) => {
                  const progress = readingProgressMap[book.id];

                  return (
                    <div
                      key={book.id}
                      className="flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>在读藏书</span>
                          </span>
                          <button
                            onClick={() => toggleBookshelf(book.id)}
                            className="text-zinc-400 hover:text-red-500 p-1"
                            title="从书房移出"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
                          {book.title}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                          著：{book.author} · 共 {book.chapters.length} 章节
                        </p>
                      </div>

                      <div>
                        {/* Progress */}
                        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 mb-4">
                          <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-300 font-medium mb-1.5">
                            <span>
                              {progress
                                ? `读至第 ${progress.chapterIndex + 1} 章`
                                : "尚未开始阅读"}
                            </span>
                            <span className="font-mono">{progress ? `${progress.percentage}%` : "0%"}</span>
                          </div>
                          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-1.5">
                            <div
                              className="bg-emerald-500 h-1.5 rounded-full transition-all"
                              style={{ width: `${progress ? progress.percentage : 5}%` }}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            handleOpenReader(book, progress ? progress.chapterIndex : 0)
                          }
                          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-xs"
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>{progress ? "断点续读" : "开始阅读"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- View 3: Local File Import --- */}
        {activeTab === "import" && (
          <div className="max-w-2xl mx-auto p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs text-center">
            <div className="h-16 w-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
              <UploadCloud className="h-8 w-8" />
            </div>

            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
              拖拽导入你的本地电子书 / 文本
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-6 leading-relaxed">
              支持直接选择或拖入电脑中的 <strong>.txt</strong> 或 <strong>.md</strong> 格式文件。
              纯浏览器本地解析与存储，<strong>绝不上传任何服务器</strong>，安全保护你的私密阅读体验。
            </p>

            <label className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors cursor-pointer shadow-sm">
              <UploadCloud className="h-4 w-4" />
              <span>选择本地文件即刻开启阅读</span>
              <input
                type="file"
                accept=".txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-center gap-6 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>自动拆分章节</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>纯本地隐私存储</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>永久无广告沉浸</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Full-screen Zen Reader Modal */}
      {readingBook && (
        <ZenReaderModal
          book={readingBook}
          initialChapterIndex={readingChapterIndex}
          onClose={() => setReadingBook(null)}
          onProgressUpdate={(bookId, chapterIndex) => {
            setReadingProgressMap((prev) => ({
              ...prev,
              [bookId]: {
                chapterIndex,
                percentage: Math.round(
                  ((chapterIndex + 1) / (readingBook?.chapters.length || 1)) * 100
                ),
                updatedAt: new Date().toISOString(),
              },
            }));
          }}
        />
      )}
    </section>
  );
}
