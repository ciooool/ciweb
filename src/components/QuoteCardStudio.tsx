"use client";

import React, { useState } from "react";
import { Quote, Copy, Check, Sparkles } from "lucide-react";

interface SampleQuote {
  text: string;
  author: string;
  source: string;
}

const sampleQuotes: SampleQuote[] = [
  {
    text: "人不是生来要给打败的。你可以消灭他，可就是打不败他。",
    author: "欧内斯特·海明威",
    source: "《老人与海》",
  },
  {
    text: "风萧萧兮易水寒，欠了钱兮就要还。历史的迷人之处，正在于它充满着不可逆的残酷与坚毅。",
    author: "当年明月",
    source: "《明朝那些事儿》",
  },
  {
    text: "穷人为钱工作，富人让钱为自己工作。资产是将钱放进你口袋的东西，负债是把钱拿走的东西。",
    author: "罗伯特·清崎",
    source: "《富爸爸穷爸爸》",
  },
  {
    text: "运用专长、责任感和杠杆，去追求财富、健康与心智自由。获得财富不是靠运气，而是靠成为具有这种能力的人。",
    author: "埃里克·乔根森 / 纳瓦尔",
    source: "《纳瓦尔宝典》",
  },
  {
    text: "反过来想，总是反过来想。如果我知道我会在哪里死去，我就永远不会去那个地方。",
    author: "查理·芒格",
    source: "《穷查理宝典》",
  },
];

