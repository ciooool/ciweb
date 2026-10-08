import React from "react";
import { siteConfig } from "@/data/siteConfig";
import { ArrowRight, BookOpen } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36 border-b border-[#EAE6DF] dark:border-[#2C2A28] transition-colors">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start max-w-3xl">
          
          {/* 上标雅致箴言 */}
          <div className="inline-flex items-center gap-2 mb-8">
            <span className="text-xs font-serif tracking-[0.25em] text-[#9E7B5B] uppercase">
              思考型工匠的数字工坊 · 2026
            </span>
            <span className="w-6 h-[1px] bg-[#D5CEBF] dark:bg-[#38342E]" />
          </div>

          {/* 核心主标题 (大字号、精湛宋体排版、呼吸感留白) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#1F1E1D] dark:text-[#EDE9E3] leading-[1.3] tracking-tight mb-8">
            以代码构建系统，
            <br />
            以阅读重塑心智。
          </h1>

          {/* 创作者自白 (克制优雅的文人独白) */}
          <p className="text-base sm:text-lg text-[#6B6760] dark:text-[#A8A49C] font-serif leading-[1.9] mb-12 max-w-2xl">
            我是 <span className="text-[#1F1E1D] dark:text-[#EDE9E3] font-medium">{siteConfig.personal.name}</span>。
            在此探索全栈系统工程（Next.js / TypeScript / Go）的精细手艺，
            亦在沉静无声的书斋中沉淀认知模型。
            崇尚极简克制之美，追求无需他人许可的长效创造。
          </p>

          {/* 动作组 (纯墨色高奢按钮与极简发丝线边框) */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#library"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1F1E1D] px-7 py-3 text-xs font-serif tracking-widest text-[#FAF8F5] hover:bg-[#33312E] dark:bg-[#EDE9E3] dark:text-[#181716] dark:hover:bg-white transition-all shadow-xs"
            >
              <BookOpen className="h-3.5 w-3.5 opacity-80" />
              <span>步入私享书房</span>
            </a>

            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D5CEBF] dark:border-[#38342E] bg-transparent px-7 py-3 text-xs font-serif tracking-widest text-[#1F1E1D] dark:text-[#EDE9E3] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              <span>浏览独立创作</span>
              <ArrowRight className="h-3 w-3 opacity-60" />
            </a>

            <a
              href="#quotecraft"
              className="inline-flex items-center justify-center px-4 py-3 text-xs font-serif tracking-widest text-[#8C8881] hover:text-[#1F1E1D] dark:hover:text-[#EDE9E3] transition-colors"
            >
              <span>金句工坊</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
