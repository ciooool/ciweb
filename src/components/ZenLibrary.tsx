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
  Calendar,
  Cloud,
  Sparkles,
  ExternalLink,
  Quote,
  Star,
  Compass,
  Filter,
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

  // 今日荐读选中的轮播索引 (0-5)
  const [todayIndex, setTodayIndex] = useState<number>(3); // 默认 09/30

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
  const handleMakeQuoteCard = (quoteText: string, bookTitle: string, author: string) => {
    setActiveInsightBook(null);
    const quoteSection = document.getElementById("quotecraft");
    if (quoteSection) {
      quoteSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 今日荐读轮播列表
  const todayList = [
    {
      date: "10/04",
      day: "周五",
      book: CURATOR_BOOKS.find((b) => b.id === "old-man-and-the-sea") || CURATOR_BOOKS[0],
      active: false,
    },
    {
      date: "10/05",
      day: "周六",
      book: CURATOR_BOOKS.find((b) => b.id === "ming-dynasty") || CURATOR_BOOKS[1],
      active: false,
    },
    {
      date: "10/06",
      day: "周日",
      book: CURATOR_BOOKS.find((b) => b.id === "rich-dad-poor-dad") || CURATOR_BOOKS[2],
      active: false,
    },
    {
      date: "10/07",
      day: "昨天",
      book: CURATOR_BOOKS.find((b) => b.id === "navals-almanack") || CURATOR_BOOKS[3],
      active: false,
    },
    {
      date: "10/08",
      day: "今天",
      book: CURATOR_BOOKS.find((b) => b.id === "poor-charlies-almanack") || CURATOR_BOOKS[4],
      active: true, // 主推位
    },
    {
      date: "10/09",
      day: "明天",
      book: CURATOR_BOOKS.find((b) => b.id === "antifragile") || CURATOR_BOOKS[5],
      active: false,
    },
    {
      date: "10/10",
      day: "周五",
      book: CURATOR_BOOKS.find((b) => b.id === "inside-china-system") || CURATOR_BOOKS[6],
      active: false,
    },
    {
      date: "10/11",
      day: "周六",
      book: CURATOR_BOOKS.find((b) => b.id === "courage-to-be-disliked") || CURATOR_BOOKS[7],
      active: false,
    },
  ];

  const activeTodayItem = todayList[todayIndex] || todayList[4];

  return (
    <section id="library" className="py-20 md:py-28 border-b border-[#EAE6DF] dark:border-[#2C2A28] transition-colors">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* --- 顶部 Header：品牌定位与读者证卡片 --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-serif tracking-widest text-[#9E7B5B] uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9E7B5B]" />
              <span>主理人私享书房 · 深度思想策展</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#1F1E1D] dark:text-[#EDE9E3] tracking-tight">
              私享书架与认知模型
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#9FB0D0] max-w-2xl font-mono leading-relaxed">
              <strong>拒绝残缺抓取与碎片阅读</strong>：精选 8 部殿堂级核心著作，深度拆解心智模型与精粹金句。
              全本正版直通<strong>微信读书官方</strong>，私享书架支持多端云端漫游。
            </p>
          </div>

          {/* 读者借阅证卡片 */}
          <div className="flex flex-col items-start sm:items-end gap-1.5 bg-[#FAF8F5] dark:bg-[#201F1D] p-3.5 sm:p-4 rounded-xl border border-[#EAE6DF] dark:border-[#38342E] shadow-2xs">
            <div className="flex items-center gap-2 text-xs text-[#6B6760] dark:text-[#A8A49C]">
              <Bookmark className="h-3.5 w-3.5 text-[#9E7B5B]" />
              <span className="font-serif">私享借阅证：</span>
              
              {isEditingReaderId ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tempReaderIdInput}
                    onChange={(e) => setTempReaderIdInput(e.target.value)}
                    placeholder="如: 913849"
                    className="w-24 px-2 py-0.5 text-xs font-mono rounded border border-[#1F1E1D] dark:border-[#EDE9E3] bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                  <button
                    onClick={handleSaveReaderId}
                    className="px-2 py-0.5 bg-[#1F1E1D] dark:bg-[#EDE9E3] text-[#FAF8F5] dark:text-[#181716] rounded text-[11px] font-serif"
                  >
                    同步
                  </button>
                </div>
              ) : (
                <span
                  onClick={() => setIsEditingReaderId(true)}
                  className="font-mono font-medium text-[#1F1E1D] dark:text-[#EDE9E3] bg-white dark:bg-zinc-800 px-2.5 py-0.5 rounded cursor-pointer border border-[#EAE6DF] dark:border-[#38342E] hover:border-[#1F1E1D] transition-colors"
                  title="点击可修改为你的专属借阅证号"
                >
                  {readerId}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-[11px] text-[#948F86]">
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
                className="inline-flex items-center gap-1 font-serif text-[#1F1E1D] dark:text-[#EDE9E3] hover:underline"
              >
                <RefreshCw className={`h-3 w-3 ${isLoadingServerBooks ? "animate-spin" : ""}`} />
                <span>{isLoadingServerBooks ? "同步中..." : "刷新云端"}</span>
              </button>
            </div>

            {serverNotice && (
              <span className="text-[10px] text-[#9E7B5B] font-serif transition-all">{serverNotice}</span>
            )}
          </div>
        </div>

        {/* --- 搜索框（支持搜索书名、作者或心智模型关键词） --- */}
        <div className="mb-8">
          <div className="relative flex items-center max-w-3xl">
            <div className="absolute left-4 text-[#948F86]">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索书名、作者或认知模型（如：纳瓦尔、破窗效应、反脆弱、极简、老子）"
              className="w-full pl-11 pr-24 py-3.5 rounded-xl bg-white dark:bg-[#1E1E20] border border-[#EAE6DF] dark:border-[#33302B] text-sm text-[#1F1E1D] dark:text-[#EDE9E3] placeholder:text-[#948F86] focus:outline-none focus:border-[#1F1E1D] dark:focus:border-[#EDE9E3] shadow-2xs transition-all font-serif"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 text-xs text-[#948F86] hover:text-[#1F1E1D] dark:hover:text-white"
              >
                清空
              </button>
            )}
          </div>
        </div>

        {/* --- 核心一级导航 Tabs --- */}
        <div className="flex items-center gap-2 border-b border-[#EAE6DF] dark:border-[#33302B] mb-8 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab("hall")}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-serif tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === "hall"
                ? "border-[#1F1E1D] text-[#1F1E1D] dark:border-[#EDE9E3] dark:text-[#EDE9E3] font-medium"
                : "border-transparent text-[#6B6760] dark:text-[#A8A49C] hover:text-[#1F1E1D] dark:hover:text-white"
            }`}
          >
            <span>私享心智大厅 ({CURATOR_BOOKS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("today")}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-serif tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === "today"
                ? "border-[#1F1E1D] text-[#1F1E1D] dark:border-[#EDE9E3] dark:text-[#EDE9E3] font-medium"
                : "border-transparent text-[#6B6760] dark:text-[#A8A49C] hover:text-[#1F1E1D] dark:hover:text-white"
            }`}
          >
            <span>今日荐读 · 展台</span>
          </button>

          <button
            onClick={() => setActiveTab("bookshelf")}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-serif tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === "bookshelf"
                ? "border-[#1F1E1D] text-[#1F1E1D] dark:border-[#EDE9E3] dark:text-[#EDE9E3] font-medium"
                : "border-transparent text-[#6B6760] dark:text-[#A8A49C] hover:text-[#1F1E1D] dark:hover:text-white"
            }`}
          >
            <span>我的私享书架 ({serverBooks.length})</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* 模块一：全景心智大厅（左侧垂直分类栏 + 右侧精装卡片） */}
        {/* ======================================================== */}
        {activeTab === "hall" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* 左侧：心智维度分类栏 */}
            <div className="md:col-span-3 bg-[#FAF8F5] dark:bg-[#1E1E20] rounded-xl border border-[#EAE6DF] dark:border-[#33302B] p-2 space-y-1">
              <div className="px-3 py-2 text-[10px] font-serif text-[#948F86] tracking-widest border-b border-[#EAE6DF] dark:border-[#33302B] mb-1 uppercase">
                心智分类维度
              </div>
              {CURATOR_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-left font-serif transition-all ${
                      isSelected
                        ? "bg-[#1F1E1D] text-[#FAF8F5] dark:bg-[#EDE9E3] dark:text-[#181716] shadow-xs"
                        : "text-[#6B6760] dark:text-[#C5C0B7] hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] tracking-wider opacity-60">{cat.icon}</span>
                      <span className="text-xs">{cat.name}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono ${
                        isSelected ? "text-[#FAF8F5]/70 dark:text-[#181716]/70" : "text-[#948F86]"
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
              <div className="flex items-center justify-between px-2 mb-2 text-xs font-serif text-[#948F86]">
                <span>
                  当前维度：{selectedCategory}（共 {filteredBooks.length} 卷）
                </span>
                <span>支持 3 大心智模型拆解与金句制图</span>
              </div>

              {filteredBooks.length === 0 ? (
                <div className="bg-[#FAF8F5] dark:bg-[#1E1E20] rounded-xl border border-[#EAE6DF] dark:border-[#33302B] p-12 text-center font-serif">
                  <Search className="h-6 w-6 text-[#948F86] mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-[#948F86]">
                    未找到与“{searchQuery}”匹配的藏书，建议清空搜索词查看全部书目。
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBooks.map((book) => {
                    const inShelf = isBookInServerShelf(book.id);

                    return (
                      <div
                        key={book.id}
                        className="bg-white dark:bg-[#1E1E20] rounded-xl border border-[#EAE6DF] dark:border-[#33302B] p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-start justify-between shadow-2xs hover:border-[#D5CEBF] dark:hover:border-[#4A4742] transition-all group"
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
                          <span className="text-[10px] text-[#948F86] font-serif sm:text-center block">
                            {book.readingTime}
                          </span>
                        </div>

                        {/* 中部：图书核心信息与主理人金句 */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4
                              onClick={() => setActiveInsightBook(book)}
                              className="text-base sm:text-lg font-serif font-medium text-[#1F1E1D] dark:text-[#EDE9E3] group-hover:text-[#9E7B5B] transition-colors cursor-pointer"
                            >
                              {book.title}
                            </h4>
                            <span className="px-2 py-0.5 rounded text-[10px] font-serif border border-[#EAE6DF] dark:border-[#38342E] text-[#6B6760] dark:text-[#A8A49C]">
                              {book.category}
                            </span>
                            <span className="text-[11px] text-[#9E7B5B] font-mono font-medium">
                              {book.rating.toFixed(1)} 分
                            </span>
                          </div>

                          <p className="text-xs text-[#6B6760] dark:text-[#B0ABA0] font-serif italic line-clamp-1">
                            “{book.tagline}”
                          </p>

                          <p className="text-xs text-[#7A746C] dark:text-[#9E9A90] font-serif line-clamp-2 leading-relaxed">
                            {book.curatorEssay}
                          </p>

                          {/* 心智模型标签预览 */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {book.models.map((m, mIdx) => (
                              <span
                                key={mIdx}
                                className="px-2 py-0.5 rounded text-[10px] font-serif bg-[#FAF8F5] dark:bg-[#252528] border border-[#EAE6DF] dark:border-[#38342E] text-[#6B6760] dark:text-[#C5C0B7]"
                              >
                                · {m.title}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* 右侧：操作按钮组 */}
                        <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EAE6DF] dark:border-[#33302B]">
                          <button
                            onClick={() => setActiveInsightBook(book)}
                            className="flex-1 sm:flex-none w-full px-4 py-2 rounded-lg bg-[#1F1E1D] dark:bg-[#EDE9E3] text-[#FAF8F5] dark:text-[#181716] text-xs font-serif hover:bg-[#33312E] dark:hover:bg-white transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <span>深度拆解</span>
                          </button>

                          <a
                            href={book.weReadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 sm:flex-none w-full px-3 py-2 rounded-lg text-xs font-serif border border-[#EAE6DF] dark:border-[#38342E] text-[#6B6760] dark:text-[#A8A49C] hover:border-[#1F1E1D] dark:hover:border-white transition-all flex items-center justify-center gap-1"
                          >
                            <BookOpen className="h-3 w-3 opacity-70" />
                            <span>微信读书全本</span>
                          </a>

                          <button
                            onClick={() => {
                              if (inShelf) {
                                removeFromServerBookshelf(book.id);
                              } else {
                                addToServerBookshelf(book);
                              }
                            }}
                            className={`flex-1 sm:flex-none w-full px-3 py-1.5 rounded-lg text-[11px] font-serif transition-colors flex items-center justify-center gap-1 ${
                              inShelf
                                ? "text-[#9E7B5B] bg-[#9E7B5B]/10"
                                : "text-[#948F86] hover:text-[#1F1E1D] dark:hover:text-white"
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
        {/* 模块二：今日荐读 3D 展台 */}
        {/* ======================================================== */}
        {/* ======================================================== */}
        {/* 模块二：今日荐读 展台 */}
        {/* ======================================================== */}
        {activeTab === "today" && (
          <div className="bg-[#FAF8F5] dark:bg-[#1E1E20] rounded-2xl border border-[#EAE6DF] dark:border-[#33302B] p-6 sm:p-10 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#EAE6DF] dark:border-[#33302B]">
              <div>
                <div className="flex items-center gap-2 text-xs font-serif text-[#9E7B5B] tracking-widest uppercase mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9E7B5B]" />
                  <span>今日荐读 · 案头清供</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-medium text-[#1F1E1D] dark:text-[#EDE9E3]">
                  本周主推 · 独立工匠认知跃迁
                </h3>
                <p className="text-xs sm:text-sm text-[#6B6760] dark:text-[#A8A49C] font-serif mt-1">
                  丈量时代前行的脉络，在纷扰中构建属于你的无需许可杠杆
                </p>
              </div>

              <span className="text-xs font-serif text-[#948F86]">
                自然周历推荐
              </span>
            </div>

            {/* 封面日历滑块 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 mb-8">
              {todayList.map((item, idx) => {
                const isSelected = todayIndex === idx;

                return (
                  <div
                    key={item.date}
                    onClick={() => setTodayIndex(idx)}
                    className={`flex flex-col items-center cursor-pointer transition-all duration-300 p-2.5 rounded-xl ${
                      isSelected
                        ? "bg-white dark:bg-black/30 shadow-xs scale-102 border border-[#1F1E1D] dark:border-[#EDE9E3]"
                        : "hover:scale-101 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <ZenBookCover
                      title={item.book.title}
                      author={item.book.author}
                      category={item.book.category}
                      tone={item.book.coverTone}
                      size="md"
                    />
                    
                    <div className="mt-3 text-center">
                      <span
                        className={`text-xs font-mono font-medium block ${
                          isSelected ? "text-[#1F1E1D] dark:text-[#EDE9E3]" : "text-[#7A746C]"
                        }`}
                      >
                        {item.date}
                      </span>
                      <span className="text-[10px] text-[#948F86] font-serif block">
                        {item.day}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 聚焦卡片 */}
            <div className="bg-white dark:bg-[#252528] rounded-xl border border-[#EAE6DF] dark:border-[#38342E] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-serif border border-[#EAE6DF] dark:border-[#38342E] text-[#9E7B5B]">
                  <span>{activeTodayItem.date} {activeTodayItem.day} 主推理念</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-serif font-medium text-[#1F1E1D] dark:text-[#EDE9E3]">
                  《{activeTodayItem.book.title}》
                </h4>
                <p className="text-xs text-[#6B6760] dark:text-[#A8A49C] font-serif line-clamp-1">
                  著：{activeTodayItem.book.author} ｜ 核心提要：{activeTodayItem.book.tagline}
                </p>
              </div>

              <button
                onClick={() => setActiveInsightBook(activeTodayItem.book)}
                className="px-5 py-2.5 rounded-lg bg-[#1F1E1D] dark:bg-[#EDE9E3] text-[#FAF8F5] dark:text-[#181716] text-xs font-serif hover:bg-[#33312E] dark:hover:bg-white transition-all flex items-center gap-2 shrink-0 shadow-2xs"
              >
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
            <div className="flex items-center justify-between px-2 text-xs font-serif text-[#948F86]">
              <span>借阅证 [{readerId}] 的专属私享书架（共 {serverBooks.length} 卷）</span>
              <span>数据直通云端数据库，换设备无缝同步</span>
            </div>

            {serverBooks.length === 0 ? (
              <div className="bg-[#FAF8F5] dark:bg-[#1E1E20] rounded-xl border border-[#EAE6DF] dark:border-[#33302B] p-12 text-center font-serif">
                <Bookmark className="h-8 w-8 text-[#948F86] mx-auto mb-3 opacity-40" />
                <h4 className="text-base font-medium text-[#1F1E1D] dark:text-[#EDE9E3] mb-1">
                  书架空空如也
                </h4>
                <p className="text-xs text-[#948F86] max-w-sm mx-auto mb-5">
                  前往「心智大厅」挑选您心仪的书目，点击“加入书架”，即可在此持久留存。
                </p>
                <button
                  onClick={() => setActiveTab("hall")}
                  className="px-4 py-2 rounded-lg bg-[#1F1E1D] dark:bg-[#EDE9E3] text-[#FAF8F5] dark:text-[#181716] text-xs font-serif hover:bg-[#33312E] dark:hover:bg-white transition-all"
                >
                  去心智大厅挑书
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {serverBooks.map((sb) => {
                  const matchedBook = CURATOR_BOOKS.find((b) => b.id === sb.id);

                  return (
                    <div
                      key={sb.id}
                      className="bg-white dark:bg-[#1E1E20] rounded-xl border border-[#EAE6DF] dark:border-[#33302B] p-4 flex gap-4 items-start shadow-2xs hover:border-[#D5CEBF] dark:hover:border-[#4A4742] transition-all relative group"
                    >
                      <ZenBookCover
                        title={sb.title}
                        author={sb.author}
                        category={sb.category}
                        tone={sb.coverTone || "amber"}
                        size="sm"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-serif font-medium text-[#1F1E1D] dark:text-[#EDE9E3] truncate mb-1">
                          {sb.title}
                        </h4>
                        <p className="text-[11px] text-[#948F86] font-serif truncate mb-2">
                          {sb.author || "佚名"}
                        </p>

                        <div className="flex items-center gap-2 mt-4">
                          {matchedBook && (
                            <button
                              onClick={() => setActiveInsightBook(matchedBook)}
                              className="px-2.5 py-1 rounded-md bg-[#1F1E1D] dark:bg-[#EDE9E3] text-[#FAF8F5] dark:text-[#181716] text-[11px] font-serif hover:bg-[#33312E] dark:hover:bg-white transition-all"
                            >
                              拆解
                            </button>
                          )}
                          <button
                            onClick={() => removeFromServerBookshelf(sb.id)}
                            className="p-1 text-[#948F86] hover:text-[#1F1E1D] dark:hover:text-white transition-colors"
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
