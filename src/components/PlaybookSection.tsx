import React from "react";
import { siteConfig, PlaybookPost } from "@/data/siteConfig";
import { ArrowUpRight } from "lucide-react";

export default function PlaybookSection() {
  return (
    <section id="playbook" className="py-20 md:py-28 border-b border-[#EAE6DF] dark:border-[#2C2A28] transition-colors">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-serif tracking-widest text-[#9E7B5B] uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9E7B5B]" />
              <span>手记专栏 · 沉思录</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#1F1E1D] dark:text-[#EDE9E3] tracking-tight">
              实战复盘与认知手记
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#6B6760] dark:text-[#A8A49C] max-w-2xl font-serif leading-relaxed">
              记录踩坑沉淀、架构选型权衡与独立出海思考。有信息增量的真知灼见，胜过千篇泛泛而谈的浮躁资讯。
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-xs font-mono tracking-wider text-[#948F86]">
            ESSAYS & MONOGRAPHS
          </div>
        </div>

        {/* Posts List */}
        <div className="divide-y divide-[#EAE6DF] dark:divide-[#2C2A28]">
          {siteConfig.playbookPosts.map((post: PlaybookPost) => (
            <article
              key={post.id}
              className="py-8 group flex flex-col md:flex-row md:items-start justify-between gap-6 hover:bg-black/[0.015] dark:hover:bg-white/[0.015] -mx-4 px-4 rounded-xl transition-all"
            >
              <div className="max-w-3xl">
                {/* Meta info */}
                <div className="flex items-center gap-3 text-xs font-serif text-[#948F86] mb-2.5">
                  <span className="font-mono">{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>

                {/* Post Title */}
                <h3 className="text-xl font-serif font-medium text-[#1F1E1D] dark:text-[#EDE9E3] group-hover:text-[#9E7B5B] transition-colors mb-2 leading-snug">
                  {post.title}
                </h3>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-[#6B6760] dark:text-[#A8A49C] font-serif leading-relaxed mb-4">
                  {post.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#EAE6DF] dark:border-[#38342E] text-[#7A746C] dark:text-[#A8A49C] bg-[#FAF8F5] dark:bg-[#1E1E20]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Read Action */}
              <div className="shrink-0 flex items-center md:pt-4">
                <span className="inline-flex items-center gap-1 text-xs font-serif text-[#1F1E1D] dark:text-[#EDE9E3] group-hover:text-[#9E7B5B] group-hover:translate-x-0.5 transition-all">
                  <span>阅读全文</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
