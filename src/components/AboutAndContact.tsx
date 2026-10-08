"use client";

import React, { useState } from "react";
import { siteConfig } from "@/data/siteConfig";
import { Mail, MapPin, Copy, Check, MessageCircle } from "lucide-react";
import { GithubIcon, TwitterIcon } from "@/components/Icons";

export default function AboutAndContact() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedWechat, setCopiedWechat] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(siteConfig.personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const copyWechat = () => {
    navigator.clipboard.writeText("ciooool_dev");
    setCopiedWechat(true);
    setTimeout(() => setCopiedWechat(false), 2000);
  };

  return (
    <section id="contact" className="py-20 md:py-28 relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: About & Craft Philosophy (7 cols) */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#5CF2C4] uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CF2C4] shadow-[0_0_8px_#5CF2C4]" />
              <span>DISPATCH & COGNITION · 见字如面</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-[#EAF0FF] tracking-tight mb-4">
              关于工坊与主理人
            </h2>
            <p className="text-sm sm:text-base text-[#9FB0D0] font-sans leading-relaxed mb-6">
              {siteConfig.personal.bio}
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-[#7D88AA] mb-8">
              <MapPin className="h-3.5 w-3.5 text-[#5CF2C4]" />
              <span>{siteConfig.personal.location} · 驻足之地</span>
            </div>

            {/* Craft Toolkit */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono tracking-widest uppercase text-[#7D88AA]">
                主力工程技术栈 (Craft Toolkit)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                {siteConfig.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-4 rounded-xl border border-[#1F2A4D] bg-[#0A0E1A]/80 backdrop-blur-md hover:border-[#5CF2C4]/40 transition-colors shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-sans font-bold text-[#EAF0FF]">
                        {skill.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#1F2A4D] bg-[#05070F] text-[#5CF2C4]">
                        {skill.level}
                      </span>
                    </div>
                    <p className="text-xs text-[#9FB0D0] leading-relaxed">
                      {skill.highlight}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Letter Box / Connections (5 cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[#1F2A4D] bg-[#0A0E1A]/80 p-6 sm:p-8 backdrop-blur-md shadow-lg">
              <h3 className="text-xl font-mono font-bold text-[#EAF0FF] mb-2">
                致友来信 / 思想共鸣
              </h3>
              <p className="text-xs sm:text-sm text-[#9FB0D0] font-sans leading-relaxed mb-6">
                在数字荒原中，寻找志趣相投的独立创作者与深度阅读者。若你有共鸣的心智模型、有趣的原型构想，或想探讨全栈系统工程，皆感念相逢。
              </p>

              {/* Email Box */}
              <div className="mb-4">
                <span className="text-xs font-mono text-[#7D88AA] block mb-1.5">
                  书信联络信箱
                </span>
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#1F2A4D] bg-[#05070F]">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="h-4 w-4 text-[#5CF2C4] shrink-0" />
                    <span className="text-xs font-mono text-[#EAF0FF] truncate select-all">
                      {siteConfig.personal.email}
                    </span>
                  </div>
                  <button
                    onClick={copyEmail}
                    className="p-1.5 rounded-lg text-[#9FB0D0] hover:text-[#5CF2C4] hover:bg-[#1F2A4D]/40 transition-colors shrink-0"
                    title="复制邮箱地址"
                  >
                    {copiedEmail ? (
                      <Check className="h-4 w-4 text-[#5CF2C4]" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* WeChat Box */}
              <div className="mb-6">
                <span className="text-xs font-mono text-[#7D88AA] block mb-1.5">
                  微信即时交流
                </span>
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#1F2A4D] bg-[#05070F] text-[#9FB0D0] text-xs font-mono">
                  <div className="flex items-center gap-2.5 truncate">
                    <MessageCircle className="h-4 w-4 text-[#8B7BFF] shrink-0" />
                    <span className="truncate">{siteConfig.personal.wechatQrNote}</span>
                  </div>
                  <button
                    onClick={copyWechat}
                    className="p-1.5 rounded-lg text-[#9FB0D0] hover:text-[#5CF2C4] hover:bg-[#1F2A4D]/40 transition-colors shrink-0"
                    title="复制微信号"
                  >
                    {copiedWechat ? (
                      <Check className="h-4 w-4 text-[#5CF2C4]" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Social links */}
              <div>
                <span className="text-xs font-mono text-[#7D88AA] block mb-2">
                  更多开放网络
                </span>
                <div className="flex items-center gap-3 font-mono">
                  <a
                    href={siteConfig.personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[#1F2A4D] bg-[#05070F] text-xs text-[#9FB0D0] hover:text-[#5CF2C4] hover:border-[#5CF2C4]/40 transition-all"
                  >
                    <GithubIcon className="h-3.5 w-3.5 opacity-80" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href={siteConfig.personal.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[#1F2A4D] bg-[#05070F] text-xs text-[#9FB0D0] hover:text-[#8B7BFF] hover:border-[#8B7BFF]/40 transition-all"
                  >
                    <TwitterIcon className="h-3.5 w-3.5 opacity-80" />
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
