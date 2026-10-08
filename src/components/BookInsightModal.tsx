"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CuratorBook } from "@/data/curatorBooks";
import ZenBookCover from "@/components/ZenBookCover";
import {
  X,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = origOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleCopyQuote = (text: string, idx: number) => {
    navigator.clipboard.writeText(`“${text}” ——《${book.title}》${book.author}`);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0A0E1A] border border-[#1F2A4D] shadow-2xl overflow-hidden select-text text-[#EAF0FF]"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(92, 242, 196, 0.1)",
        }}
      >
        {/* --- 顶栏 Header --- */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F2A4D] bg-[#0A0E1A]/95 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs font-mono text-[#5CF2C4] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5CF2C4] shadow-[0_0_8px_#5CF2C4]" />
            <span>DEEP COGNITION DOSSIER · 深度认知案卷</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookshelf(book)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                isInBookshelf
                  ? "bg-[#5CF2C4]/15 border-[#5CF2C4] text-[#5CF2C4]"
                  : "bg-[#05070F] border-[#1F2A4D] text-[#9FB0D0] hover:border-[#5CF2C4] hover:text-[#EAF0FF]"
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
              className="p-1.5 rounded-xl text-[#7D88AA] hover:text-[#EAF0FF] hover:bg-[#1F2A4D]/40 transition-colors"
              title="关闭 (ESC)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* --- 核心内容滚动区 --- */}
        <div className="overflow-y-auto p-6 sm:p-8 md:p-10 space-y-10 font-sans">
          
          {/* 1. 书籍信息与主理人锐评 */}
          <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-start pb-8 border-b border-[#1F2A4D]">
            {/* 精装立体书封 */}
            <ZenBookCover
              title={book.title}
              author={book.author}
              category={book.category}
              tone={book.coverTone}
              size="lg"
              className="mx-auto sm:mx-0 shadow-lg shrink-0"
            />

            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-mono border border-[#1F2A4D] bg-[#05070F] text-[#8B7BFF]">
                  {book.category}
                </span>
                <span className="text-xs text-[#5CF2C4] font-mono font-bold px-2 py-0.5 border border-[#5CF2C4]/30 bg-[#5CF2C4]/10 rounded">
                  ★ {book.rating.toFixed(1)} 殿堂分
                </span>
                <span className="flex items-center gap-1 text-xs text-[#7D88AA] font-mono">
                  <Clock className="h-3 w-3" />
                  <span>{book.readingTime}</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#EAF0FF]">
                {book.title}
              </h2>
              <p className="text-sm font-mono text-[#9FB0D0]">
                著：{book.author} {book.region && `· ${book.region}`} {book.year && `(${book.year})`}
              </p>

              {/* 穿透力金句标语 */}
              <div className="p-4 rounded-xl bg-[#05070F] border border-[#1F2A4D]">
                <p className="text-xs sm:text-sm font-mono italic text-[#8B7BFF] leading-relaxed">
                  “{book.tagline}”
                </p>
              </div>

              {/* 官方阅读跳转入口 */}
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-mono">
                <a
                  href={book.weReadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5CF2C4] text-[#05070F] font-bold hover:bg-[#7DF9D2] hover:shadow-[0_0_15px_rgba(92,242,196,0.4)] transition-all"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>在微信读书中畅读全本</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>

                <a
                  href={book.doubanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#1F2A4D] text-[#9FB0D0] hover:text-[#EAF0FF] hover:border-[#8B7BFF] transition-colors bg-[#05070F]"
                >
                  <span>豆瓣高分书评</span>
                  <ExternalLink className="h-3 w-3 opacity-50" />
                </a>
              </div>
            </div>
          </div>

          {/* 2. 主理人深度导读 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#5CF2C4] uppercase">
              <Compass className="h-3.5 w-3.5" />
              <span>主理人导读与架构思考</span>
            </div>
            <div className="p-6 rounded-2xl bg-[#05070F] border border-[#1F2A4D] leading-relaxed text-sm text-[#9FB0D0] space-y-3">
              <p>{book.curatorEssay}</p>
              <div className="pt-3 border-t border-[#1F2A4D] flex items-center justify-between text-xs font-mono text-[#7D88AA]">
                <span>策展提要：{book.whyRead}</span>
                <span className="text-[#5CF2C4] opacity-75">CIWEB CURATED</span>
              </div>
            </div>
          </div>

          {/* 3. 三大核心心智模型 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#5CF2C4] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5CF2C4]" />
                <span>3 大核心认知模型</span>
              </div>
              <span className="text-[11px] font-mono text-[#7D88AA]">一书三解 · 穿透底层逻辑</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {book.models.map((m, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between p-5 rounded-2xl bg-[#05070F] border border-[#1F2A4D] hover:border-[#5CF2C4]/50 transition-colors group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#5CF2C4] font-bold">
                        0{idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-[#EAF0FF]">
                        {m.title}
                      </h4>
                    </div>
                    <p className="text-xs text-[#9FB0D0] leading-relaxed font-sans">
                      {m.concept}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1F2A4D]">
                    <div className="text-[10px] font-mono tracking-wider text-[#5CF2C4] mb-1 uppercase font-bold">
                      ACTION / 行动准则
                    </div>
                    <p className="text-[11px] text-[#9FB0D0] leading-normal font-sans">
                      {m.takeaway}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. 原著精粹金句库 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#5CF2C4] uppercase">
                <Quote className="h-3.5 w-3.5" />
                <span>原著精粹金句库</span>
              </div>
              <span className="text-[11px] font-mono text-[#7D88AA]">字字千钧 · 思想火花</span>
            </div>

            <div className="space-y-3">
              {book.quotes.map((quote, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#05070F] border border-[#1F2A4D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-[#5CF2C4]/40 transition-colors"
                >
                  <p className="text-xs sm:text-sm text-[#EAF0FF] leading-relaxed italic font-serif">
                    “{quote}”
                  </p>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* 复制按钮 */}
                    <button
                      onClick={() => handleCopyQuote(quote, idx)}
                      className="p-2 rounded-xl text-xs border border-[#1F2A4D] bg-[#0A0E1A] text-[#9FB0D0] hover:text-[#5CF2C4] hover:border-[#5CF2C4]/50 transition-colors flex items-center gap-1 font-mono"
                      title="复制金句"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-[#5CF2C4]" />
                          <span className="text-[10px] text-[#5CF2C4]">已复制</span>
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
                      className="px-3 py-1.5 rounded-xl text-[10px] font-mono border border-[#1F2A4D] bg-[#0A0E1A] text-[#9FB0D0] hover:text-[#5CF2C4] hover:border-[#5CF2C4]/50 transition-all flex items-center gap-1"
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#1F2A4D] bg-[#0A0E1A]/95 backdrop-blur-md">
          <div className="text-xs text-[#7D88AA] font-mono hidden sm:block">
            全本正版由微信读书 / 豆瓣读书提供 ｜ 主理人策展认知模型
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end font-mono">
            <a
              href={book.weReadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#5CF2C4] text-[#05070F] text-xs font-bold hover:bg-[#7DF9D2] hover:shadow-[0_0_15px_rgba(92,242,196,0.35)] transition-all"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>微信读书畅读全本</span>
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#1F2A4D] text-xs text-[#9FB0D0] hover:text-[#EAF0FF] hover:border-[#8B7BFF] transition-colors bg-[#05070F]"
            >
              返回书房
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
