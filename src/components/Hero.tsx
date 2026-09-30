import React from "react";
import { siteConfig } from "@/data/siteConfig";
import { ArrowRight, BookOpen, Sparkles, Compass, Feather, Cpu } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#E8E3DA] dark:border-[#33302B] transition-colors">
      {/* 极简暖色环境微晕 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-[#C27D53]/5 via-[#5F7A6A]/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start max-w-3xl">
          
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-serif bg-[#F5F2EC] text-[#6E6B65] dark:bg-[#201F1D] dark:text-[#A8A49C] border border-[#E8E3DA] dark:border-[#33302B] mb-8 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5F7A6A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5F7A6A]"></span>
            </span>
            <span>{siteConfig.personal.availabilityStatus}</span>
          </div>

          {/* Main Title (杂志级雅致宋体) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-book-serif font-normal text-[#2C2A29] dark:text-[#EDE9E3] leading-[1.22] tracking-tight mb-6">
            以代码构建产品，
            <br />
            以阅读
            <span className="text-[#C27D53] dark:text-[#D89469] font-serif italic">
              {" "}重塑认知{" "}
            </span>
            与心智。
          </h1>

          {/* Subtitle / Bio */}
          <p className="text-base sm:text-lg text-[#59554E] dark:text-[#B8B4AB] font-serif leading-relaxed mb-10 max-w-2xl">
            我是 <strong className="font-semibold text-[#2C2A29] dark:text-[#EDE9E3]">{siteConfig.personal.name}</strong>
            。白天借由现代全栈工程（Next.js / TypeScript / Go）打磨解决真实痛点的小微产品与实用工具；
            夜晚在纯净无广的数字书阁中沉思研读。追求技术之用，亦珍视精神之美。
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-14">
            <a
              href="#library"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2C2A29] px-6 py-3.5 text-xs font-serif font-semibold text-[#FAF8F5] shadow-xs hover:opacity-90 dark:bg-[#EDE9E3] dark:text-[#181716] transition-all hover:scale-[1.02]"
            >
              <BookOpen className="h-4 w-4 text-[#C27D53]" />
              <span>步入数字书房 (免费在读)</span>
            </a>

            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D5CEBF] bg-white px-6 py-3.5 text-xs font-serif font-medium text-[#2C2A29] shadow-2xs hover:bg-stone-50 dark:border-[#33302B] dark:bg-[#201F1D] dark:text-[#EDE9E3] transition-all"
            >
              <span>浏览独立产品</span>
              <ArrowRight className="h-3.5 w-3.5 opacity-60" />
            </a>

            <a
              href="#interactive-tool"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 text-xs font-serif text-[#8C8881] hover:text-[#2C2A29] dark:hover:text-[#EDE9E3] transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#C27D53]" />
              <span>在线微工具</span>
            </a>
          </div>

          {/* Key Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full pt-8 border-t border-[#E8E3DA] dark:border-[#33302B]">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#F0EBE1] text-[#8C5D39] dark:bg-[#2A2621] dark:text-[#D89469] shrink-0">
                <Feather className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-serif font-bold text-[#2C2A29] dark:text-[#EDE9E3]">轻奢文艺 · 纯净无广</h4>
                <p className="text-[11px] text-[#8C8881] mt-1 font-serif">如翻开纸质书般的沉浸呼吸感</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#EAF0EB] text-[#42614B] dark:bg-[#1E2820] dark:text-[#789984] shrink-0">
                <Compass className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-serif font-bold text-[#2C2A29] dark:text-[#EDE9E3]">52周无感全自动荐书</h4>
                <p className="text-[11px] text-[#8C8881] mt-1 font-serif">自然年历算法驱动，周周换新无需维护</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#EEF1F5] text-[#4A5D75] dark:bg-[#202730] dark:text-[#8CA4C2] shrink-0">
                <Cpu className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-serif font-bold text-[#2C2A29] dark:text-[#EDE9E3]">云端读者证跨端漫游</h4>
                <p className="text-[11px] text-[#8C8881] mt-1 font-serif">手机与电脑输入相同证号，进度实时对齐</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
