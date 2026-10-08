"use client";

import React, { useState } from "react";
import { siteConfig } from "@/data/siteConfig";
import { Mail, MapPin, Copy, Check, MessageCircle } from "lucide-react";
import { GithubIcon, TwitterIcon } from "@/components/Icons";

export default function AboutAndContact() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(siteConfig.personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section id="contact" className="py-20 md:py-28 transition-colors">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: About & Craft Philosophy (7 cols) */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 text-xs font-serif tracking-widest text-[#9E7B5B] uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9E7B5B]" />
              <span>致友 · 见字如面</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#1F1E1D] dark:text-[#EDE9E3] tracking-tight mb-4">
              关于工坊与创造者
            </h2>
            <p className="text-sm sm:text-base text-[#6B6760] dark:text-[#A8A49C] font-serif leading-relaxed mb-6">
              {siteConfig.personal.bio}
            </p>

            <div className="flex items-center gap-2 text-xs font-serif text-[#948F86] mb-8">
              <MapPin className="h-3.5 w-3.5 opacity-60" />
              <span>{siteConfig.personal.location} · 驻足之地</span>
            </div>

            {/* Craft Toolkit */}
            <div className="space-y-3">
              <h3 className="text-xs font-serif tracking-widest uppercase text-[#948F86]">
                主力工程手艺 (Craft Toolkit)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {siteConfig.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-3.5 rounded-xl border border-[#EAE6DF] dark:border-[#2C2A28] bg-white dark:bg-[#1E1E20] shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs sm:text-sm font-serif font-medium text-[#1F1E1D] dark:text-[#EDE9E3]">
                        {skill.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#EAE6DF] dark:border-[#38342E] text-[#7A746C] dark:text-[#A8A49C]">
                        {skill.level}
                      </span>
                    </div>
                    <p className="text-xs font-serif text-[#7A746C] dark:text-[#9E9A90]">
                      {skill.highlight}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Letter Box / Connections (5 cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-[#EAE6DF] dark:border-[#2C2A28] bg-[#FAF8F5] dark:bg-[#1E1E20] p-6 sm:p-8">
              <h3 className="text-xl font-serif font-medium text-[#1F1E1D] dark:text-[#EDE9E3] mb-2">
                致友来信 / 思想共鸣
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6760] dark:text-[#A8A49C] font-serif leading-relaxed mb-6">
                在数字荒原中，寻找志趣相投的创作者与深度阅读者。若你有共鸣的心智模型、有趣的原型构想，或单纯想写一封信交流，皆感念相逢。
              </p>

              {/* Email Box */}
              <div className="mb-4">
                <span className="text-xs font-serif text-[#948F86] block mb-1.5">
                  书信联络信箱
                </span>
                <div className="flex items-center justify-between p-3 rounded-lg border border-[#EAE6DF] dark:border-[#38342E] bg-white dark:bg-[#181716]">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="h-3.5 w-3.5 text-[#948F86] shrink-0" />
                    <span className="text-xs font-mono text-[#1F1E1D] dark:text-[#EDE9E3] truncate select-all">
                      {siteConfig.personal.email}
                    </span>
                  </div>
                  <button
                    onClick={copyEmail}
                    className="p-1.5 rounded-md text-[#948F86] hover:text-[#1F1E1D] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
                    title="复制邮箱地址"
                  >
                    {copiedEmail ? (
                      <Check className="h-3.5 w-3.5 text-[#9E7B5B]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* WeChat Box */}
              <div className="mb-6">
                <span className="text-xs font-serif text-[#948F86] block mb-1.5">
                  微信即时交流
                </span>
                <div className="flex items-center gap-2.5 p-3 rounded-lg border border-[#EAE6DF] dark:border-[#38342E] bg-white dark:bg-[#181716] text-[#6B6760] dark:text-[#A8A49C] text-xs font-serif">
                  <MessageCircle className="h-3.5 w-3.5 text-[#9E7B5B] shrink-0" />
                  <span>{siteConfig.personal.wechatQrNote}</span>
                </div>
              </div>

              {/* Social links */}
              <div>
                <span className="text-xs font-serif text-[#948F86] block mb-2">
                  更多开放网络
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href={siteConfig.personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 p-2.5 rounded-lg border border-[#EAE6DF] dark:border-[#38342E] bg-white dark:bg-[#181716] text-xs font-serif text-[#6B6760] dark:text-[#A8A49C] hover:text-[#1F1E1D] dark:hover:text-white transition-colors"
                  >
                    <GithubIcon className="h-3.5 w-3.5 opacity-70" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href={siteConfig.personal.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 p-2.5 rounded-lg border border-[#EAE6DF] dark:border-[#38342E] bg-white dark:bg-[#181716] text-xs font-serif text-[#6B6760] dark:text-[#A8A49C] hover:text-[#1F1E1D] dark:hover:text-white transition-colors"
                  >
                    <TwitterIcon className="h-3.5 w-3.5 opacity-70" />
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