export default function QuoteCardStudio() {
  const [quoteText, setQuoteText] = useState(sampleQuotes[0].text);
  const [author, setAuthor] = useState(sampleQuotes[0].author);
  const [source, setSource] = useState(sampleQuotes[0].source);
  const [theme, setTheme] = useState<"cyber" | "violet" | "minimal">("cyber");
  const [copied, setCopied] = useState(false);

  const handleSelectPreset = (sq: SampleQuote) => {
    setQuoteText(sq.text);
    setAuthor(sq.author);
    setSource(sq.source);
  };

  const handleCopyText = () => {
    const fullText = `“${quoteText}”\n—— ${author} · ${source}\n\n[来自 Ciooool Atelier 金句工坊]`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const themeStyles = {
    cyber: {
      cardBg: "bg-[#070C18]",
      text: "text-[#EAF0FF]",
      subText: "text-[#5CF2C4]",
      border: "border-[#5CF2C4]/40 shadow-[0_0_30px_rgba(92,242,196,0.15)]",
      quoteIcon: "text-[#5CF2C4]/20",
    },
    violet: {
      cardBg: "bg-[#0B091C]",
      text: "text-[#EAF0FF]",
      subText: "text-[#8B7BFF]",
      border: "border-[#8B7BFF]/40 shadow-[0_0_30px_rgba(139,123,255,0.15)]",
      quoteIcon: "text-[#8B7BFF]/20",
    },
    minimal: {
      cardBg: "bg-[#0A0E1A]",
      text: "text-[#EAF0FF]",
      subText: "text-[#9FB0D0]",
      border: "border-[#1F2A4D] shadow-lg",
      quoteIcon: "text-[#1F2A4D]",
    },
  };

  const currentStyle = themeStyles[theme];

  return (
    <section id="quotecraft" className="py-20 md:py-28 border-b border-[#1F2A4D]/80 relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#5CF2C4] uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CF2C4] shadow-[0_0_8px_#5CF2C4]" />
              <span>EDITORIAL CARD STUDIO · 灵感金句工坊</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-[#EAF0FF] tracking-tight">
              金句工坊与排印卡片
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#9FB0D0] max-w-2xl font-sans leading-relaxed">
              研读至深处的刹那共鸣，一键凝练为极简高奢的赛博案头金句卡片，供自省深思与全网传播。
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-xs font-mono tracking-wider text-[#8B7BFF]">
            DIGITAL CRAFT · 思想排印
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form (5 cols) */}
          <div className="lg:col-span-5 space-y-5 bg-[#0A0E1A]/80 p-6 rounded-2xl border border-[#1F2A4D] backdrop-blur-md">
            <div>
              <label className="text-xs font-mono text-[#9FB0D0] block mb-2">
                快捷填入经典案卷名句：
              </label>
              <div className="flex flex-wrap gap-1.5">
                {sampleQuotes.map((sq, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectPreset(sq)}
                    className="text-[11px] font-mono px-3 py-1 rounded-lg border border-[#1F2A4D] bg-[#05070F] text-[#9FB0D0] hover:border-[#5CF2C4] hover:text-[#5CF2C4] transition-colors truncate max-w-[190px]"
                  >
                    {sq.source}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-[#9FB0D0] block mb-1">
                金句内容 (Quote Text)
              </label>
              <textarea
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                rows={4}
                className="w-full text-xs p-3.5 rounded-xl border border-[#1F2A4D] bg-[#05070F] text-[#EAF0FF] font-sans leading-relaxed resize-none focus:outline-none focus:border-[#5CF2C4]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono">
              <div>
                <label className="text-xs text-[#9FB0D0] block mb-1">
                  著者 (Author)
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#1F2A4D] bg-[#05070F] text-[#EAF0FF] focus:outline-none focus:border-[#5CF2C4]"
                />
              </div>

              <div>
                <label className="text-xs text-[#9FB0D0] block mb-1">
                  出处 / 篇章 (Source)
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#1F2A4D] bg-[#05070F] text-[#EAF0FF] focus:outline-none focus:border-[#5CF2C4]"
                />
              </div>
            </div>

            {/* Theme Picker */}
            <div>
              <label className="text-xs font-mono text-[#9FB0D0] block mb-2">
                选择视觉风格 (Theme)
              </label>
              <div className="grid grid-cols-3 gap-2 font-mono">
                <button
                  onClick={() => setTheme("cyber")}
                  className={`py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all border ${
                    theme === "cyber"
                      ? "bg-[#5CF2C4]/15 text-[#5CF2C4] border-[#5CF2C4] font-bold"
                      : "bg-[#05070F] text-[#7D88AA] border-[#1F2A4D]"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#5CF2C4]" />
                  <span>电光薄荷</span>
                </button>

                <button
                  onClick={() => setTheme("violet")}
                  className={`py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all border ${
                    theme === "violet"
                      ? "bg-[#8B7BFF]/15 text-[#8B7BFF] border-[#8B7BFF] font-bold"
                      : "bg-[#05070F] text-[#7D88AA] border-[#1F2A4D]"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#8B7BFF]" />
                  <span>赛博紫罗兰</span>
                </button>

                <button
                  onClick={() => setTheme("minimal")}
                  className={`py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all border ${
                    theme === "minimal"
                      ? "bg-[#1F2A4D]/40 text-[#EAF0FF] border-[#EAF0FF] font-bold"
                      : "bg-[#05070F] text-[#7D88AA] border-[#1F2A4D]"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  <span>极简深曜</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleCopyText}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#5CF2C4] text-[#05070F] text-xs font-mono font-bold hover:bg-[#7DF9D2] hover:shadow-[0_0_20px_rgba(92,242,196,0.4)] transition-all shadow-md"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? "已复制到剪贴板" : "复制金句卡片排印文本"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Card Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="text-[11px] font-mono text-[#7D88AA] mb-3 flex items-center gap-1.5">
              <span>实时卡片排版预览 (Live Preview)</span>
              <Sparkles className="h-3 w-3 text-[#5CF2C4]" />
            </div>

            <div
              className={`w-full max-w-lg rounded-2xl p-8 sm:p-12 border ${currentStyle.border} ${currentStyle.cardBg} ${currentStyle.text} relative overflow-hidden transition-all duration-300 flex flex-col justify-between min-h-[340px] select-text backdrop-blur-md`}
            >
              <div className={`absolute top-4 right-5 ${currentStyle.quoteIcon} pointer-events-none`}>
                <Quote className="h-16 w-16 opacity-30" />
              </div>

              <div className="relative z-10 pt-2">
                <p className="text-base sm:text-xl font-sans font-medium leading-relaxed tracking-wide mb-10 whitespace-pre-line text-[#EAF0FF]">
                  “{quoteText}”
                </p>
              </div>

              <div className="relative z-10 pt-4 border-t border-white/10 flex items-end justify-between">
                <div>
                  <div className="font-sans font-bold text-sm text-[#EAF0FF]">{author}</div>
                  <div className={`text-xs ${currentStyle.subText} font-mono mt-0.5`}>{source}</div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-mono tracking-widest text-[#7D88AA]">
                    CIOOOUL ATELIER
                  </div>
                  <div className="text-[10px] font-mono font-bold text-[#5CF2C4]">
                    ciweb.dev
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
