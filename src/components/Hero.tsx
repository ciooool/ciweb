import React from "react";
import { siteConfig } from "@/data/siteConfig";
import { ArrowRight, Sparkles, Layers, Cpu, Code2, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-zinc-200/60 dark:border-zinc-800/60">
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-500/5 via-emerald-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start max-w-3xl">
          {/* Availability Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 mb-6 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{siteConfig.personal.availabilityStatus}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15] mb-6">
            以产品思维打磨独立项目，
            <br />
            用
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
              {" "}现代全栈工程{" "}
            </span>
            构建数字资产
          </h1>

          {/* Subtitle / Bio */}
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed mb-8 max-w-2xl">
            我是 <strong className="font-semibold text-zinc-900 dark:text-white">{siteConfig.personal.name}</strong>
            ，一名专注于产品落地的全栈工程师与独立开发者。
            借助 AI 原生工作流与 Next.js / Go 技术栈，致力于从 0 到 1 打造极简、高可用的微型 SaaS、开发工具与自动化解决方案。
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-all hover:scale-[1.02]"
            >
              <span>浏览我的独立产品</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="#interactive-tool"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-all"
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>现场试用微工具</span>
            </a>

            <a
              href="#services"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              <span>了解合作与咨询</span>
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>

          {/* Key Advantages / Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-8 border-t border-zinc-200/70 dark:border-zinc-800/70">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 shrink-0">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">全流程端到端交付</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">从产品交互原型、前后端开发到云端秒级部署</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 shrink-0">
                <Cpu className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">高可靠性能架构</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Go 高并发核心与 Next.js 极致前端体验兼备</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 shrink-0">
                <Code2 className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">AI 原生增效实践</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">一人即团队，单人完成数倍于传统周期的产出</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
