"use client";

import React, { useState } from "react";

export type BookCoverTone = "xuan" | "celadon" | "terracotta" | "indigo" | "ink" | "amber";

interface ZenBookCoverProps {
  title: string;
  author?: string;
  category?: string;
  coverUrl?: string;
  tone?: BookCoverTone;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

// 雅致传统古典色彩方案（高奢低饱和纸绢墨石色调）
const TONE_STYLES: Record<
  BookCoverTone,
  {
    bg: string;
    border: string;
    textTitle: string;
    textSub: string;
    accentLine: string;
    sealBorder: string;
    sealText: string;
    spineShadow: string;
  }
> = {
  // 1. 仿宣纸米黄 (小清新 · 素雅白宣)
  xuan: {
    bg: "bg-[#F8F5EE] bg-gradient-to-br from-[#FCFAF5] via-[#F6F2E9] to-[#ECE6DA]",
    border: "border-[#E0D7C8]",
    textTitle: "text-[#2B2927]",
    textSub: "text-[#7A746C]",
    accentLine: "border-[#C5B8A5]",
    sealBorder: "border-[#9E3A2E]",
    sealText: "text-[#9E3A2E]",
    spineShadow: "from-black/15 via-black/5 to-transparent",
  },
  // 2. 宋瓷粉青 (极淡冷冽文气)
  celadon: {
    bg: "bg-[#EDF1EE] bg-gradient-to-br from-[#F4F7F5] via-[#E8EDE9] to-[#DCE3DE]",
    border: "border-[#C5D3CA]",
    textTitle: "text-[#213028]",
    textSub: "text-[#586B61]",
    accentLine: "border-[#A7BBB0]",
    sealBorder: "border-[#9E3A2E]",
    sealText: "text-[#9E3A2E]",
    spineShadow: "from-black/15 via-black/5 to-transparent",
  },
  // 3. 赭石暖木 (沉稳温润炭棕)
  terracotta: {
    bg: "bg-[#352D2B] bg-gradient-to-br from-[#3D3432] via-[#322A28] to-[#251E1C]",
    border: "border-[#544845]",
    textTitle: "text-[#F5EFE6]",
    textSub: "text-[#C4B7A9]",
    accentLine: "border-[#73635F]/40",
    sealBorder: "border-[#D98A7E]",
    sealText: "text-[#D98A7E]",
    spineShadow: "from-black/40 via-black/15 to-transparent",
  },
  // 4. 黛石深灰 (极简冷调墨蓝)
  indigo: {
    bg: "bg-[#252A30] bg-gradient-to-br from-[#2D333B] via-[#23272C] to-[#181C20]",
    border: "border-[#404852]",
    textTitle: "text-[#F3F0EA]",
    textSub: "text-[#A9B3BF]",
    accentLine: "border-[#525E6B]/40",
    sealBorder: "border-[#C4675B]",
    sealText: "text-[#C4675B]",
    spineShadow: "from-black/45 via-black/15 to-transparent",
  },
  // 5. 徽墨玄石 (至简松烟大器)
  ink: {
    bg: "bg-[#1E1E20] bg-gradient-to-br from-[#272729] via-[#1B1B1C] to-[#121213]",
    border: "border-[#38383B]",
    textTitle: "text-[#EDE9E1]",
    textSub: "text-[#999690]",
    accentLine: "border-[#4F4F54]/40",
    sealBorder: "border-[#A83D2F]",
    sealText: "text-[#A83D2F]",
    spineShadow: "from-black/50 via-black/15 to-transparent",
  },
  // 6. 琥珀细麻 (温润浅亚麻)
  amber: {
    bg: "bg-[#EFEAE0] bg-gradient-to-br from-[#F6F2E9] via-[#EDE6D9] to-[#DFD6C5]",
    border: "border-[#D3C7B3]",
    textTitle: "text-[#382F24]",
    textSub: "text-[#756653]",
    accentLine: "border-[#BAAB93]",
    sealBorder: "border-[#9E3A2E]",
    sealText: "text-[#9E3A2E]",
    spineShadow: "from-black/15 via-black/5 to-transparent",
  },
};

// 尺寸映射
const SIZE_STYLES = {
  sm: "w-16 h-24 text-[10px]",
  md: "w-24 h-34 text-xs",
  lg: "w-32 h-46 text-sm",
  xl: "w-44 h-64 text-base",
};

// 根据书名哈希生成稳定色调
function hashStringToTone(str: string): BookCoverTone {
  const tones: BookCoverTone[] = ["xuan", "celadon", "terracotta", "indigo", "ink", "amber"];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return tones[Math.abs(hash) % tones.length];
}

export default function ZenBookCover({
  title,
  author = "佚名",
  category = "典籍",
  coverUrl,
  tone,
  size = "md",
  className = "",
}: ZenBookCoverProps) {
  const [imgError, setImgError] = useState(false);
  const activeTone = tone || hashStringToTone(title);
  const style = TONE_STYLES[activeTone];

  // 清洗标题，去除《》等符号
  const cleanTitle = title.replace(/[《》]/g, "").trim();

  return (
    <div
      className={`relative select-none shrink-0 rounded-[3px] overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${SIZE_STYLES[size]} ${className}`}
      style={{
        boxShadow:
          "2px 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05), inset -1px 0 2px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* 优先加载外部真实封面；若出错或无图则展示仿真精装程序书封 */}
      {coverUrl && !imgError ? (
        <img
          src={coverUrl}
          alt={title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className={`w-full h-full flex flex-col justify-between p-2.5 sm:p-3 relative border ${style.bg} ${style.border}`}
        >
          {/* 3D 实体书脊厚度立体光影 */}
          <div
            className={`absolute top-0 bottom-0 left-0 w-[14%] bg-gradient-to-r ${style.spineShadow} pointer-events-none z-10`}
          />
          {/* 书脊折痕压线 */}
          <div className="absolute top-0 bottom-0 left-[14%] w-[1px] bg-black/10 pointer-events-none z-10" />

          {/* 内页压痕装饰框 */}
          <div
            className={`absolute inset-1.5 sm:inset-2 border border-dashed ${style.accentLine} opacity-40 rounded-[1px] pointer-events-none`}
          />

          {/* 顶部：分类微标与编号 */}
          <div className="relative z-10 flex items-center justify-between pl-2">
            <span
              className={`text-[9px] sm:text-[10px] tracking-widest font-mono uppercase opacity-75 ${style.textSub}`}
            >
              {category.slice(0, 4)}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
          </div>

          {/* 中部：宋体书名排版 */}
          <div className="relative z-10 my-auto text-center px-1 flex flex-col items-center justify-center">
            <h4
              className={`font-serif font-bold tracking-wider leading-snug line-clamp-3 ${style.textTitle}`}
              style={{
                fontFamily:
                  "'Noto Serif SC', 'Songti SC', 'Source Han Serif SC', 'SimSun', serif",
                textShadow:
                  activeTone === "terracotta" || activeTone === "indigo" || activeTone === "ink"
                    ? "0 1px 2px rgba(0,0,0,0.4)"
                    : "0 1px 1px rgba(255,255,255,0.6)",
              }}
            >
              {cleanTitle}
            </h4>
            <div className={`w-6 h-[1px] my-1 sm:my-1.5 ${style.accentLine} opacity-60`} />
            <p
              className={`text-[9px] sm:text-[10px] font-sans truncate max-w-[90%] opacity-85 ${style.textSub}`}
            >
              {author}
            </p>
          </div>

          {/* 底部：传统朱砂/金石方印 */}
          <div className="relative z-10 flex items-end justify-between pl-2 pt-1">
            <span className={`text-[8px] font-mono tracking-tighter opacity-50 ${style.textSub}`}>
              CI-LIB
            </span>
            {/* 朱砂红印章 */}
            <div
              className={`border border-current px-1 py-0.5 rounded-[1px] leading-none shrink-0 ${style.sealBorder} ${style.sealText}`}
              style={{
                fontFamily: "'Songti SC', serif",
                transform: "rotate(-1deg)",
                boxShadow: "inset 0 0 1px currentColor",
              }}
            >
              <span className="text-[7px] sm:text-[8px] font-bold block scale-90">
                厦图选
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
