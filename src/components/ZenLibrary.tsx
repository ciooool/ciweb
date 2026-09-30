"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Book,
  curatedBooks,
  getAutomatedWeeklyPick,
  getCurrentWeekOfYear,
} from "@/data/libraryData";
import ZenReaderModal from "@/components/ZenReaderModal";
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Star,
  Compass,
  UploadCloud,
  Library,
  Sparkles,
  RefreshCw,
  Smartphone,
  Laptop,
  Check,
  Trash2,
  Calendar,
  KeyRound,
} from "lucide-react";

export default function ZenLibrary() {
  const [activeTab, setActiveTab] = useState<"curated" | "bookshelf" | "import">("curated");
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  
  // 读者证号 (用于跨设备云同步)
  const [readerId, setReaderId] = useState<string>("");
  const [isEditingReaderId, setIsEditingReaderId] = useState<boolean>(false);
  const [tempReaderIdInput, setTempReaderIdInput] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // 书房与阅读进度
  const [myBookshelfIds, setMyBookshelfIds] = useState<string[]>([]);
  const [readingProgressMap, setReadingProgressMap] = useState<
    Record<string, { chapterIndex: number; percentage: number; updatedAt: string }>
  >({});
  
  // 本地导入书籍
  const [customBooks, setCustomBooks] = useState<Book[]>([]);

  // 阅读器状态
  const [readingBook, setReadingBook] = useState<Book | null>(null);
  const [readingChapterIndex, setReadingChapterIndex] = useState<number>(0);

  // 1. 本地初始化加载
  useEffect(() => {
    try {
      // 读者证号：如果本地没有，生成一个易记的 6 位数字码 (如 913849)
      const storedReaderId = localStorage.getItem("zenlib_reader_id");
      const initialId = storedReaderId || "913849";
      setReaderId(initialId);
      setTempReaderIdInput(initialId);
      if (!storedReaderId) {
        localStorage.setItem("zenlib_reader_id", initialId);
      }

      // 本地书房
      const savedShelf = localStorage.getItem("zenlib_my_bookshelf");
      if (savedShelf) {
        setMyBookshelfIds(JSON.parse(savedShelf));
      } else {
        setMyBookshelfIds(["navals-almanack", "dao-de-jing"]);
      }

      // 本地自定义书籍
      const savedCustom = localStorage.getItem("zenlib_custom_books");
      if (savedCustom) {
        setCustomBooks(JSON.parse(savedCustom));
      }

      // 阅读进度
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

  // 2. 跨设备云端双向同步函数 (电脑端 <-> 手机端)
  const syncWithCloud = useCallback(async (targetReaderId?: string) => {
    const idToUse = (targetReaderId || readerId).trim();
    if (!idToUse) return;

    setIsSyncing(true);
    setSyncNotice(null);

    try {
      const res = await fetch("/api/library/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          readerId: idToUse,
          bookshelf: myBookshelfIds,
          progress: readingProgressMap,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const cloudShelf: string[] = json.data.bookshelf || [];
        const cloudProgress = json.data.progress || {};

        setMyBookshelfIds(cloudShelf);
        setReadingProgressMap(cloudProgress);

        localStorage.setItem("zenlib_my_bookshelf", JSON.stringify(cloudShelf));
        localStorage.setItem("zenlib_reader_id", idToUse);
        Object.entries(cloudProgress).forEach(([bId, pVal]) => {
          localStorage.setItem(`zenlib_progress_${bId}`, JSON.stringify(pVal));
        });

        setSyncNotice(`已成功与云端对齐 (证号: ${idToUse})`);
        setTimeout(() => setSyncNotice(null), 3000);
      }
    } catch {
      setSyncNotice("网络连通异常，使用本地离线副本");
      setTimeout(() => setSyncNotice(null), 3000);
    } finally {
      setIsSyncing(false);
    }
  }, [readerId, myBookshelfIds, readingProgressMap]);

  // 保存新读者证号并同步
  const handleSaveReaderId = () => {
    const clean = tempReaderIdInput.trim();
    if (clean) {
      setReaderId(clean);
      setIsEditingReaderId(false);
      localStorage.setItem("zenlib_reader_id", clean);
      syncWithCloud(clean);
    }
  };

  const allAvailableBooks = [...curatedBooks, ...customBooks];

  // 书房收藏切换
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
    // 异步同步到云端
    setTimeout(() => {
      fetch("/api/library/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          readerId,
          bookshelf: updated,
          progress: readingProgressMap,
        }),
      }).catch(() => {});
    }, 500);
  };

  // 打开沉浸阅读器
  const handleOpenReader = (book: Book, chapterIdx = 0) => {
    setReadingBook(book);
    setReadingChapterIndex(chapterIdx);
  };

  // 拖拽本地文件解析
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const rawChapters = text.split(/(?=第[0-9一二三四五六七八九十百]+[章节回卷])/g);
      const chapters =
        rawChapters.length > 1
          ? rawChapters.map((content, idx) => ({
              id: `local-ch-${idx + 1}`,
              title: content.slice(0, 30).split("\n")[0].trim() || `第 ${idx + 1} 节`,
              content: content.trim(),
            }))
          : [
              {
                id: "local-ch-1",
                title: "正文阅读",
                content: text.trim(),
              },
            ];

      const newCustomBook: Book = {
        id: `custom-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        author: "私人本地书卷",
        coverTone: "slate",
        coverColor: "bg-[#EFECE6] text-[#4A4843] border-[#DDD8CE]",
        category: "精神林泉",
        tagline: "本地拖拽导入的专属私密书籍",
        description: `由本地导入，共包含 ${chapters.length} 个章节，纯客户端解析保存，永不上传服务器。`,
        curatorNote: "【私人藏书】在本地设备私密阅读，阅读进度将自动保存至当前书房。",
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

      handleOpenReader(newCustomBook, 0);
    };
    reader.readAsText(file);
  };

  // 全自动 52 周轮转推荐
  const { book: weeklyPickBook, weekNumber } = getAutomatedWeeklyPick(curatedBooks);

  // 分类筛选
  const categories = ["全部", "商业与杠杆", "东方至道", "工匠技艺", "精神林泉"];
  const filteredBooks =
    selectedCategory === "全部"
      ? curatedBooks
      : curatedBooks.filter((b) => b.category === selectedCategory);

  const bookshelfBooks = allAvailableBooks.filter((b) => myBookshelfIds.includes(b.id));

  return (
    <section id="library" className="py-20 md:py-28 border-b border-[#E8E3DA] dark:border-[#33302B] transition-colors">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* --- Header Section (清新书卷气排版) --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-serif tracking-widest text-[#C27D53] dark:text-[#D89469] uppercase mb-3">
              <Library className="h-3.5 w-3.5" />
              <span>ZenLib · 掌上云端书房</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-book-serif font-normal text-[#2C2A29] dark:text-[#EDE9E3] tracking-tight">
              灵感书阁与沉浸阅读室
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#6E6B65] dark:text-[#A8A49C] max-w-2xl leading-relaxed">
              受公共图书馆纯粹阅读体验启发：<strong>纯净零广告，全天候静心研读</strong>。
              涵盖东方心法与独立商业哲学，支持跨终端设备进度无感漫游。
            </p>
          </div>

          {/* 跨终端借阅证同步卡片 */}
          <div className="flex flex-col items-start sm:items-end gap-2 bg-[#F5F2EC] dark:bg-[#201F1D] p-3.5 rounded-2xl border border-[#E8E3DA] dark:border-[#33302B] shadow-2xs">
            <div className="flex items-center gap-2 text-xs text-[#6E6B65] dark:text-[#A8A49C]">
              <span className="h-2 w-2 rounded-full bg-[#5F7A6A] animate-pulse"></span>
              <span className="font-serif">云端读者借阅证：</span>
              
              {isEditingReaderId ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tempReaderIdInput}
                    onChange={(e) => setTempReaderIdInput(e.target.value)}
                    placeholder="如: 888888"
                    className="w-24 px-2 py-0.5 text-xs font-mono rounded border border-[#C27D53] bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                  <button
                    onClick={handleSaveReaderId}
                    className="px-2 py-0.5 bg-[#C27D53] text-white rounded text-[11px]"
                  >
                    绑定
                  </button>
                </div>
              ) : (
                <span
                  onClick={() => setIsEditingReaderId(true)}
                  className="font-mono font-bold text-[#2C2A29] dark:text-[#EDE9E3] bg-white dark:bg-zinc-800 px-2 py-0.5 rounded cursor-pointer border border-[#E8E3DA] dark:border-[#33302B] hover:border-[#C27D53]"
                  title="点击可修改为你的专属卡号"
                >
                  {readerId || "未绑定"} ✏️
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-[11px] text-[#8C8881]">
              <span className="flex items-center gap-1">
                <Laptop className="h-3 w-3" />
                <span>电脑</span>
                <span>⇄</span>
                <Smartphone className="h-3 w-3" />
                <span>手机免密对齐</span>
              </span>
              <button
                onClick={() => syncWithCloud()}
                disabled={isSyncing}
                className="inline-flex items-center gap-1 font-serif text-[#C27D53] hover:underline"
              >
                <RefreshCw className={`h-3 w-3 ${isSyncing ? "animate-spin" : ""}`} />
                <span>{isSyncing ? "同步中..." : "即刻同步"}</span>
              </button>
            </div>

            {syncNotice && (
              <span className="text-[10px] text-[#5F7A6A] font-serif">{syncNotice}</span>
            )}
          </div>
        </div>

        {/* --- 1. Automated Weekly Pick Hero (轻奢杂志级排版) --- */}
        <div className="relative overflow-hidden rounded-3xl bg-[#FAF6F0] dark:bg-[#201F1D] border border-[#E5DAC8] dark:border-[#38342E] p-6 sm:p-10 md:p-12 mb-16 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Book Details */}
            <div className="lg:col-span-8 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-serif text-[#C27D53] bg-[#F0E6D8] dark:bg-[#332A22] border border-[#E5DAC8] dark:border-[#473B2F] mb-4">
                <Calendar className="h-3.5 w-3.5" />
                <span>第 {weekNumber} 周 · 全自动主理人轮转精选</span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-book-serif font-normal text-[#2C2A29] dark:text-[#EDE9E3] leading-snug mb-3">
                {weeklyPickBook.title}
              </h3>
              
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#8C8881] font-serif mb-5">
                <span>著：{weeklyPickBook.author}</span>
                <span>·</span>
                <span>{weeklyPickBook.category}</span>
                <span>·</span>
                <span>{weeklyPickPickMeta(weeklyPickBook)}</span>
              </div>

              <p className="text-sm sm:text-base text-[#59554E] dark:text-[#B8B4AB] leading-relaxed mb-6 font-serif">
                {weeklyPickBook.description}
              </p>

              {/* Curator Note Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-[#E8E3DA] dark:border-[#33302B] text-xs sm:text-sm text-[#4A4742] dark:text-[#CCC7BE] font-serif leading-relaxed mb-8 relative">
                <span className="text-2xl text-[#C27D53] absolute -top-2 left-3 font-serif">“</span>
                <p className="pl-4 italic">{weeklyPickBook.curatorNote}</p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => handleOpenReader(weeklyPickBook, 0)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#2C2A29] text-[#FAF8F5] dark:bg-[#EDE9E3] dark:text-[#181716] text-xs font-serif font-semibold hover:opacity-90 transition-all hover:scale-[1.02] shadow-xs"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>即刻沉浸阅读</span>
                </button>

                <button
                  onClick={() => toggleBookshelf(weeklyPickBook.id)}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-serif font-medium border transition-colors ${
                    myBookshelfIds.includes(weeklyPickBook.id)
                      ? "bg-[#5F7A6A]/10 text-[#5F7A6A] border-[#5F7A6A]/30 dark:bg-[#789984]/20 dark:text-[#789984]"
                      : "bg-white dark:bg-zinc-800 text-[#2C2A29] dark:text-[#EDE9E3] border-[#E8E3DA] dark:border-[#33302B] hover:bg-stone-50"
                  }`}
                >
                  {myBookshelfIds.includes(weeklyPickBook.id) ? (
                    <>
                      <BookmarkCheck className="h-4 w-4" />
                      <span>已在在读书房</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4" />
                      <span>放入我的书房</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: 3:4 Realistic Hardcover Book Spine */}
            <div className="lg:col-span-4 flex justify-center">
              <div
                onClick={() => handleOpenReader(weeklyPickBook, 0)}
                className={`group cursor-pointer relative w-52 sm:w-60 h-72 sm:h-80 rounded-2xl p-6 flex flex-col justify-between border shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1.5 ${weeklyPickBook.coverColor}`}
              >
                {/* Book spine ribbon detail */}
                <div className="absolute left-3 top-0 bottom-0 w-2.5 bg-black/5 dark:bg-white/5 border-r border-black/10 dark:border-white/10" />

                <div className="pl-4 flex justify-between items-start">
                  <span className="text-[10px] font-mono tracking-widest uppercase opacity-70">
                    {weeklyPickBook.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>{weeklyPickBook.rating}</span>
                  </div>
                </div>

                <div className="pl-4 my-auto">
                  <h4 className="font-book-serif text-xl sm:text-2xl font-bold leading-tight mb-2">
                    {weeklyPickBook.title}
                  </h4>
                  <p className="text-xs opacity-75 line-clamp-2">{weeklyPickBook.tagline}</p>
                </div>

                <div className="pl-4 pt-3 border-t border-current/15 flex justify-between items-center text-[10px] font-mono opacity-60">
                  <span>ZENLIB READER</span>
                  <span>OPEN &rarr;</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 2. Tab Navigation --- */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8E3DA] dark:border-[#33302B] pb-4 mb-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("curated")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif transition-all ${
                activeTab === "curated"
                  ? "bg-[#2C2A29] text-[#FAF8F5] dark:bg-[#EDE9E3] dark:text-[#181716] shadow-xs"
                  : "text-[#6E6B65] hover:text-[#2C2A29] dark:text-[#A8A49C] dark:hover:text-[#EDE9E3]"
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>发现藏书阁</span>
            </button>

            <button
              onClick={() => setActiveTab("bookshelf")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif transition-all ${
                activeTab === "bookshelf"
                  ? "bg-[#2C2A29] text-[#FAF8F5] dark:bg-[#EDE9E3] dark:text-[#181716] shadow-xs"
                  : "text-[#6E6B65] hover:text-[#2C2A29] dark:text-[#A8A49C] dark:hover:text-[#EDE9E3]"
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>我的在读书房</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#C27D53]/20 text-[#C27D53] font-mono">
                {myBookshelfIds.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("import")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif transition-all ${
                activeTab === "import"
                  ? "bg-[#2C2A29] text-[#FAF8F5] dark:bg-[#EDE9E3] dark:text-[#181716] shadow-xs"
                  : "text-[#6E6B65] hover:text-[#2C2A29] dark:text-[#A8A49C] dark:hover:text-[#EDE9E3]"
              }`}
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>本地自选书拖入</span>
            </button>
          </div>

          {activeTab === "curated" && (
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-serif">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    selectedCategory === cat
                      ? "bg-[#E8E3DA] dark:bg-[#33302B] text-[#2C2A29] dark:text-[#EDE9E3] font-bold"
                      : "text-[#8C8881] hover:text-[#2C2A29] dark:hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- View 1: Curated Library Grid (轻奢卡片) --- */}
        {activeTab === "curated" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book) => {
              const inShelf = myBookshelfIds.includes(book.id);
              const progress = readingProgressMap[book.id];

              return (
                <div
                  key={book.id}
                  className="flex flex-col justify-between rounded-3xl bg-white dark:bg-[#201F1D] p-7 border border-[#E8E3DA] dark:border-[#33302B] shadow-2xs hover:shadow-md transition-all hover:border-[#D5CEBF]"
                >
                  <div>
                    {/* Top Spine Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-serif px-2.5 py-0.5 rounded-full bg-[#F5F2EC] dark:bg-[#272522] text-[#6E6B65] dark:text-[#A8A49C]">
                        {book.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-[#C27D53]">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span>{book.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-book-serif font-bold text-[#2C2A29] dark:text-[#EDE9E3] mb-1.5 leading-snug">
                      {book.title}
                    </h3>
                    <p className="text-xs text-[#8C8881] font-serif mb-4">
                      著：{book.author} · {book.totalWords}
                    </p>

                    <p className="text-xs sm:text-sm text-[#59554E] dark:text-[#A8A49C] leading-relaxed mb-6 font-serif line-clamp-3">
                      {book.description}
                    </p>
                  </div>

                  <div>
                    {/* Reading Progress Line if any */}
                    {progress && (
                      <div className="mb-4 p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#181716] border border-[#E8E3DA] dark:border-[#33302B]">
                        <div className="flex justify-between text-[11px] text-[#8C8881] font-serif mb-1">
                          <span>已读到第 {progress.chapterIndex + 1} 章</span>
                          <span className="font-mono">{progress.percentage}%</span>
                        </div>
                        <div className="w-full bg-[#E8E3DA] dark:bg-[#33302B] rounded-full h-1">
                          <div
                            className="bg-[#C27D53] h-1 rounded-full transition-all"
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-[#F0EBE1] dark:border-[#272522]">
                      <button
                        onClick={() =>
                          handleOpenReader(book, progress ? progress.chapterIndex : 0)
                        }
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#2C2A29] text-[#FAF8F5] dark:bg-[#EDE9E3] dark:text-[#181716] text-xs font-serif font-semibold hover:opacity-90 transition-colors"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{progress ? "继续阅读" : "沉浸阅读"}</span>
                      </button>

                      <button
                        onClick={() => toggleBookshelf(book.id)}
                        className={`p-2.5 rounded-xl border text-xs transition-colors ${
                          inShelf
                            ? "bg-[#5F7A6A]/10 text-[#5F7A6A] border-[#5F7A6A]/30"
                            : "border-[#E8E3DA] hover:bg-stone-50 dark:border-[#33302B] text-[#8C8881]"
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
              <div className="text-center py-20 border border-dashed border-[#E8E3DA] dark:border-[#33302B] rounded-3xl bg-[#FAF8F5] dark:bg-[#201F1D]">
                <BookOpen className="h-10 w-10 text-[#8C8881] mx-auto mb-3 opacity-60" />
                <h3 className="text-base font-serif font-bold text-[#2C2A29] dark:text-[#EDE9E3] mb-1">
                  书房静候书卷
                </h3>
                <p className="text-xs text-[#8C8881] font-serif mb-6">
                  在“发现藏书阁”中点击“放入书房”，或在不同设备输入相同借阅证号同步。
                </p>
                <button
                  onClick={() => setActiveTab("curated")}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#2C2A29] text-[#FAF8F5] dark:bg-[#EDE9E3] dark:text-[#181716] text-xs font-serif"
                >
                  去发现好书
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {bookshelfBooks.map((book) => {
                  const progress = readingProgressMap[book.id];

                  return (
                    <div
                      key={book.id}
                      className="flex flex-col justify-between rounded-3xl bg-white dark:bg-[#201F1D] p-7 border border-[#E8E3DA] dark:border-[#33302B] shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-serif text-[#5F7A6A] flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-[#5F7A6A]" />
                            <span>在读研习</span>
                          </span>
                          <button
                            onClick={() => toggleBookshelf(book.id)}
                            className="text-[#8C8881] hover:text-red-500 p-1"
                            title="移出书房"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <h3 className="text-xl font-book-serif font-bold text-[#2C2A29] dark:text-[#EDE9E3] mb-1">
                          {book.title}
                        </h3>
                        <p className="text-xs text-[#8C8881] font-serif mb-4">
                          著：{book.author} · 共 {book.chapters.length} 章节
                        </p>
                      </div>

                      <div>
                        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#181716] border border-[#E8E3DA] dark:border-[#33302B] mb-4">
                          <div className="flex justify-between text-xs text-[#59554E] dark:text-[#A8A49C] font-serif mb-1.5">
                            <span>
                              {progress
                                ? `读至第 ${progress.chapterIndex + 1} 章`
                                : "尚未启卷"}
                            </span>
                            <span className="font-mono text-[#C27D53] font-bold">
                              {progress ? `${progress.percentage}%` : "0%"}
                            </span>
                          </div>
                          <div className="w-full bg-[#E8E3DA] dark:bg-[#33302B] rounded-full h-1.5">
                            <div
                              className="bg-[#C27D53] h-1.5 rounded-full transition-all"
                              style={{ width: `${progress ? progress.percentage : 4}%` }}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            handleOpenReader(book, progress ? progress.chapterIndex : 0)
                          }
                          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#2C2A29] text-[#FAF8F5] dark:bg-[#EDE9E3] dark:text-[#181716] text-xs font-serif font-semibold hover:opacity-90 transition-colors shadow-2xs"
                        >
                          <BookOpen className="h-4 w-4" />
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
          <div className="max-w-xl mx-auto p-10 rounded-3xl border border-[#E8E3DA] dark:border-[#33302B] bg-white dark:bg-[#201F1D] text-center shadow-xs">
            <div className="h-16 w-16 rounded-2xl bg-[#FAF6F0] dark:bg-[#272522] text-[#C27D53] flex items-center justify-center mx-auto mb-5 border border-[#E5DAC8] dark:border-[#38342E]">
              <UploadCloud className="h-8 w-8" />
            </div>

            <h3 className="text-2xl font-book-serif font-bold text-[#2C2A29] dark:text-[#EDE9E3] mb-2">
              拖入电脑自选手稿与电子书
            </h3>
            <p className="text-xs sm:text-sm text-[#6E6B65] dark:text-[#A8A49C] max-w-md mx-auto mb-8 font-serif leading-relaxed">
              支持直接拖入 <strong>.txt</strong> 或 <strong>.md</strong> 纯文本文件。
              纯浏览器本地解析切分章节，<strong>永不上传任何服务器</strong>，保护你的私密书卷天地。
            </p>

            <label className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#C27D53] text-white font-serif font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-xs">
              <UploadCloud className="h-4 w-4" />
              <span>选取文件立即开启阅读</span>
              <input
                type="file"
                accept=".txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
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
            const newPercentage = Math.round(
              ((chapterIndex + 1) / (readingBook?.chapters.length || 1)) * 100
            );
            const newProgressMap = {
              ...readingProgressMap,
              [bookId]: {
                chapterIndex,
                percentage: newPercentage,
                updatedAt: new Date().toISOString(),
              },
            };
            setReadingProgressMap(newProgressMap);

            // 自动静默同步云端
            fetch("/api/library/sync", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                readerId,
                bookshelf: myBookshelfIds,
                progress: newProgressMap,
              }),
            }).catch(() => {});
          }}
        />
      )}
    </section>
  );
}

function weeklyPickPickMeta(book: Book) {
  return `${book.totalWords} · ${book.estimatedReadTime}`;
}
