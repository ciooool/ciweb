"use client";

import React, { useState } from "react";
import { Sparkles, Copy, Check, Quote, BookOpen } from "lucide-react";

interface PresetQuote {
  quote: string;
  author: string;
  source: string;
}

const sampleQuotes: PresetQuote[] = [
  {
    quote: "代码是世界上最民主的杠杆。计算机不会因为你的出身或背景而拒绝执行你的指令。",
    author: "纳瓦尔·拉维坎特",
    source: "《纳瓦尔宝典》",
  },
  {
    quote: "上善若水。水善利万物而不争，处众人之所恶，故几于道。",
    author: "老子",
    source: "《道德经》第八章",
  },
  {
    quote: "不要留下一扇破损的窗户。发现坏代码时，花两分钟随手重构它，保持代码库的尊严。",
    author: "大卫·托马斯",
    source: "《程序员修炼之道》",
  },
  {
    quote: "简朴，简朴，简朴！我说，让你的事情只有两件或三件，而不是一百件或一千件。",
    author: "亨利·戴维·梭罗",
    source: "《瓦尔登湖》",
  },
  {
    quote: "合抱之木，生于毫末；九层之台，起于累土；千里之行，始于足下。",
    author: "老子",
    source: "《道德经》第六十四章",
  },
];

type CardTheme = "xuan" | "inkstone" | "tea";

