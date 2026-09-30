"use client";

import React, { useState, useRef } from "react";
import { Sparkles, Copy, Check, RefreshCw, Share2, Quote, BookOpen } from "lucide-react";

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

type CardTheme = "obsidian" | "paper" | "aurora";

export default function QuoteCardStudio() {
  const [quoteText, setQuoteText] = useState(sampleQuotes[0].quote);
  const [author, setAuthor] = useState(sampleQuotes[0].author);
  const [source, setSource] = useState(sampleQuotes[0].source);
  const [theme, setTheme] = useState<CardTheme>("obsidian");
  const [copied, setCopied] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleSelectPreset = (p: PresetQuote) => {
    setQuoteText(p.quote);
    setAuthor(p.author);
    setSource(p.source);
  };

  const handleCopyText = () => {
    const formatted = `「${quoteText}」\n—— ${author} · ${source}\n(来自 ciooool 的数字书房: ciooool.is-a.dev)`;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const themeStyles: Record<
    CardTheme,
    { cardBg: string; text: string; subText: string; border: string; quoteIcon: string }
  > = {
    obsidian: {
      cardBg: "bg-zinc-950",
      text: "text-zinc-100",
      subText: "text-zinc-400",
      border: "border-zinc-800 shadow-2xl",
      quoteIcon: "text-zinc-700",
    },
    paper: {
      cardBg: "bg-[#fbf7ee]",
      text: "text-[#3c3836]",
      subText: "text-[#7c6f64]",
      border: "border-[#ebdccb] shadow-xl",
      quoteIcon: "text-[#d5c4a1]",
    },
    aurora: {
      cardBg: "bg-gradient-to-br from-indigo-950 via-zinc-900 to-purple-950",
      text: "text-white",
      subText: "text-indigo-200",
      border: "border-indigo-500/30 shadow-2xl",
      quoteIcon: "text-indigo-400/40",
    },
  };

  const currentStyle = themeStyles[theme];

  return (
    <section className="py-16 md:py-20 border-b border-zinc-200/60 dark:border-zinc-800/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>自研专属微工具 · 社交卡片工坊</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            QuoteCraft · 灵感金句卡片工坊
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            看到触动心弦的句子？一键生成杂志级高逼格排版卡片，自带社交分享美感与你的个人品牌印记。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Editor Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Quick Presets */}
            <div>
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-2">
                点击快速填入精选金句：
              </label>
              <div className="flex flex-wrap gap-1.5">
                {sampleQuotes.map((sq, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectPreset(sq)}
                    className="text-[11px] px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors truncate max-w-[200px]"
                  >
                    {sq.source}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div>
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
                金句内容 (Quote)
              </label>
              <textarea
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                rows={4}
                className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-purple-500 resize-none font-serif leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
                  作者 (Author)
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
                  出处 / 书籍 (Source)
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                />
              </div>
            </div>

            {/* Theme Picker */}
            <div>
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-2">
                选择视觉风格 (Theme)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTheme("obsidian")}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                    theme === "obsidian"
                      ? "bg-zinc-900 text-white border-zinc-700 shadow-sm"
                      : "bg-white text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-600"></span>
                  <span>曜石黑</span>
                </button>

                <button
                  onClick={() => setTheme("paper")}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                    theme === "paper"
                      ? "bg-[#fbf7ee] text-[#3c3836] border-[#d5c4a1] shadow-sm font-bold"
                      : "bg-white text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#fbf7ee] border border-amber-300"></span>
                  <span>羊皮纸</span>
                </button>

                <button
                  onClick={() => setTheme("aurora")}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                    theme === "aurora"
                      ? "bg-indigo-950 text-white border-indigo-400 shadow-sm"
                      : "bg-white text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></span>
                  <span>极光紫</span>
                </button>
              </div>
            </div>

            {/* Copy CTA */}
            <div className="pt-2">
              <button
                onClick={handleCopyText}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors shadow-sm"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? "已复制到剪贴板！" : "复制金句卡片文案"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Card Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="text-xs font-mono text-zinc-400 mb-2 flex items-center gap-1">
              <span>Card Live Preview</span>
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse"></span>
            </div>

            {/* The Actual Rendered Card */}
            <div
              ref={cardRef}
              className={`w-full max-w-lg rounded-3xl p-8 sm:p-10 border ${currentStyle.border} ${currentStyle.cardBg} ${currentStyle.text} relative overflow-hidden transition-all duration-300 flex flex-col justify-between min-h-[300px] select-text`}
            >
              {/* Background ambient quotation icon */}
              <div
                className={`absolute top-4 right-4 ${currentStyle.quoteIcon} pointer-events-none`}
              >
                <Quote className="h-16 w-16 opacity-30" />
              </div>

              {/* Quote Content */}
              <div className="relative z-10 pt-2">
                <p className="text-base sm:text-lg font-serif tracking-wide leading-relaxed mb-8 whitespace-pre-line">
                  “{quoteText}”
                </p>
              </div>

              {/* Card Footer: Author + Source + Personal Branding */}
              <div className="relative z-10 pt-4 border-t border-current/15 flex items-end justify-between">
                <div>
                  <div className="font-bold text-sm tracking-tight">{author}</div>
                  <div className={`text-xs ${currentStyle.subText} mt-0.5`}>{source}</div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-mono tracking-wider opacity-60">
                    CIOOOOL DIGITAL LIBRARY
                  </div>
                  <div className="text-[10px] font-mono font-medium text-purple-400">
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
