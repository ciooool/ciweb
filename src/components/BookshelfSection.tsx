"use client";

import React, { useState } from "react";
import { portfolioData, BookItem } from "@/data/portfolioData";
import {
  BookOpen,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  Quote,
  Copy,
  Check,
} from "lucide-react";

export default function BookshelfSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedBookId, setExpandedBookId] = useState<string | null>(null);
  const [copiedQuote, setCopiedQuote] = useState<string | null>(null);

  const categories = [
    "全部",
    "意志与人文经典",
    "历史博弈与社会机制",
    "财富杠杆与心智自由",
    "多元思维与决策模型",
    "工程哲学与创造力",
  ];

  const filteredBooks = portfolioData.books.filter((book) => {
    const matchesCategory =
      selectedCategory === "全部" || book.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedBookId(expandedBookId === id ? null : id);
  };

  const handleCopyQuote = (text: string, title: string, author: string) => {
    navigator.clipboard.writeText(`“${text}” ——《${title}》${author}`);
    setCopiedQuote(text);
    setTimeout(() => setCopiedQuote(null), 2000);
  };

  // 封面色调映射
  const toneClasses: Record<string, { border: string; bg: string; text: string }> = {
    emerald: {
      border: "border-emerald-500/30",
      bg: "from-emerald-950/40 to-slate-950/80",
      text: "text-emerald-400",
    },
    amber: {
      border: "border-amber-500/30",
      bg: "from-amber-950/40 to-slate-950/80",
      text: "text-amber-400",
    },
    indigo: {
      border: "border-indigo-500/30",
      bg: "from-indigo-950/40 to-slate-950/80",
      text: "text-indigo-400",
    },
    teal: {
      border: "border-teal-500/30",
      bg: "from-teal-950/40 to-slate-950/80",
      text: "text-teal-400",
    },
    rose: {
      border: "border-rose-500/30",
      bg: "from-rose-950/40 to-slate-950/80",
      text: "text-rose-400",
    },
    slate: {
      border: "border-slate-500/30",
      bg: "from-slate-900/60 to-slate-950/80",
      text: "text-slate-300",
    },
  };

  return (
    <section id="books" className="py-20 md:py-28 border-b border-theme-line relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-theme-phosphor uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-theme-phosphor shadow-[0_0_8px_var(--phosphor)]" />
              <span>CURATED ARCHIVE · 心智书房</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-theme-primary tracking-tight">
              8 部精选殿堂认知经典
            </h2>
            <p className="mt-3 text-sm sm:text-base text-theme-secondary max-w-2xl font-sans leading-relaxed">
              拒绝信息流与碎片噪音。精选 8 部底层心智神作，深度结构化拆解心智模型，直通官方正版微信读书。
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-xs font-mono tracking-wider text-theme-violet">
            VERIFIED LINKS · 腾讯官方全本阅读直达
          </div>
        </div>

        {/* 搜索与分类导航 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          {/* 分类过滤器 */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 font-mono text-xs scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl border transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-theme-phosphor text-[#070a13] border-theme-phosphor font-bold shadow-xs"
                    : "border-theme-line bg-theme-surface text-theme-secondary hover:text-theme-primary hover:border-theme-violet"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 搜索框 */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-theme-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索书名、作者或理念..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs font-mono rounded-xl border border-theme-line bg-theme-surface text-theme-primary placeholder-theme-muted focus:outline-none focus:border-theme-phosphor transition-colors shadow-xs"
            />
          </div>
        </div>

        {/* 书籍卡片流 */}
        <div className="space-y-6">
          {filteredBooks.map((book: BookItem) => {
            const isExpanded = expandedBookId === book.id;
            const tone = toneClasses[book.coverTone] || toneClasses.emerald;

            return (
              <div
                key={book.id}
                className="rounded-2xl border border-theme-line bg-theme-surface/80 backdrop-blur-md overflow-hidden transition-all duration-300 shadow-card hover:border-theme-phosphor/40"
              >
                {/* 顶层主卡片概览 */}
                <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  
                  {/* 左侧：3D精装书封示意与核心标题 */}
                  <div className="flex items-start gap-5">
                    {/* 3D 书封徽章 */}
                    <div
                      className={`w-16 sm:w-20 h-24 sm:h-28 rounded-lg border ${tone.border} bg-gradient-to-br ${tone.bg} p-2 flex flex-col justify-between shrink-0 shadow-md relative group`}
                    >
                      <div className="text-[10px] font-mono text-theme-muted truncate">
                        {book.year}
                      </div>
                      <div className="text-center font-serif font-bold text-xs sm:text-sm text-theme-primary line-clamp-2">
                        {book.title}
                      </div>
                      <div className={`text-[9px] font-mono ${tone.text} truncate text-center`}>
                        ★ {book.rating.toFixed(1)}
                      </div>
                    </div>

                    {/* 书籍详细元数据 */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded border border-theme-line bg-theme-base text-theme-violet">
                          {book.category}
                        </span>
                        <span className="text-xs font-mono text-theme-muted">
                          {book.readingTime}
                        </span>
                        <span className="text-xs font-mono text-theme-phosphor font-bold">
                          ★ {book.rating.toFixed(1)} 殿堂分
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-sans font-bold text-theme-primary mb-1">
                        《{book.title}》
                        <span className="text-xs font-sans font-normal text-theme-muted ml-2">
                          著：{book.author}
                        </span>
                      </h3>

                      <p className="text-xs sm:text-sm font-mono text-theme-secondary mb-3">
                        {book.tagline}
                      </p>

                      <p className="text-xs text-theme-muted max-w-2xl font-sans leading-relaxed line-clamp-2">
                        {book.whyRead}
                      </p>
                    </div>
                  </div>

                  {/* 右侧：动作按钮组 */}
                  <div className="flex flex-wrap md:flex-col items-center gap-2.5 w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-theme-line font-mono text-xs">
                    {/* 微信读书官方直链 (100% 200 OK，杜绝404) */}
                    <a
                      href={book.weReadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 md:flex-none w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-theme-phosphor text-[#070a13] font-bold hover:opacity-90 hover:shadow-[0_0_15px_var(--phosphor)] transition-all shadow-xs"
                      title="直达微信读书官方全本阅读"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>微信读书全本</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>

                    {/* 豆瓣书评直链 */}
                    <a
                      href={book.doubanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 md:flex-none w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-theme-line bg-theme-base text-theme-secondary hover:text-theme-primary hover:border-theme-violet transition-colors"
                    >
                      <span>豆瓣评分</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>

                    {/* 展开深度心智模型拆解按钮 */}
                    <button
                      onClick={() => toggleExpand(book.id)}
                      className={`flex-1 md:flex-none w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border transition-colors cursor-pointer ${
                        isExpanded
                          ? "border-theme-phosphor bg-theme-phosphor/10 text-theme-phosphor"
                          : "border-theme-line text-theme-secondary hover:text-theme-primary"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-theme-phosphor" />
                      <span>{isExpanded ? "收起拆解" : "深度案卷"}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 内联展开区域：深度心智模型与金句拆解 (无需弹窗，彻底杜绝遮挡) */}
                {isExpanded && (
                  <div className="border-t border-theme-line bg-theme-base/50 p-6 sm:p-8 animate-in slide-in-from-top-2 duration-300 space-y-6">
                    <div className="flex items-center justify-between border-b border-theme-line/60 pb-3">
                      <div className="flex items-center gap-2 text-xs font-mono text-theme-phosphor uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-theme-phosphor" />
                        <span>DEEP COGNITIVE DOSSIER · 深度认知案卷模型</span>
                      </div>
                      <span className="text-[11px] font-mono text-theme-muted">
                        提炼于《{book.title}》
                      </span>
                    </div>

                    {/* 心智模型网格 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {book.models.map((model, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl border border-theme-line bg-theme-surface/70 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-mono font-bold text-theme-primary">
                              {model.title}
                            </h4>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-theme-base text-theme-violet">
                              MODEL #{idx + 1}
                            </span>
                          </div>
                          <p className="text-xs text-theme-secondary font-sans leading-relaxed">
                            {model.concept}
                          </p>
                          <div className="text-[11px] font-mono text-theme-phosphor pt-1 border-t border-theme-line/40">
                            <strong>认知解法：</strong>{model.takeaway}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 经典金句引文 */}
                    <div className="p-4 rounded-xl border border-theme-line bg-theme-surface/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Quote className="w-5 h-5 text-theme-violet shrink-0" />
                        <span className="text-xs sm:text-sm font-sans italic text-theme-primary">
                          “{book.keyQuote}”
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyQuote(book.keyQuote, book.title, book.author)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-theme-line hover:border-theme-phosphor text-[11px] font-mono text-theme-secondary hover:text-theme-primary transition-colors shrink-0 cursor-pointer"
                      >
                        {copiedQuote === book.keyQuote ? (
                          <Check className="w-3.5 h-3.5 text-theme-phosphor" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedQuote === book.keyQuote ? "已复制" : "复制金句"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
