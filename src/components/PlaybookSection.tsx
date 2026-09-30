import React from "react";
import { siteConfig, PlaybookPost } from "@/data/siteConfig";
import { BookOpen, Calendar, Clock, ArrowUpRight, Tag } from "lucide-react";

export default function PlaybookSection() {
  return (
    <section id="playbook" className="py-16 md:py-24 border-b border-zinc-200/60 dark:border-zinc-800/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Thought Leadership</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              实战复盘与技术洞见
            </h2>
            <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
              记录踩坑沉淀、架构选型权衡与独立出海思考。有信息增量的真知灼见，胜过千篇泛泛而谈的八股文。
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-xs font-mono text-zinc-400">
            持续更新 · 原创沉淀
          </div>
        </div>

        {/* Posts List */}
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {siteConfig.playbookPosts.map((post: PlaybookPost) => (
            <article
              key={post.id}
              className="py-8 group flex flex-col md:flex-row md:items-start justify-between gap-6 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 -mx-4 px-4 rounded-xl transition-all"
            >
              <div className="max-w-3xl">
                {/* Meta info */}
                <div className="flex items-center gap-3 text-xs text-zinc-400 mb-2.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{post.date}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{post.readTime}</span>
                  </span>
                </div>

                {/* Post Title */}
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 leading-snug">
                  {post.title}
                </h3>

                {/* Summary */}
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  {post.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    >
                      <Tag className="h-2.5 w-2.5" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Read Action */}
              <div className="shrink-0 flex items-center md:pt-4">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all">
                  <span>阅读全文</span>
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
