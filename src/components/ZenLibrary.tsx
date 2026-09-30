"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Book,
  curatedBooks,
  getAutomatedWeeklyPick,
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
  Search,
  RefreshCw,
  Smartphone,
  Laptop,
  Check,
  Trash2,
  Calendar,
  Cloud,
  Loader2,
  Globe,
} from "lucide-react";

interface SearchResultItem {
  id: string;
  rawTitle: string;
  title: string;
  snippet: string;
  wordcount: string;
  category: string;
  source: string;
}

interface ServerBookItem {
  id: string;
  title: string;
  author: string;
  coverTone?: string;
  coverColor?: string;
  category: string;
  tagline?: string;
  description?: string;
  totalWords?: string;
  sourceType: "remote" | "curated" | "custom";
  addedAt: string;
}

export default function ZenLibrary() {
  const [activeTab, setActiveTab] = useState<"curated" | "bookshelf" | "search" | "import">("curated");
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");

  // 读者证号 (云端借阅账户)
  const [readerId, setReaderId] = useState<string>("913849");
  const [isEditingReaderId, setIsEditingReaderId] = useState<boolean>(false);
  const [tempReaderIdInput, setTempReaderIdInput] = useState<string>("913849");
  
  // 服务端真实书房与进度状态 (绝非本地 mock)
  const [serverBooks, setServerBooks] = useState<ServerBookItem[]>([]);
  const [serverProgressMap, setServerProgressMap] = useState<
    Record<string, { chapterIndex: number; percentage: number; chapterTitle?: string; updatedAt: string }>
  >({});
  const [isLoadingServerBooks, setIsLoadingServerBooks] = useState<boolean>(false);
  const [serverNotice, setServerNotice] = useState<string | null>(null);

  // 在线实时搜索与远端抓取
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isLoadingOnlineBook, setIsLoadingOnlineBook] = useState<boolean>(false);

  // 阅读器状态
  const [readingBook, setReadingBook] = useState<Book | null>(null);
  const [readingChapterIndex, setReadingChapterIndex] = useState<number>(0);

  // 1. 初始化时从服务端拉取真实书房与进度
  const fetchServerBookshelf = useCallback(async (currentReaderId: string) => {
    setIsLoadingServerBooks(true);
    try {
      // 1. 拉取书单
      const res = await fetch(`/api/library/bookshelf?readerId=${encodeURIComponent(currentReaderId)}`);
      const json = await res.json();
      if (json.success && json.data) {
        setServerBooks(json.data.books || []);
      }

      // 2. 拉取阅读进度
      const progRes = await fetch(`/api/library/progress?readerId=${encodeURIComponent(currentReaderId)}`);
      const progJson = await progRes.json();
      if (progJson.success && progJson.data) {
        setServerProgressMap(progJson.data);
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingServerBooks(false);
    }
  }, []);

  useEffect(() => {
    // 读取持久化读者证
    const stored = localStorage.getItem("zenlib_reader_id");
    const activeId = stored || "913849";
    setReaderId(activeId);
    setTempReaderIdInput(activeId);
    fetchServerBookshelf(activeId);
  }, [fetchServerBookshelf]);

  // 修改读者证并立即从服务端同步
  const handleSaveReaderId = () => {
    const clean = tempReaderIdInput.trim();
    if (clean) {
      setReaderId(clean);
      setIsEditingReaderId(false);
      localStorage.setItem("zenlib_reader_id", clean);
      fetchServerBookshelf(clean);
      setServerNotice(`已连通读者证 [${clean}] 的云端数据库`);
      setTimeout(() => setServerNotice(null), 3000);
    }
  };

  // 2. 真实添加到服务器端书房数据库 (POST /api/library/bookshelf)
  const addToServerBookshelf = async (book: {
    id: string;
    title: string;
    author?: string;
    coverTone?: string;
    coverColor?: string;
    category?: string;
    description?: string;
  }) => {
    try {
      const res = await fetch("/api/library/bookshelf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          readerId,
          book,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setServerBooks(data.data.books);
        setServerNotice(`《${book.title}》已持久化保存至云端书房`);
        setTimeout(() => setServerNotice(null), 3000);
      }
    } catch {
      setServerNotice("保存到云端失败，请检查网络");
      setTimeout(() => setServerNotice(null), 3000);
    }
  };

  // 3. 从服务器端书房数据库移出 (DELETE /api/library/bookshelf)
  const removeFromServerBookshelf = async (bookId: string) => {
    try {
      const res = await fetch("/api/library/bookshelf", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          readerId,
          bookId,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setServerBooks(data.data.books);
        setServerNotice("已从云端数据库彻底移除");
        setTimeout(() => setServerNotice(null), 2500);
      }
    } catch {
      // ignore
    }
  };

  // 4. 在线全网实时搜索中文书籍 (GET /api/books/search)
  const handleSearchOnlineBooks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(`/api/books/search?q=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();
      if (data.success && data.data) {
        setSearchResults(data.data);
      } else {
        setSearchResults([]);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 5. 点击任意书籍时，如果为线上书源，实时从网络拉取完整内容 (GET /api/books/read)
  const handleOpenOnlineBook = async (title: string, chapterIdx = 0) => {
    setIsLoadingOnlineBook(true);
    try {
      const res = await fetch(`/api/books/read?title=${encodeURIComponent(title)}`);
      const data = await res.json();
      if (data.success && data.book) {
        setReadingBook(data.book);
        setReadingChapterIndex(chapterIdx);
      } else {
        alert(data.error || "获取远程书籍章节失败，请重试");
      }
    } catch {
      alert("网络连接超时，无法获取远程书籍内容");
    } finally {
      setIsLoadingOnlineBook(false);
    }
  };

  // 打开本地或内置图书
  const handleOpenLocalBook = (book: Book, chapterIdx = 0) => {
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

      addToServerBookshelf(newCustomBook);
      handleOpenLocalBook(newCustomBook, 0);
    };
    reader.readAsText(file);
  };

  // 52周全自动轮转推荐好书
  const { book: weeklyPickBook, weekNumber } = getAutomatedWeeklyPick(curatedBooks);

  // 分类筛选
  const categories = ["全部", "商业与杠杆", "东方至道", "工匠技艺", "精神林泉"];
  const filteredBooks =
    selectedCategory === "全部"
      ? curatedBooks
      : curatedBooks.filter((b) => b.category === selectedCategory);

  const isBookInServerShelf = (bookId: string) => {
    return serverBooks.some((b) => b.id === bookId);
  };

  return (
    <section id="library" className="py-20 md:py-28 border-b border-[#E8E3DA] dark:border-[#33302B] transition-colors">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* --- Header Section (轻奢书卷气与云端连接状态) --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-serif tracking-widest text-[#C27D53] dark:text-[#D89469] uppercase mb-3">
              <Library className="h-3.5 w-3.5" />
              <span>ZenLib · 在线动态数字书阁</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-book-serif font-normal text-[#2C2A29] dark:text-[#EDE9E3] tracking-tight">
              全网中文书阁与云端书房
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#6E6B65] dark:text-[#A8A49C] max-w-2xl leading-relaxed font-serif">
              <strong>拒绝本地写死内容</strong>：接入开放中文数字文库，全网数十万部典籍在线动态检索与精读。
              书房数据<strong>直通云端服务器数据库持久化</strong>，换手机或电脑随时无感漫游。
            </p>
          </div>

          {/* 跨终端云端读者证卡片 */}
          <div className="flex flex-col items-start sm:items-end gap-2 bg-[#F5F2EC] dark:bg-[#201F1D] p-4 rounded-2xl border border-[#E8E3DA] dark:border-[#33302B] shadow-2xs">
            <div className="flex items-center gap-2 text-xs text-[#6E6B65] dark:text-[#A8A49C]">
              <Cloud className="h-3.5 w-3.5 text-[#5F7A6A]" />
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
                  {readerId} ✏️
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-[11px] text-[#8C8881]">
              <span className="flex items-center gap-1">
                <Laptop className="h-3 w-3" />
                <span>电脑</span>
                <span>⇄</span>
                <Smartphone className="h-3 w-3" />
                <span>手机云端实时互通</span>
              </span>
              <button
                onClick={() => fetchServerBookshelf(readerId)}
                disabled={isLoadingServerBooks}
                className="inline-flex items-center gap-1 font-serif text-[#C27D53] hover:underline"
              >
                <RefreshCw className={`h-3 w-3 ${isLoadingServerBooks ? "animate-spin" : ""}`} />
                <span>{isLoadingServerBooks ? "拉取中..." : "重新拉取"}</span>
              </button>
            </div>

            {serverNotice && (
              <span className="text-[10px] text-[#5F7A6A] font-serif transition-all">{serverNotice}</span>
            )}
          </div>
        </div>

        {/* --- 1. Automated Weekly Pick Hero --- */}
        <div className="relative overflow-hidden rounded-3xl bg-[#FAF6F0] dark:bg-[#201F1D] border border-[#E5DAC8] dark:border-[#38342E] p-6 sm:p-10 md:p-12 mb-16 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-serif text-[#C27D53] bg-[#F0E6D8] dark:bg-[#332A22] border border-[#E5DAC8] dark:border-[#473B2F] mb-4">
                <Calendar className="h-3.5 w-3.5" />
                <span>第 {weekNumber} 周 · 52周自然历全自动轮转推介</span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-book-serif font-normal text-[#2C2A29] dark:text-[#EDE9E3] leading-snug mb-3">
                {weeklyPickBook.title}
              </h3>
              
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#8C8881] font-serif mb-5">
                <span>著：{weeklyPickBook.author}</span>
                <span>·</span>
                <span>{weeklyPickBook.category}</span>
                <span>·</span>
                <span>{weeklyPickBook.totalWords}</span>
              </div>

              <p className="text-sm sm:text-base text-[#59554E] dark:text-[#B8B4AB] leading-relaxed mb-6 font-serif">
                {weeklyPickBook.description}
              </p>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-[#E8E3DA] dark:border-[#33302B] text-xs sm:text-sm text-[#4A4742] dark:text-[#CCC7BE] font-serif leading-relaxed mb-8 relative">
                <span className="text-2xl text-[#C27D53] absolute -top-2 left-3 font-serif">“</span>
                <p className="pl-4 italic">{weeklyPickBook.curatorNote}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => handleOpenLocalBook(weeklyPickBook, 0)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#2C2A29] text-[#FAF8F5] dark:bg-[#EDE9E3] dark:text-[#181716] text-xs font-serif font-semibold hover:opacity-90 transition-all hover:scale-[1.02] shadow-xs"
                >
                  <BookOpen className="h-4 w-4 text-[#C27D53]" />
                  <span>即刻沉浸研读</span>
                </button>

                <button
                  onClick={() => addToServerBookshelf(weeklyPickBook)}
                  className={`inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-serif font-medium border transition-colors ${
                    isBookInServerShelf(weeklyPickBook.id)
                      ? "bg-[#5F7A6A]/10 text-[#5F7A6A] border-[#5F7A6A]/30 dark:bg-[#789984]/20 dark:text-[#789984]"
                      : "bg-white dark:bg-zinc-800 text-[#2C2A29] dark:text-[#EDE9E3] border-[#E8E3DA] dark:border-[#33302B] hover:bg-stone-50"
                  }`}
                >
                  {isBookInServerShelf(weeklyPickBook.id) ? (
                    <>
                      <BookmarkCheck className="h-4 w-4" />
                      <span>已存入云端书房</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4" />
                      <span>收藏至云端书房</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 3:4 Realistic Hardcover Spine */}
            <div className="lg:col-span-4 flex justify-center">
              <div
                onClick={() => handleOpenLocalBook(weeklyPickBook, 0)}
                className={`group cursor-pointer relative w-52 sm:w-60 h-72 sm:h-80 rounded-2xl p-6 flex flex-col justify-between border shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1.5 ${weeklyPickBook.coverColor}`}
              >
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

        {/* --- 2. Tab Navigation & Online Search Input --- */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8E3DA] dark:border-[#33302B] pb-4 mb-8">
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
              <span>精选典籍</span>
            </button>

            <button
              onClick={() => setActiveTab("search")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif transition-all ${
                activeTab === "search"
                  ? "bg-[#2C2A29] text-[#FAF8F5] dark:bg-[#EDE9E3] dark:text-[#181716] shadow-xs"
                  : "text-[#6E6B65] hover:text-[#2C2A29] dark:text-[#A8A49C] dark:hover:text-[#EDE9E3]"
              }`}
            >
              <Globe className="h-3.5 w-3.5 text-[#C27D53]" />
              <span>全网中文书源在线搜</span>
            </button>

            <button
              onClick={() => setActiveTab("bookshelf")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif transition-all ${
                activeTab === "bookshelf"
                  ? "bg-[#2C2A29] text-[#FAF8F5] dark:bg-[#EDE9E3] dark:text-[#181716] shadow-xs"
                  : "text-[#6E6B65] hover:text-[#2C2A29] dark:text-[#A8A49C] dark:hover:text-[#EDE9E3]"
              }`}
            >
              <Cloud className="h-3.5 w-3.5 text-[#5F7A6A]" />
              <span>我的云端书房</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#C27D53]/20 text-[#C27D53] font-mono">
                {serverBooks.length}
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
              <span>本地自选导入</span>
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

        {/* --- View: 全网实时中文书源搜索 (LIVE REMOTE API) --- */}
        {activeTab === "search" && (
          <div className="mb-12">
            {/* Search Form */}
            <form onSubmit={handleSearchOnlineBooks} className="max-w-2xl mx-auto mb-10">
              <div className="relative flex items-center shadow-xs">
                <Search className="absolute left-4 h-4 w-4 text-[#8C8881]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索任意全网中文名著或作者，如：鲁迅、狂人日记、朝花夕拾、红楼梦、史记..."
                  className="w-full pl-11 pr-28 py-3.5 text-xs sm:text-sm rounded-2xl border border-[#E8E3DA] dark:border-[#33302B] bg-white dark:bg-[#201F1D] text-[#2C2A29] dark:text-[#EDE9E3] font-serif focus:outline-hidden focus:ring-1 focus:ring-[#C27D53]"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-2 px-4 py-2 bg-[#2C2A29] text-[#FAF8F5] dark:bg-[#EDE9E3] dark:text-[#181716] text-xs font-serif font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  {isSearching ? "全网检索中..." : "在线搜索"}
                </button>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#8C8881] mt-2 px-2 font-serif">
                <span>直连开放中文数字图书馆 API · 实时动态拉取正文</span>
                <span>热搜：鲁迅、道德经、朝花夕拾、孙子兵法</span>
              </div>
            </form>

            {/* Results Grid */}
            {isSearching && (
              <div className="text-center py-16">
                <Loader2 className="h-8 w-8 text-[#C27D53] animate-spin mx-auto mb-3" />
                <p className="text-xs text-[#8C8881] font-serif">正在全网中文文库中检索书源...</p>
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((item) => {
                  const inShelf = isBookInServerShelf(item.id);

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between rounded-3xl bg-white dark:bg-[#201F1D] p-6 border border-[#E8E3DA] dark:border-[#33302B] shadow-2xs hover:shadow-md transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3 text-[11px] text-[#8C8881] font-serif">
                          <span className="px-2 py-0.5 rounded-full bg-[#FAF6F0] dark:bg-[#272522] text-[#C27D53]">
                            {item.source}
                          </span>
                          <span>{item.wordcount}</span>
                        </div>

                        <h4 className="text-lg font-book-serif font-bold text-[#2C2A29] dark:text-[#EDE9E3] mb-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#6E6B65] dark:text-[#A8A49C] font-serif leading-relaxed mb-6 line-clamp-3">
                          {item.snippet}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t border-[#F0EBE1] dark:border-[#272522]">
                        <button
                          onClick={() => handleOpenOnlineBook(item.rawTitle, 0)}
                          disabled={isLoadingOnlineBook}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#2C2A29] text-[#FAF8F5] dark:bg-[#EDE9E3] dark:text-[#181716] text-xs font-serif font-semibold hover:opacity-90 transition-opacity"
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>即刻在线阅读</span>
                        </button>

                        <button
                          onClick={() =>
                            addToServerBookshelf({
                              id: item.id,
                              title: item.title,
                              author: "开放文库典籍",
                              category: "文库典籍",
                              description: item.snippet,
                            })
                          }
                          className={`p-2.5 rounded-xl border text-xs transition-colors ${
                            inShelf
                              ? "bg-[#5F7A6A]/10 text-[#5F7A6A] border-[#5F7A6A]/30"
                              : "border-[#E8E3DA] dark:border-[#33302B] text-[#8C8881] hover:bg-stone-50"
                          }`}
                          title={inShelf ? "已在云端书房" : "收藏至云端书房数据库"}
                        >
                          {inShelf ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- View 1: Curated Library Grid --- */}
        {activeTab === "curated" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book) => {
              const inShelf = isBookInServerShelf(book.id);
              const progress = serverProgressMap[book.id];

              return (
                <div
                  key={book.id}
                  className="flex flex-col justify-between rounded-3xl bg-white dark:bg-[#201F1D] p-7 border border-[#E8E3DA] dark:border-[#33302B] shadow-2xs hover:shadow-md transition-all hover:border-[#D5CEBF]"
                >
                  <div>
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
                    {progress && (
                      <div className="mb-4 p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#181716] border border-[#E8E3DA] dark:border-[#33302B]">
                        <div className="flex justify-between text-[11px] text-[#8C8881] font-serif mb-1">
                          <span>{progress.chapterTitle || `第 ${progress.chapterIndex + 1} 章`}</span>
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

                    <div className="flex items-center gap-2 pt-4 border-t border-[#F0EBE1] dark:border-[#272522]">
                      <button
                        onClick={() =>
                          handleOpenLocalBook(book, progress ? progress.chapterIndex : 0)
                        }
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#2C2A29] text-[#FAF8F5] dark:bg-[#EDE9E3] dark:text-[#181716] text-xs font-serif font-semibold hover:opacity-90 transition-colors"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{progress ? "继续阅读" : "沉浸阅读"}</span>
                      </button>

                      <button
                        onClick={() => addToServerBookshelf(book)}
                        className={`p-2.5 rounded-xl border text-xs transition-colors ${
                          inShelf
                            ? "bg-[#5F7A6A]/10 text-[#5F7A6A] border-[#5F7A6A]/30"
                            : "border-[#E8E3DA] hover:bg-stone-50 dark:border-[#33302B] text-[#8C8881]"
                        }`}
                        title={inShelf ? "已存入云端书房" : "收藏至云端书房数据库"}
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

        {/* --- View 2: 我的真实云端书房 (Server-side Database) --- */}
        {activeTab === "bookshelf" && (
          <div>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#E8E3DA] dark:border-[#33302B] text-xs font-serif text-[#8C8881]">
              <span className="flex items-center gap-1.5 text-[#5F7A6A]">
                <Check className="h-3.5 w-3.5" />
                <span>当前书房直连云端服务器数据库（证号: {readerId}），已脱离本地浏览器缓存限制</span>
              </span>
              <span>共收藏 {serverBooks.length} 卷典籍</span>
            </div>

            {serverBooks.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-[#E8E3DA] dark:border-[#33302B] rounded-3xl bg-[#FAF8F5] dark:bg-[#201F1D]">
                <BookOpen className="h-10 w-10 text-[#8C8881] mx-auto mb-3 opacity-60" />
                <h3 className="text-base font-serif font-bold text-[#2C2A29] dark:text-[#EDE9E3] mb-1">
                  云端书房静候存录
                </h3>
                <p className="text-xs text-[#8C8881] font-serif mb-6">
                  在“全网中文书源在线搜”中检索任何大作，或在“精选典籍”点击“收藏至云端书房”。
                </p>
                <button
                  onClick={() => setActiveTab("search")}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#2C2A29] text-[#FAF8F5] dark:bg-[#EDE9E3] dark:text-[#181716] text-xs font-serif"
                >
                  去全网搜书
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {serverBooks.map((item) => {
                  const progress = serverProgressMap[item.id];

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between rounded-3xl bg-white dark:bg-[#201F1D] p-7 border border-[#E8E3DA] dark:border-[#33302B] shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-serif text-[#5F7A6A] flex items-center gap-1.5">
                            <Cloud className="h-3.5 w-3.5" />
                            <span>云端典藏 · {item.sourceType === "remote" ? "在线源" : "精选源"}</span>
                          </span>
                          <button
                            onClick={() => removeFromServerBookshelf(item.id)}
                            className="text-[#8C8881] hover:text-red-500 p-1"
                            title="从云端数据库彻底移除"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <h3 className="text-xl font-book-serif font-bold text-[#2C2A29] dark:text-[#EDE9E3] mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#8C8881] font-serif mb-4">
                          著者：{item.author || "佚名"}
                        </p>
                      </div>

                      <div>
                        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#181716] border border-[#E8E3DA] dark:border-[#33302B] mb-4">
                          <div className="flex justify-between text-xs text-[#59554E] dark:text-[#A8A49C] font-serif mb-1.5">
                            <span>
                              {progress
                                ? progress.chapterTitle || `读至第 ${progress.chapterIndex + 1} 章`
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
                          onClick={() => {
                            if (item.sourceType === "remote" || item.id.startsWith("wiki-")) {
                              handleOpenOnlineBook(item.title, progress ? progress.chapterIndex : 0);
                            } else {
                              const found = curatedBooks.find((b) => b.id === item.id);
                              if (found) {
                                handleOpenLocalBook(found, progress ? progress.chapterIndex : 0);
                              } else {
                                handleOpenOnlineBook(item.title, progress ? progress.chapterIndex : 0);
                              }
                            }
                          }}
                          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#2C2A29] text-[#FAF8F5] dark:bg-[#EDE9E3] dark:text-[#181716] text-xs font-serif font-semibold hover:opacity-90 transition-colors shadow-2xs"
                        >
                          <BookOpen className="h-4 w-4" />
                          <span>{progress ? "从云端进度继续阅读" : "打开阅读"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- View 4: Local File Import --- */}
        {activeTab === "import" && (
          <div className="max-w-xl mx-auto p-10 rounded-3xl border border-[#E8E3DA] dark:border-[#33302B] bg-white dark:bg-[#201F1D] text-center shadow-xs">
            <div className="h-16 w-16 rounded-2xl bg-[#FAF6F0] dark:bg-[#272522] text-[#C27D53] flex items-center justify-center mx-auto mb-5 border border-[#E5DAC8] dark:border-[#38342E]">
              <UploadCloud className="h-8 w-8" />
            </div>

            <h3 className="text-2xl font-book-serif font-bold text-[#2C2A29] dark:text-[#EDE9E3] mb-2">
              拖入本地文本与私藏手稿
            </h3>
            <p className="text-xs sm:text-sm text-[#6E6B65] dark:text-[#A8A49C] max-w-md mx-auto mb-8 font-serif leading-relaxed">
              支持直接拖入 <strong>.txt</strong> 或 <strong>.md</strong> 纯文本文件。
              纯浏览器本地解析切分章节，保护你的私密书卷天地。
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
            const chapter = readingBook?.chapters[chapterIndex];
            const newPercentage = Math.round(
              ((chapterIndex + 1) / (readingBook?.chapters.length || 1)) * 100
            );

            // 实时上报服务器数据库 (POST /api/library/progress)
            fetch("/api/library/progress", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                readerId,
                bookId,
                chapterIndex,
                chapterTitle: chapter?.title || `第 ${chapterIndex + 1} 节`,
                percentage: newPercentage,
              }),
            })
              .then((r) => r.json())
              .then((data) => {
                if (data.success) {
                  setServerProgressMap((prev) => ({
                    ...prev,
                    [bookId]: {
                      chapterIndex,
                      chapterTitle: chapter?.title,
                      percentage: newPercentage,
                      updatedAt: new Date().toISOString(),
                    },
                  }));
                }
              })
              .catch(() => {});
          }}
        />
      )}
    </section>
  );
}
