'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { portfolioData } from '@/data/portfolioData';
import { soundManager } from '@/utils/audio';
import { copyToClipboard } from '@/utils/clipboard';
import { Check, Sparkles, MapPin, Mail, MessageSquare } from 'lucide-react';
import TiltCard from './TiltCard';

export const AvatarBadge: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (text: string, key: string) => {
    soundManager.playClick();
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <TiltCard
      maxTilt={6}
      scale={1.02}
      glare={true}
      className="relative group/card w-full max-w-[340px] sm:max-w-[380px] mx-auto lg:ml-auto"
    >
      {/* 1. 背景赛博极光全息光晕 */}
      <div
        className="absolute -inset-1.5 rounded-3xl blur-2xl opacity-40 group-hover/card:opacity-70 transition duration-700 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, var(--phosphor) 0%, var(--violet) 50%, transparent 80%)',
        }}
      />

      {/* 2. 核心工坊磨砂卡片主体 */}
      <div className="relative rounded-3xl border border-[var(--border-line)] bg-[var(--bg-surface)] p-6 sm:p-7 shadow-2xl backdrop-blur-xl transition-colors duration-300 hover:border-[var(--phosphor)]">
        
        {/* 卡片顶栏：系统在线状态 */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[var(--border-line)]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono font-bold tracking-wider text-[var(--text-primary)]">
              ONLINE
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)] border-l border-[var(--border-line)] pl-2">
              SYSTEM ARCHITECT
            </span>
          </div>

          <div className="px-2 py-0.5 rounded-full text-[10px] font-mono text-[var(--phosphor)] bg-[var(--phosphor-dim)] border border-[var(--phosphor-dim)]">
            ATELIER
          </div>
        </div>

        {/* 头像展示核心视区 (唯一专属肖像) */}
        <div className="relative flex flex-col items-center text-center">
          <div className="relative p-1.5 rounded-full">
            {/* 头像呼吸双层光环 */}
            <div
              className="absolute inset-0 rounded-full blur-md opacity-60 group-hover/card:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  'conic-gradient(from 180deg at 50% 50%, var(--phosphor) 0deg, var(--violet) 180deg, var(--phosphor) 360deg)',
              }}
            />

            {/* 头像实体圆形容器 */}
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-[var(--phosphor)] bg-[#070a13] shadow-inner">
              <Image
                src="/avatar_portrait.jpg"
                alt={portfolioData.personal.name}
                fill
                sizes="(max-width: 768px) 144px, 160px"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover/card:scale-105"
                priority
              />

              {/* 质感微渐变遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* 右下角极客徽标角标 */}
            <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-[var(--bg-surface)] border border-[var(--phosphor)] flex items-center justify-center text-[var(--phosphor)] shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 姓名与身份标识 */}
          <div className="mt-4">
            <h3 className="text-xl font-bold font-sans tracking-tight text-[var(--text-primary)] flex items-center justify-center gap-2">
              <span>{portfolioData.personal.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--phosphor-dim)] text-[var(--phosphor)] border border-[var(--phosphor-dim)] font-semibold">
                PRO
              </span>
            </h3>
            <p className="text-xs font-mono text-[var(--text-secondary)] mt-1">
              全栈系统架构师 & 软件工程师
            </p>
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-[var(--text-muted)] mt-1.5">
              <MapPin className="w-3 h-3 text-[var(--phosphor)]" />
              <span>{portfolioData.personal.location}</span>
            </div>
          </div>

          {/* 极简快捷通讯栏 (微信与邮箱一键复制) */}
          <div className="w-full mt-5 pt-4 border-t border-[var(--border-line)] flex items-center justify-center gap-2">
            {/* 微信号一键复制 */}
            <button
              onClick={() => handleCopy(portfolioData.personal.wechat, 'wechat')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-mono bg-[var(--bg-card)] border border-[var(--border-line)] hover:border-[var(--phosphor)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer shadow-xs group/btn"
              title="点击复制微信号"
            >
              {copiedKey === 'wechat' ? (
                <>
                  <Check className="w-3 h-3 text-[var(--phosphor)]" />
                  <span className="text-[var(--phosphor)] font-bold">已复制微信</span>
                </>
              ) : (
                <>
                  <MessageSquare className="w-3 h-3 text-[var(--phosphor)] group-hover/btn:scale-110 transition-transform" />
                  <span>微信: {portfolioData.personal.wechat}</span>
                </>
              )}
            </button>

            {/* 邮箱直达 */}
            <a
              href={`mailto:${portfolioData.personal.email}`}
              title={`发信至 ${portfolioData.personal.email}`}
              className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] hover:border-[var(--phosphor)] text-[var(--text-secondary)] hover:text-[var(--phosphor)] transition-all cursor-pointer shadow-xs"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </TiltCard>
  );
};

export default AvatarBadge;
