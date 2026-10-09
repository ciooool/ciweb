"use client";

import React from "react";
import { portfolioData } from "@/data/portfolioData";
import { ArrowRight, BookOpen, Terminal, Sparkles, Code2 } from "lucide-react";
import AvatarBadge from "./AvatarBadge";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 sm:pt-28 md:pt-32 pb-20 md:pb-28 border-b border-theme-line">
      {/* 极光背景漫射光斑 */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[640px] h-[340px] rounded-full blur-[130px] pointer-events-none opacity-45"
        style={{
          background: "radial-gradient(circle, var(--phosphor) 0%, var(--violet) 50%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center mb-14">
          
          {/* 左侧：价值宣言与操作引导 (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* 1. 终端状态指示标签 */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-theme-line bg-theme-surface/80 mb-6 backdrop-blur-sm shadow-xs">
              <Terminal className="w-3.5 h-3.5 text-theme-phosphor" />
              <span className="text-xs font-mono tracking-wider text-theme-phosphor">
                SYSTEM ARCHITECT · INDIE MAKER
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-theme-phosphor animate-ping" />
            </div>

            {/* 2. 霓虹核心主标题 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-extrabold text-theme-primary tracking-tight leading-[1.12] mb-6">
              以代码构建系统，
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 drop-shadow-[0_0_35px_var(--phosphor-dim)]">
                以阅读重塑心智。
              </span>
            </h1>

            {/* 3. 主理人自白宣言 */}
            <p className="text-sm sm:text-base text-theme-secondary font-sans leading-relaxed mb-8 max-w-2xl">
              我是 <strong className="text-theme-primary font-semibold">{portfolioData.personal.name}</strong>。
              {portfolioData.personal.bio}
            </p>

            {/* 4. 关键技术标签胶囊 */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {portfolioData.skills.map((skill) => (
                <span
                  key={skill.name}
                  className="px-3 py-1 text-xs font-mono rounded-lg border border-theme-line bg-theme-surface text-theme-secondary hover:border-theme-phosphor hover:text-theme-phosphor transition-colors shadow-xs"
                >
                  {skill.name}
                </span>
              ))}
            </div>

            {/* 5. 核心操作引导按钮组 */}
            <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
              <a
                href="#projects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-theme-phosphor px-6 py-3 text-xs font-mono font-bold tracking-wider text-[#070a13] hover:opacity-90 hover:shadow-[0_0_25px_var(--phosphor)] transition-all shadow-md cursor-pointer"
              >
                <Code2 className="h-4 w-4" />
                <span>探索独立作品</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-80" />
              </a>

              <a
                href="#books"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-theme-line bg-theme-surface px-6 py-3 text-xs font-mono tracking-wider text-theme-primary hover:border-theme-violet hover:text-theme-violet transition-all shadow-xs cursor-pointer"
              >
                <BookOpen className="h-4 w-4" />
                <span>私享心智书房</span>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-mono tracking-wider text-theme-violet hover:text-theme-phosphor transition-colors cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>即刻交流造物</span>
              </a>
            </div>

          </div>

          {/* 右侧：AvatarBadge 专属徽标卡片 (5 cols) */}
          <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
            <AvatarBadge />
          </div>

        </div>

        {/* 6. 硬核工程数据统计账本 (Stats Ledger) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-2xl border border-theme-line bg-theme-surface/70 backdrop-blur-md shadow-card">
          {portfolioData.ledgerStats.map((item, idx) => (
            <div
              key={idx}
              className="p-3 border-r border-theme-line/60 last:border-r-0"
            >
              <h3 className="text-2xl sm:text-3xl font-mono font-bold text-theme-phosphor mb-1">
                {item.number}
              </h3>
              <p className="text-xs font-sans text-theme-muted">{item.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
