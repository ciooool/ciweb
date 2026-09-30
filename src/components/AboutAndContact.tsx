"use client";

import React, { useState } from "react";
import { siteConfig } from "@/data/siteConfig";
import { Mail, MapPin, Copy, Check, MessageCircle, Code } from "lucide-react";
import { GithubIcon, TwitterIcon } from "@/components/Icons";

export default function AboutAndContact() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(siteConfig.personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: About & Skills (7 cols) */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
              <Code className="h-3.5 w-3.5" />
              <span>About & Capabilities</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl mb-4">
              关于我与技术雷达
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
              {siteConfig.personal.bio}
            </p>

            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-8">
              <MapPin className="h-4 w-4 text-zinc-400" />
              <span>{siteConfig.personal.location}</span>
            </div>

            {/* Skills Radar / Cards */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                主力工程技术栈 (Core Stacks)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {siteConfig.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                        {skill.name}
                      </span>
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {skill.level}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {skill.highlight}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Cards (5 cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/70 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                建立连接 / 联系合作
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                无论你是想找我探讨独立产品孵化、承接敏捷 MVP 研发、解决高并发系统疑难，还是单纯的技术同行交流，都非常欢迎随时联络。
              </p>

              {/* Email Box */}
              <div className="mb-4">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1.5">
                  官方邮箱通道
                </span>
                <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="h-4 w-4 text-zinc-400 shrink-0" />
                    <span className="text-xs font-mono text-zinc-800 dark:text-zinc-200 truncate select-all">
                      {siteConfig.personal.email}
                    </span>
                  </div>
                  <button
                    onClick={copyEmail}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shrink-0"
                    title="复制邮箱地址"
                  >
                    {copiedEmail ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* WeChat Box */}
              <div className="mb-6">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1.5">
                  即时沟通微信
                </span>
                <div className="flex items-center gap-2.5 p-3 rounded-xl border border-emerald-200/80 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 text-xs">
                  <MessageCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{siteConfig.personal.wechatQrNote}</span>
                </div>
              </div>

              {/* Social links */}
              <div>
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-2">
                  更多社交网络
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href={siteConfig.personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
                  >
                    <GithubIcon className="h-4 w-4" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href={siteConfig.personal.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
                  >
                    <TwitterIcon className="h-4 w-4" />
                    <span>Twitter / X</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
