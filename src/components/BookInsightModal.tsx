"use client";

import React, { useState, useEffect } from "react";
import { CuratorBook } from "@/data/curatorBooks";
import ZenBookCover from "@/components/ZenBookCover";
import {
  X,
  Star,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Quote,
  Copy,
  Check,
  Clock,
  Compass,
  BookOpen,
} from "lucide-react";

interface BookInsightModalProps {
  book: CuratorBook;
  isInBookshelf: boolean;
  onToggleBookshelf: (book: CuratorBook) => void;
  onMakeQuoteCard: (quoteText: string, bookTitle: string, author: string) => void;
  onClose: () => void;
}

export default function BookInsightModal({
  book,
  isInBookshelf,
  onToggleBookshelf,
  onMakeQuoteCard,
  onClose,
}: BookInsightModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // 监听 ESC 键关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleCopyQuote = (text: string, idx: number) => {
    navigator.clipboard.writeText(`“${text}” ——《${book.title}》${book.author}`);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#FAF8F5] dark:bg-[#181716] border border-[#EAE6DF] dark:border-[#2C2A28] shadow-2xl overflow-hidden select-text text-[#1F1E1D] dark:text-[#EDE9E3]"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05)",
        }}
      >
        {/* --- 顶栏 Header --- */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE6DF] dark:border-[#2C2A28] bg-[#FAF8F5]/90 dark:bg-[#181716]/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs font-serif text-[#9E7B5B] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9E7B5B]" />
            <span>深度认知拆解 · 思想案卷</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookshelf(book)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif border transition-all ${
                isInBookshelf
                  ? "bg-[#9E7B5B]/10 border-[#9E7B5B] text-[#9E7B5B]"
                  : "bg-white dark:bg-zinc-800 border-[#EAE6DF] dark:border-[#38342E] text-[#6B6760] dark:text-[#A8A49C] hover:border-[#1F1E1D] dark:hover:border-white"
              }`}
            >
              {isInBookshelf ? (
                <>
                  <BookmarkCheck className="h-3.5 w-3.5" />
                  <span>已在书房</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>收入书架</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#6B6760] hover:text-[#1F1E1D] dark:text-[#A8A49C] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="关闭 (ESC)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* --- 核心内容滚动区 --- */}
        <div className="overflow-y-auto p-6 sm:p-8 md:p-10 space-y-10 font-serif">
          
          {/* 1. 书籍信息与主理人锐评 */}
          <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-start pb-8 border-b border-[#EAE6DF] dark:border-[#2C2A28]">
            {/* 精装实体书封 */}
            <ZenBookCover
              title={book.title}
              author={book.author}
              category={book.category}
              tone={book.coverTone}
              size="lg"
              className="mx-auto sm:mx-0 shadow-md"
            />

            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs border border-[#EAE6DF] dark:border-[#38342E] text-[#6B6760] dark:text-[#A8A49C]">
                  {book.category}
                </span>
                <span className="text-xs text-[#9E7B5B] font-mono font-medium px-2 py-0.5">
                  {book.rating.toFixed(1)} 殿堂分
                </span>
                <span className="flex items-center gap-1 text-xs text-[#948F86] font-mono">
                  <Clock className="h-3 w-3" />
                  <span>{book.readingTime}</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#1F1E1D] dark:text-[#EDE9E3]">
                {book.title}
              </h2>
              <p className="text-sm text-[#6B6760] dark:text-[#A8A49C]">
                著：{book.author} {book.region && `· ${book.region}`} {book.year && `(${book.year})`}
              </p>

              {/* 穿透力金句标语 */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#201F1D] border border-[#EAE6DF] dark:border-[#38342E] shadow-2xs">
                <p className="text-xs sm:text-sm italic text-[#6B6760] dark:text-[#C5C0B7] leading-relaxed">
                  “{book.tagline}”
                </p>
              </div>

              {/* 官方专业阅读跳转入口 */}
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
                <a
                  href={book.weReadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1F1E1D] dark:bg-[#EDE9E3] text-[#FAF8F5] dark:text-[#181716] hover:bg-[#33312E] dark:hover:bg-white transition-all shadow-2xs"
                >
                  <BookOpen className="h-3.5 w-3.5 opacity-80" />
                  <span>在微信读书中畅读全本</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>

                <a
                  href={book.doubanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#EAE6DF] dark:border-[#38342E] text-[#6B6760] dark:text-[#A8A49C] hover:border-[#1F1E1D] dark:hover:border-white transition-colors bg-white dark:bg-[#201F1D]"
                >
                  <span>豆瓣高分书评</span>
                  <ExternalLink className="h-3 w-3 opacity-50" />
                </a>
              </div>
            </div>
          </div>

          {/* 2. 主理人独家深度导读 (Curator's Thesis) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-[#9E7B5B] uppercase">
              <Compass className="h-3.5 w-3.5" />
              <span>主理人导读与架构思考</span>
            </div>
            <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#201F1D] border border-[#EAE6DF] dark:border-[#38342E] leading-relaxed text-sm text-[#4A4843] dark:text-[#C5C0B7] space-y-3 shadow-2xs">
              <p>{book.curatorEssay}</p>
              <div className="pt-2 border-t border-dashed border-[#EAE6DF] dark:border-[#38342E] flex items-center justify-between text-xs text-[#948F86]">
                <span>推荐旨要：{book.whyRead}</span>
                <span className="font-mono text-[10px] tracking-wider opacity-60">CIWEB CURATED</span>
              </div>
            </div>
          </div>

          {/* 3. 三大核心心智模型 (3 Key Mental Models) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-[#9E7B5B] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9E7B5B]" />
                <span>3 大核心心智模型</span>
              </div>
              <span className="text-[11px] text-[#948F86]">一书三解 · 穿透表象</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {book.models.map((m, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-white dark:bg-[#201F1D] border border-[#EAE6DF] dark:border-[#38342E] shadow-2xs hover:border-[#D5CEBF] dark:hover:border-[#4A4742] transition-colors group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#9E7B5B] font-medium">
                        0{idx + 1}
                      </span>
                      <h4 className="text-sm font-medium text-[#1F1E1D] dark:text-[#EDE9E3]">
                        {m.title}
                      </h4>
                    </div>
                    <p className="text-xs text-[#6B6760] dark:text-[#9E9A90] leading-relaxed">
                      {m.concept}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F2ECE1] dark:border-[#33302B]">
                    <div className="text-[10px] font-mono tracking-wider text-[#9E7B5B] mb-1">
                      ACTION / 行动准则
                    </div>
                    <p className="text-[11px] text-[#6B6760] dark:text-[#C5C0B7] leading-normal">
                      {m.takeaway}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. 灵魂震撼金句库 (Impactful Quotes) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-[#9E7B5B] uppercase">
                <Quote className="h-3.5 w-3.5" />
                <span>原著精粹金句库</span>
              </div>
              <span className="text-[11px] text-[#948F86]">字字千钧 · 历久弥新</span>
            </div>

            <div className="space-y-3">
              {book.quotes.map((quote, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#201F1D] border border-[#EAE6DF] dark:border-[#38342E] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-[#D5CEBF] dark:hover:border-[#4A4742] transition-colors"
                >
                  <p className="text-xs sm:text-sm text-[#4A4843] dark:text-[#D5D0C6] leading-relaxed italic">
                    “{quote}”
                  </p>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* 复制按钮 */}
                    <button
                      onClick={() => handleCopyQuote(quote, idx)}
                      className="p-1.5 rounded-lg text-xs border border-[#EAE6DF] dark:border-[#38342E] text-[#6B6760] hover:text-[#1F1E1D] dark:hover:text-white transition-colors flex items-center gap-1"
                      title="复制金句"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-[#9E7B5B]" />
                          <span className="text-[10px] text-[#9E7B5B]">已复制</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 opacity-60" />
                          <span className="text-[10px]">复制</span>
                        </>
                      )}
                    </button>

                    {/* 制作金句社交卡片 */}
                    <button
                      onClick={() => onMakeQuoteCard(quote, book.title, book.author)}
                      className="px-2.5 py-1.5 rounded-lg text-[10px] font-serif border border-[#EAE6DF] dark:border-[#38342E] text-[#1F1E1D] dark:text-[#EDE9E3] hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-1"
                    >
                      <span>制图工坊</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* --- 底部操作栏 --- */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#EAE6DF] dark:border-[#2C2A28] bg-[#FAF8F5]/90 dark:bg-[#181716]/90 backdrop-blur-md">
          <div className="text-xs text-[#948F86] font-serif hidden sm:block">
            全本正版由微信读书 / 豆瓣读书提供 ｜ 主理人策展架构模型
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <a
              href={book.weReadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#1F1E1D] dark:bg-[#EDE9E3] text-[#FAF8F5] dark:text-[#181716] text-xs font-serif hover:bg-[#33312E] dark:hover:bg-white transition-all shadow-2xs"
            >
              <BookOpen className="h-3.5 w-3.5 opacity-80" />
              <span>微信读书畅读全本</span>
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-[#EAE6DF] dark:border-[#38342E] text-xs font-serif text-[#6B6760] dark:text-[#A8A49C] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              返回书房
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