export default function QuoteCardStudio() {
  const [quoteText, setQuoteText] = useState(sampleQuotes[0].quote);
  const [author, setAuthor] = useState(sampleQuotes[0].author);
  const [source, setSource] = useState(sampleQuotes[0].source);
  const [theme, setTheme] = useState<CardTheme>("xuan");
  const [copied, setCopied] = useState(false);

  const handleSelectPreset = (p: PresetQuote) => {
    setQuoteText(p.quote);
    setAuthor(p.author);
    setSource(p.source);
  };

  const handleCopyText = () => {
    const formatted = `「${quoteText}」\n—— ${author} · ${source}\n(收录于 Ciooool 的云端书阁: ciooool.is-a.dev)`;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const themeStyles: Record<
    CardTheme,
    { cardBg: string; text: string; subText: string; border: string; quoteIcon: string }
  > = {
    xuan: {
      cardBg: "bg-[#FAF6F0]",
      text: "text-[#2B2A27]",
      subText: "text-[#7C766C]",
      border: "border-[#E5DAC8] shadow-md",
      quoteIcon: "text-[#D8CDBC]",
    },
    inkstone: {
      cardBg: "bg-[#1C1B1A]",
      text: "text-[#EDE8E1]",
      subText: "text-[#969188]",
      border: "border-[#33302B] shadow-xl",
      quoteIcon: "text-[#3D3A35]",
    },
    tea: {
      cardBg: "bg-[#F0F4F0]",
      text: "text-[#2F3E32]",
      subText: "text-[#627766]",
      border: "border-[#D1E0D3] shadow-md",
      quoteIcon: "text-[#C1D4C3]",
    },
  };

  const currentStyle = themeStyles[theme];

  return (
    <section id="quotecraft" className="py-20 md:py-28 border-b border-[#EAE6DF] dark:border-[#2C2A28] transition-colors">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-serif tracking-widest text-[#9E7B5B] uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9E7B5B]" />
              <span>灵感金句 · 纸墨排印</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#1F1E1D] dark:text-[#EDE9E3] tracking-tight">
              金句工坊与排印卡片
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#6B6760] dark:text-[#A8A49C] max-w-2xl font-serif leading-relaxed">
              研读至深处的刹那触动，一键凝练为温润素雅的案头名句卡片，供沉思自省与随手分享。
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-xs font-mono tracking-wider text-[#948F86]">
            EDITORIAL CARD CRAFT
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="text-xs font-serif text-[#6E6B65] dark:text-[#A8A49C] block mb-2">
                点击快速填入精选名句：
              </label>
              <div className="flex flex-wrap gap-1.5">
                {sampleQuotes.map((sq, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectPreset(sq)}
                    className="text-[11px] font-serif px-3 py-1 rounded-xl border border-[#E8E3DA] dark:border-[#33302B] bg-white dark:bg-[#201F1D] text-[#59554E] dark:text-[#CCC7BE] hover:border-[#C27D53] transition-colors truncate max-w-[190px]"
                  >
                    {sq.source}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-serif text-[#6E6B65] dark:text-[#A8A49C] block mb-1">
                金句内容 (Quote)
              </label>
              <textarea
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                rows={4}
                className="w-full text-xs p-3 rounded-2xl border border-[#E8E3DA] dark:border-[#33302B] bg-white dark:bg-[#201F1D] text-[#2C2A29] dark:text-[#EDE9E3] font-serif leading-relaxed resize-none focus:outline-hidden focus:ring-1 focus:ring-[#C27D53]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-serif text-[#6E6B65] dark:text-[#A8A49C] block mb-1">
                  著者 (Author)
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#E8E3DA] dark:border-[#33302B] bg-white dark:bg-[#201F1D] text-[#2C2A29] dark:text-[#EDE9E3] font-serif"
                />
              </div>

              <div>
                <label className="text-xs font-serif text-[#6E6B65] dark:text-[#A8A49C] block mb-1">
                  出处 / 篇章 (Source)
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#E8E3DA] dark:border-[#33302B] bg-white dark:bg-[#201F1D] text-[#2C2A29] dark:text-[#EDE9E3] font-serif"
                />
              </div>
            </div>

            {/* Theme Picker */}
            <div>
              <label className="text-xs font-serif text-[#6E6B65] dark:text-[#A8A49C] block mb-2">
                选择风雅纸质 (Theme)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTheme("xuan")}
                  className={`py-2 px-3 rounded-lg text-xs font-serif flex items-center justify-center gap-1.5 transition-all border ${
                    theme === "xuan"
                      ? "bg-[#FAF6F0] text-[#1F1E1D] border-[#1F1E1D] dark:border-[#EDE9E3] font-medium shadow-2xs"
                      : "bg-white dark:bg-[#201F1D] text-[#6B6760] border-[#EAE6DF] dark:border-[#38342E]"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#FAF6F0] border border-[#9E7B5B]" />
                  <span>宣纸温白</span>
                </button>

                <button
                  onClick={() => setTheme("inkstone")}
                  className={`py-2 px-3 rounded-lg text-xs font-serif flex items-center justify-center gap-1.5 transition-all border ${
                    theme === "inkstone"
                      ? "bg-[#1C1B1A] text-white border-[#1C1B1A] dark:border-[#EDE9E3] font-medium shadow-2xs"
                      : "bg-white dark:bg-[#201F1D] text-[#6B6760] border-[#EAE6DF] dark:border-[#38342E]"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#1C1B1A] border border-zinc-400" />
                  <span>深砚夜读</span>
                </button>

                <button
                  onClick={() => setTheme("tea")}
                  className={`py-2 px-3 rounded-lg text-xs font-serif flex items-center justify-center gap-1.5 transition-all border ${
                    theme === "tea"
                      ? "bg-[#F0F4F0] text-[#2F3E32] border-[#2F3E32] dark:border-[#EDE9E3] font-medium shadow-2xs"
                      : "bg-white dark:bg-[#201F1D] text-[#6B6760] border-[#EAE6DF] dark:border-[#38342E]"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#F0F4F0] border border-[#7A9482]" />
                  <span>雨后春茶</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleCopyText}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#1F1E1D] text-[#FAF8F5] dark:bg-[#EDE9E3] dark:text-[#181716] text-xs font-serif hover:bg-[#33312E] dark:hover:bg-white transition-all shadow-2xs"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4 opacity-70" />}
                <span>{copied ? "已复制到剪贴板" : "复制金句卡片文案"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Card Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="text-[11px] font-serif text-[#948F86] mb-2 flex items-center gap-1.5">
              <span>实时卡片排版预览</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#9E7B5B]" />
            </div>

            <div
              className={`w-full max-w-lg rounded-2xl p-8 sm:p-12 border ${currentStyle.border} ${currentStyle.cardBg} ${currentStyle.text} relative overflow-hidden transition-all duration-300 flex flex-col justify-between min-h-[320px] select-text`}
            >
              <div className={`absolute top-4 right-5 ${currentStyle.quoteIcon} pointer-events-none`}>
                <Quote className="h-14 w-14 opacity-40" />
              </div>

              <div className="relative z-10 pt-3">
                <p className="text-base sm:text-xl font-book-serif leading-relaxed tracking-wide mb-10 whitespace-pre-line">
                  “{quoteText}”
                </p>
              </div>

              <div className="relative z-10 pt-4 border-t border-current/15 flex items-end justify-between">
                <div>
                  <div className="font-book-serif font-bold text-sm tracking-tight">{author}</div>
                  <div className={`text-xs ${currentStyle.subText} font-serif mt-0.5`}>{source}</div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-mono tracking-widest opacity-60">
                    CIOOOOL DIGITAL ATELIER
                  </div>
                  <div className="text-[10px] font-serif font-semibold text-[#C27D53]">
                    ciooool.is-a.dev
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
