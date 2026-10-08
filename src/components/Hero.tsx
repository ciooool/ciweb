"use client";

import React from "react";
import { siteConfig } from "@/data/siteConfig";
import { ArrowRight, BookOpen, Terminal, Sparkles, Code2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-28 md:pb-32 border-b border-[#1F2A4D]/80">
      {/* 极光背景漫射光晕 (Cyber Aurora) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#8B7BFF]/15 via-[#5CF2C4]/10 to-transparent blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start max-w-3xl">
          
          {/* 终端风格前缀标签 */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#1F2A4D] bg-[#0A0E1A]/80 mb-6 backdrop-blur-sm">
            <Terminal className="w-3.5 h-3.5 text-[#5CF2C4]" />
            <span className="text-xs font-mono tracking-wider text-[#5CF2C4]">
              FULL-STACK ARCHITECT & INDIE MAKER
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#5CF2C4] animate-ping" />
          </div>

          {/* 霓虹大标题 */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-mono font-bold text-[#EAF0FF] tracking-tight leading-[1.15] mb-6">
            以代码构建系统，
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5CF2C4] via-[#A7F3D0] to-[#8B7BFF] drop-shadow-[0_0_25px_rgba(92,242,196,0.4)]">
              以阅读重塑心智。
            </span>
          </h1>

          {/* 角色介绍自白 */}
          <p className="text-sm sm:text-base text-[#9FB0D0] font-sans leading-relaxed mb-8 max-w-2xl">
            我是 <strong className="text-[#EAF0FF] font-semibold">{siteConfig.personal.name}</strong>。
            深耕全栈系统工程架构（Next.js / TypeScript / Go），同时搭建这座数字心智书房与造物工坊。
            崇尚极简克制的高效工程，追求无需他人许可的长效复利。
          </p>

          {/* 赛博风格技能徽章列表 (Badge List) */}
          <div className="flex flex-wrap items-center gap-2 mb-10">
            {[
              "React 19 & Next.js",
              "Go 高并发系统",
              "微服务与容器化",
              "AI 工作流整合",
              "认知模型藏书阁",
              "独立全栈造物",
            ].map((badge, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs font-mono rounded-md border border-[#1F2A4D] bg-[#0A0E1A] text-[#9FB0D0] hover:border-[#5CF2C4]/60 hover:text-[#5CF2C4] transition-colors"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* 核心操作按钮组 */}
          <div className="flex flex-wrap items-center gap-4 mb-16">
            <a
              href="#library"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5CF2C4] px-6 py-3 text-xs font-mono font-semibold tracking-wider text-[#05070F] hover:bg-[#7DF9D2] hover:shadow-[0_0_25px_rgba(92,242,196,0.5)] transition-all"
            >
              <BookOpen className="h-4 w-4" />
              <span>步入私享藏书房</span>
            </a>

            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#1F2A4D] bg-[#0A0E1A] px-6 py-3 text-xs font-mono tracking-wider text-[#EAF0FF] hover:border-[#8B7BFF] hover:text-[#8B7BFF] transition-all"
            >
              <Code2 className="h-4 w-4" />
              <span>浏览独立创作</span>
              <ArrowRight className="h-3.5 w-3.5 opacity-70" />
            </a>

            <a
              href="#quotecraft"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-mono tracking-wider text-[#8B7BFF] hover:text-[#5CF2C4] transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>金句工坊</span>
            </a>
          </div>

        </div>

        {/* 类似 Omar Fawzy 的硬核数据统计账本 (Stats Ledger) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border border-[#1F2A4D] bg-[#0A0E1A]/60 backdrop-blur-md">
          <div className="p-3 border-r border-[#1F2A4D]/50 last:border-r-0">
            <h3 className="text-2xl sm:text-3xl font-mono font-bold text-[#5CF2C4] drop-shadow-[0_0_12px_rgba(92,242,196,0.5)] mb-1">
              5+ Years
            </h3>
            <p className="text-xs font-sans text-[#7D88AA]">全栈工程与系统构建</p>
          </div>

          <div className="p-3 border-r border-[#1F2A4D]/50 last:border-r-0">
            <h3 className="text-2xl sm:text-3xl font-mono font-bold text-[#8B7BFF] drop-shadow-[0_0_12px_rgba(139,123,255,0.5)] mb-1">
              25+ 部
            </h3>
            <p className="text-xs font-sans text-[#7D88AA]">精选殿堂级心智模型神作</p>
          </div>

          <div className="p-3 border-r border-[#1F2A4D]/50 last:border-r-0">
            <h3 className="text-2xl sm:text-3xl font-mono font-bold text-[#5CF2C4] drop-shadow-[0_0_12px_rgba(92,242,196,0.5)] mb-1">
              99.9%
            </h3>
            <p className="text-xs font-sans text-[#7D88AA]">架构韧性与高并发稳定性</p>
          </div>

          <div className="p-3">
            <h3 className="text-2xl sm:text-3xl font-mono font-bold text-[#EAF0FF] mb-1">
              100%
            </h3>
            <p className="text-xs font-sans text-[#7D88AA]">自驱设计与独立全栈造物</p>
          </div>
        </div>

      </div>
    </section>
  );
}
