"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CuratorBook,
  CuratorCategory,
  CURATOR_BOOKS,
  CURATOR_CATEGORIES,
} from "@/data/curatorBooks";
import ZenBookCover from "@/components/ZenBookCover";
import BookInsightModal from "@/components/BookInsightModal";
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Search,
  RefreshCw,
  Smartphone,
  Laptop,
  Trash2,
  Sparkles,
} from "lucide-react";

interface ServerBookItem {
  id: string;
  title: string;
  author: string;
  category: string;
  coverTone?: any;
  tagline?: string;
  description?: string;
  addedAt: string;
}

export default function ZenLibrary() {
  // 选项卡：馆藏大厅 / 今日荐读 / 我的书架
  const [activeTab, setActiveTab] = useState<"hall" | "today" | "bookshelf">("hall");
  const [selectedCategory, setSelectedCategory] = useState<CuratorCategory>("全部");

  // 搜索关键字（支持搜索书名、作者、心智模型如“破窗”、“杠杆”、“反脆弱”）
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 读者证号 (云端借阅账户)
  const [readerId, setReaderId] = useState<string>("913849");
  const [isEditingReaderId, setIsEditingReaderId] = useState<boolean>(false);
  const [tempReaderIdInput, setTempReaderIdInput] = useState<string>("913849");

  // 服务端真实书架持久化数据
  const [serverBooks, setServerBooks] = useState<ServerBookItem[]>([]);
  const [isLoadingServerBooks, setIsLoadingServerBooks] = useState<boolean>(false);
  const [serverNotice, setServerNotice] = useState<string | null>(null);

  // 正在查看深度认知拆解的书籍
  const [activeInsightBook, setActiveInsightBook] = useState<CuratorBook | null>(null);

  // 今日荐读选中的轮播索引 (0-7)
  const [todayIndex, setTodayIndex] = useState<number>(4); // 默认查理·芒格

  // 1. 初始化时从服务端拉取真实书房数据
  const fetchServerBookshelf = useCallback(async (currentReaderId: string) => {
    setIsLoadingServerBooks(true);
    try {
      const res = await fetch(`/api/library/bookshelf?readerId=${encodeURIComponent(currentReaderId)}`);
      const json = await res.json();
      if (json.success && json.data) {
        setServerBooks(json.data.books || []);
      }
    } catch {
      // 容错处理
    } finally {
      setIsLoadingServerBooks(false);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("zenlib_reader_id");
    const activeId = stored || "913849";
    setReaderId(activeId);
    setTempReaderIdInput(activeId);
    fetchServerBookshelf(activeId);
  }, [fetchServerBookshelf]);

  // 修改读者证
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

  // 添加到服务器端书架 (POST /api/library/bookshelf)
  const addToServerBookshelf = async (book: CuratorBook) => {
    try {
      const res = await fetch("/api/library/bookshelf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          readerId,
          book: {
            id: book.id,
            title: book.title,
            author: book.author,
            category: book.category,
            coverTone: book.coverTone,
            tagline: book.tagline,
            description: book.whyRead,
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setServerBooks(data.data.books);
        setServerNotice(`《${book.title}》已收入私享书架`);
        setTimeout(() => setServerNotice(null), 3000);
      }
    } catch {
      setServerNotice("保存到云端失败，请检查网络");
      setTimeout(() => setServerNotice(null), 3000);
    }
  };

  // 从服务器端书架移出 (DELETE /api/library/bookshelf)
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
        setServerNotice("已从书架移出");
        setTimeout(() => setServerNotice(null), 2500);
      }
    } catch {
      // 容错处理
    }
  };

  const isBookInServerShelf = (bookId: string) => {
    return serverBooks.some((b) => b.id === bookId);
  };

  // 筛选图书列表：按分类与搜索关键词双重过滤
  const filteredBooks = CURATOR_BOOKS.filter((b) => {
    const matchCategory = selectedCategory === "全部" || b.category === selectedCategory;
    if (!searchQuery.trim()) return matchCategory;

    const q = searchQuery.toLowerCase();
    const matchTitle = b.title.toLowerCase().includes(q);
    const matchAuthor = b.author.toLowerCase().includes(q);
    const matchTagline = b.tagline.toLowerCase().includes(q);
    const matchModels = b.models.some(
      (m) => m.title.toLowerCase().includes(q) || m.concept.toLowerCase().includes(q)
    );

    return matchCategory && (matchTitle || matchAuthor || matchTagline || matchModels);
  });

  // 快捷制作金句卡片联动
  const handleMakeQuoteCard = (_quoteText: string, _bookTitle: string, _author: string) => {
    setActiveInsightBook(null);
    const quoteSection = document.getElementById("quotecraft");
    if (quoteSection) {
      quoteSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 今日荐读轮播列表（精炼 8 本神作轮巡）
  const todayList = [
    {
      date: "10/04",
      day: "周五",
      book: CURATOR_BOOKS.find((b) => b.id === "old-man-and-the-sea") || CURATOR_BOOKS[0],
    },
    {
      date: "10/05",
      day: "周六",
      book: CURATOR_BOOKS.find((b) => b.id === "ming-dynasty") || CURATOR_BOOKS[1],
    },
    {
      date: "10/06",
      day: "周日",
      book: CURATOR_BOOKS.find((b) => b.id === "rich-dad-poor-dad") || CURATOR_BOOKS[2],
    },
    {
      date: "10/07",
      day: "昨天",
      book: CURATOR_BOOKS.find((b) => b.id === "navals-almanack") || CURATOR_BOOKS[3],
    },
    {
      date: "10/08",
      day: "今天",
      book: CURATOR_BOOKS.find((b) => b.id === "poor-charlies-almanack") || CURATOR_BOOKS[4],
    },
    {
      date: "10/09",
      day: "明天",
      book: CURATOR_BOOKS.find((b) => b.id === "antifragile") || CURATOR_BOOKS[5],
    },
    {
      date: "10/10",
      day: "周五",
      book: CURATOR_BOOKS.find((b) => b.id === "inside-china-system") || CURATOR_BOOKS[6],
    },
    {
      date: "10/11",
      day: "周六",
      book: CURATOR_BOOKS.find((b) => b.id === "courage-to-be-disliked") || CURATOR_BOOKS[7],
    },
  ];

  const activeTodayItem = todayList[todayIndex] || todayList[4];

  return (
    <section id="library" className="py-20 md:py-28 border-b border-[#1F2A4D]/80 relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* --- 顶部 Header：品牌定位与读者证卡片 --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#5CF2C4] uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CF2C4] shadow-[0_0_8px_#5CF2C4]" />
              <span>CURATED ATELIER · 认知心智书房</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-[#EAF0FF] tracking-tight">
              私享藏书与心智模型
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#9FB0D0] max-w-2xl font-sans leading-relaxed">
              <strong>拒绝残缺抓取与碎片信息流</strong>：精选 8 部认知殿堂级核心著作，深度拆解结构化心智模型。
              全本正版直连<strong>微信读书官方</strong>，私享书架支持多端云端漫游持久化。
            </p>
          </div>

          {/* 读者借阅证卡片 */}
          <div className="flex flex-col items-start sm:items-end gap-2 bg-[#0A0E1A]/80 p-4 rounded-2xl border border-[#1F2A4D] backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-2 text-xs text-[#9FB0D0]">
              <Bookmark className="h-3.5 w-3.5 text-[#5CF2C4]" />
              <span className="font-mono">私享读者证：</span>
              
              {isEditingReaderId ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tempReaderIdInput}
                    onChange={(e) => setTempReaderIdInput(e.target.value)}
                    placeholder="如: 913849"
                    className="w-24 px-2 py-0.5 text-xs font-mono rounded-md border border-[#5CF2C4] bg-[#05070F] text-[#EAF0FF] focus:outline-none"
                  />
                  <button
                    onClick={handleSaveReaderId}
                    className="px-2.5 py-0.5 bg-[#5CF2C4] text-[#05070F] rounded-md text-[11px] font-mono font-bold"
                  >
                    同步
                  </button>
                </div>
              ) : (
                <span
                  onClick={() => setIsEditingReaderId(true)}
                  className="font-mono font-bold text-[#5CF2C4] bg-[#05070F] px-2.5 py-0.5 rounded-md cursor-pointer border border-[#1F2A4D] hover:border-[#5CF2C4] transition-colors"
                  title="点击可修改为你的专属借阅证号"
                >
                  {readerId}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-[#7D88AA]">
              <span className="flex items-center gap-1">
                <Laptop className="h-3 w-3 opacity-70" />
                <span>PC</span>
                <span>⇄</span>
                <Smartphone className="h-3 w-3 opacity-70" />
                <span>手机漫游</span>
              </span>
              <button
                onClick={() => fetchServerBookshelf(readerId)}
                disabled={isLoadingServerBooks}
                className="inline-flex items-center gap-1 font-mono text-[#9FB0D0] hover:text-[#5CF2C4] transition-colors"
              >
                <RefreshCw className={`h-3 w-3 ${isLoadingServerBooks ? "animate-spin text-[#5CF2C4]" : ""}`} />
                <span>{isLoadingServerBooks ? "同步中..." : "刷新云端"}</span>
              </button>
            </div>

            {serverNotice && (
              <span className="text-[10px] text-[#5CF2C4] font-mono animate-fade-in">{serverNotice}</span>
            )}
          </div>
        </div>

        {/* --- 搜索框（支持搜索书名、作者或心智模型关键词） --- */}
        <div className="mb-8">
          <div className="relative flex items-center max-w-3xl">
            <div className="absolute left-4 text-[#7D88AA]">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索书名、作者或心智模型（如：老人与海、富爸爸、纳瓦尔、反脆弱、芒格）"
              className="w-full pl-11 pr-24 py-3.5 rounded-xl bg-[#0A0E1A]/90 border border-[#1F2A4D] text-sm text-[#EAF0FF] placeholder-[#7D88AA] focus:outline-none focus:border-[#5CF2C4] shadow-md transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 text-xs font-mono text-[#7D88AA] hover:text-[#EAF0FF]"
              >
                清空
              </button>
            )}
          </div>
        </div>

        {/* --- 核心一级导航 Tabs --- */}
        <div className="flex items-center gap-3 border-b border-[#1F2A4D] mb-8 overflow-x-auto pb-1 scrollbar-none font-mono">
          <button
            onClick={() => setActiveTab("hall")}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === "hall"
                ? "border-[#5CF2C4] text-[#5CF2C4] font-bold"
                : "border-transparent text-[#7D88AA] hover:text-[#EAF0FF]"
            }`}
          >
            <span>心智大厅 ({CURATOR_BOOKS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("today")}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === "today"
                ? "border-[#5CF2C4] text-[#5CF2C4] font-bold"
                : "border-transparent text-[#7D88AA] hover:text-[#EAF0FF]"
            }`}
          >
            <span>今日荐读 · 展台</span>
          </button>

          <button
            onClick={() => setActiveTab("bookshelf")}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === "bookshelf"
                ? "border-[#5CF2C4] text-[#5CF2C4] font-bold"
                : "border-transparent text-[#7D88AA] hover:text-[#EAF0FF]"
            }`}
          >
            <span>私享书架 ({serverBooks.length})</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* 模块一：全景心智大厅（左侧垂直分类栏 + 右侧精装卡片） */}
        {/* ======================================================== */}
        {activeTab === "hall" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* 左侧：心智维度分类栏 */}
            <div className="md:col-span-3 bg-[#0A0E1A]/80 rounded-2xl border border-[#1F2A4D] p-3 space-y-1 backdrop-blur-md">
              <div className="px-3 py-2 text-[10px] font-mono text-[#7D88AA] tracking-widest border-b border-[#1F2A4D] mb-1 uppercase">
                认知分类维度
              </div>
              {CURATOR_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left font-mono transition-all ${
                      isSelected
                        ? "bg-[#5CF2C4]/15 border border-[#5CF2C4]/40 text-[#5CF2C4] font-bold shadow-xs"
                        : "text-[#9FB0D0] hover:bg-[#1F2A4D]/40 hover:text-[#EAF0FF]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] tracking-wider opacity-60">{cat.icon}</span>
                      <span className="text-xs">{cat.name}</span>
                    </div>
                    <span
                      className={`text-[10px] ${
                        isSelected ? "text-[#5CF2C4]/80" : "text-[#7D88AA]"
                      }`}
                    >
                      {cat.countDesc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 右侧：书籍图文卡片 */}
            <div className="md:col-span-9 space-y-4">
              <div className="flex items-center justify-between px-2 mb-2 text-xs font-mono text-[#7D88AA]">
                <span>
                  当前分类：<strong className="text-[#5CF2C4]">{selectedCategory}</strong>（共 {filteredBooks.length} 卷）
                </span>
                <span>支持 3 大结构化模型与金句拆解</span>
              </div>

              {filteredBooks.length === 0 ? (
                <div className="bg-[#0A0E1A]/80 rounded-2xl border border-[#1F2A4D] p-12 text-center backdrop-blur-md">
                  <Search className="h-6 w-6 text-[#7D88AA] mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-mono text-[#7D88AA]">
                    未找到与“{searchQuery}”匹配的藏书，建议清空搜索词查看全部 8 卷精选。
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBooks.map((book) => {
                    const inShelf = isBookInServerShelf(book.id);

                    return (
                      <div
                        key={book.id}
                        data-cursor="INSPECT"
                        className="bg-[#0A0E1A]/80 rounded-2xl border border-[#1F2A4D] hover:border-[#5CF2C4]/50 p-5 flex flex-col sm:flex-row gap-5 items-start justify-between backdrop-blur-md shadow-md hover:shadow-[0_8px_30px_rgba(92,242,196,0.12)] hover:bg-[#0E1528] transition-all group"
                      >
                        {/* 左侧：立体精装书封 */}
                        <div className="flex sm:flex-col items-center gap-3 shrink-0">
                          <ZenBookCover
                            title={book.title}
                            author={book.author}
                            category={book.category}
                            tone={book.coverTone}
                            size="md"
                          />
                          <span className="text-[10px] text-[#7D88AA] font-mono sm:text-center block">
                            {book.readingTime}
                          </span>
                        </div>

                        {/* 中部：图书核心信息与主理人金句 */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4
                              onClick={() => setActiveInsightBook(book)}
                              className="text-base sm:text-lg font-sans font-bold text-[#EAF0FF] group-hover:text-[#5CF2C4] transition-colors cursor-pointer"
                            >
                              {book.title}
                            </h4>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-[#1F2A4D] bg-[#05070F] text-[#8B7BFF]">
                              {book.category}
                            </span>
                            <span className="text-[11px] text-[#5CF2C4] font-mono font-bold">
                              ★ {book.rating.toFixed(1)}
                            </span>
                          </div>

                          <p className="text-xs text-[#8B7BFF] font-mono italic line-clamp-1">
                            “{book.tagline}”
                          </p>

                          <p className="text-xs text-[#9FB0D0] font-sans line-clamp-2 leading-relaxed">
                            {book.curatorEssay}
                          </p>

                          {/* 心智模型标签预览 */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {book.models.map((m, mIdx) => (
                              <span
                                key={mIdx}
                                className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#05070F] border border-[#1F2A4D] text-[#9FB0D0]"
                              >
                                ✦ {m.title}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* 右侧：操作按钮组 */}
                        <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1F2A4D]">
                          <button
                            onClick={() => setActiveInsightBook(book)}
                            className="flex-1 sm:flex-none w-full px-4 py-2 rounded-xl bg-[#5CF2C4] text-[#05070F] text-xs font-mono font-bold hover:bg-[#7DF9D2] hover:shadow-[0_0_15px_rgba(92,242,196,0.35)] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>深度拆解</span>
                          </button>

                          <a
                            href={book.weReadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 sm:flex-none w-full px-3 py-2 rounded-xl text-xs font-mono border border-[#1F2A4D] bg-[#05070F] text-[#9FB0D0] hover:text-[#5CF2C4] hover:border-[#5CF2C4]/40 transition-all flex items-center justify-center gap-1"
                          >
                            <BookOpen className="h-3 w-3 opacity-70" />
                            <span>微信读书</span>
                          </a>

                          <button
                            onClick={() => {
                              if (inShelf) {
                                removeFromServerBookshelf(book.id);
                              } else {
                                addToServerBookshelf(book);
                              }
                            }}
                            className={`flex-1 sm:flex-none w-full px-3 py-1.5 rounded-xl text-[11px] font-mono transition-colors flex items-center justify-center gap-1 ${
                              inShelf
                                ? "text-[#5CF2C4] bg-[#5CF2C4]/10 border border-[#5CF2C4]/30"
                                : "text-[#7D88AA] hover:text-[#EAF0FF]"
                            }`}
                          >
                            {inShelf ? (
                              <>
                                <BookmarkCheck className="h-3 w-3" />
                                <span>已在书架</span>
                              </>
                            ) : (
                              <>
                                <Bookmark className="h-3 w-3" />
                                <span>加入书架</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 模块二：今日荐读 展台 */}
        {/* ======================================================== */}
        {activeTab === "today" && (
          <div className="bg-[#0A0E1A]/80 rounded-2xl border border-[#1F2A4D] p-6 sm:p-10 backdrop-blur-md shadow-lg">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#1F2A4D]">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#5CF2C4] tracking-widest uppercase mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5CF2C4] shadow-[0_0_8px_#5CF2C4]" />
                  <span>DAILY ROTATION · 案头清供</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-mono font-bold text-[#EAF0FF]">
                  本周主推 · 独立工匠心智跃迁
                </h3>
                <p className="text-xs sm:text-sm text-[#9FB0D0] font-sans mt-1">
                  丈量时代周期的律动，在信息流噪音中构建属于你的认知护城河
                </p>
              </div>

              <span className="text-xs font-mono text-[#8B7BFF]">
                8 卷经典常驻轮巡
              </span>
            </div>

            {/* 封面日历滑块 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 mb-8">
              {todayList.map((item, idx) => {
                const isSelected = todayIndex === idx;

                return (
                  <div
                    key={item.date}
                    onClick={() => setTodayIndex(idx)}
                    className={`flex flex-col items-center cursor-pointer transition-all duration-300 p-2.5 rounded-xl border ${
                      isSelected
                        ? "bg-[#05070F] border-[#5CF2C4] shadow-[0_0_15px_rgba(92,242,196,0.2)] scale-105"
                        : "border-transparent hover:border-[#1F2A4D] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <ZenBookCover
                      title={item.book.title}
                      author={item.book.author}
                      category={item.book.category}
                      tone={item.book.coverTone}
                      size="sm"
                    />
                    
                    <div className="mt-2.5 text-center">
                      <span
                        className={`text-xs font-mono font-bold block ${
                          isSelected ? "text-[#5CF2C4]" : "text-[#7D88AA]"
                        }`}
                      >
                        {item.date}
                      </span>
                      <span className="text-[10px] text-[#9FB0D0] font-mono block">
                        {item.day}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 聚焦卡片 */}
            <div className="bg-[#05070F] rounded-2xl border border-[#1F2A4D] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono border border-[#5CF2C4]/40 bg-[#5CF2C4]/10 text-[#5CF2C4]">
                  <span>{activeTodayItem.date} {activeTodayItem.day} 主推心智</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-sans font-bold text-[#EAF0FF]">
                  《{activeTodayItem.book.title}》
                </h4>
                <p className="text-xs text-[#9FB0D0] font-mono line-clamp-1">
                  著：{activeTodayItem.book.author} ｜ 理念：{activeTodayItem.book.tagline}
                </p>
              </div>

              <button
                onClick={() => setActiveInsightBook(activeTodayItem.book)}
                className="px-5 py-2.5 rounded-xl bg-[#5CF2C4] text-[#05070F] text-xs font-mono font-bold hover:bg-[#7DF9D2] hover:shadow-[0_0_15px_rgba(92,242,196,0.4)] transition-all flex items-center gap-2 shrink-0 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>查看心智模型拆解</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 模块三：我的私享书架（服务端持久化数据库） */}
        {/* ======================================================== */}
        {activeTab === "bookshelf" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2 text-xs font-mono text-[#7D88AA]">
              <span>借阅证 [{readerId}] 的专属私享书架（共 {serverBooks.length} 卷）</span>
              <span>数据直通云端数据库，换设备无缝同步</span>
            </div>

            {serverBooks.length === 0 ? (
              <div className="bg-[#0A0E1A]/80 rounded-2xl border border-[#1F2A4D] p-12 text-center backdrop-blur-md">
                <Bookmark className="h-8 w-8 text-[#7D88AA] mx-auto mb-3 opacity-40" />
                <h4 className="text-base font-sans font-bold text-[#EAF0FF] mb-1">
                  书架空空如也
                </h4>
                <p className="text-xs font-mono text-[#7D88AA] max-w-sm mx-auto mb-5">
                  前往「心智大厅」挑选您心仪的书目，点击“加入书架”，即可在此持久留存。
                </p>
                <button
                  onClick={() => setActiveTab("hall")}
                  className="px-4 py-2 rounded-xl bg-[#5CF2C4] text-[#05070F] text-xs font-mono font-bold hover:bg-[#7DF9D2] transition-all"
                >
                  去心智大厅挑选
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {serverBooks.map((sb) => {
                  const matchedBook = CURATOR_BOOKS.find((b) => b.id === sb.id);

                  return (
                    <div
                      key={sb.id}
                      className="bg-[#0A0E1A]/80 rounded-2xl border border-[#1F2A4D] p-4 flex gap-4 items-start shadow-md hover:border-[#5CF2C4]/50 transition-all relative group backdrop-blur-md"
                    >
                      <ZenBookCover
                        title={sb.title}
                        author={sb.author}
                        category={sb.category}
                        tone={sb.coverTone || "amber"}
                        size="sm"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-sans font-bold text-[#EAF0FF] truncate mb-1">
                          {sb.title}
                        </h4>
                        <p className="text-[11px] text-[#7D88AA] font-mono truncate mb-2">
                          {sb.author || "佚名"}
                        </p>

                        <div className="flex items-center gap-2 mt-4">
                          {matchedBook && (
                            <button
                              onClick={() => setActiveInsightBook(matchedBook)}
                              className="px-2.5 py-1 rounded-md bg-[#5CF2C4] text-[#05070F] text-[11px] font-mono font-bold hover:bg-[#7DF9D2] transition-all"
                            >
                              拆解
                            </button>
                          )}
                          <button
                            onClick={() => removeFromServerBookshelf(sb.id)}
                            className="p-1 text-[#7D88AA] hover:text-[#F43F5E] transition-colors"
                            title="从书架移除"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* --- 深度认知拆解弹窗 --- */}
      {activeInsightBook && (
        <BookInsightModal
          book={activeInsightBook}
          isInBookshelf={isBookInServerShelf(activeInsightBook.id)}
          onToggleBookshelf={(book) => {
            if (isBookInServerShelf(book.id)) {
              removeFromServerBookshelf(book.id);
            } else {
              addToServerBookshelf(book);
            }
          }}
          onMakeQuoteCard={handleMakeQuoteCard}
          onClose={() => setActiveInsightBook(null)}
        />
      )}
    </section>
  );
}
