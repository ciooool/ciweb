'use client';

import React from 'react';
import { ArrowUp, Terminal, Heart } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-[var(--border-line)] bg-[var(--bg-base)] text-[var(--text-muted)] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* 左侧：品牌与座右铭 */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <span className="font-bold text-[var(--text-primary)] tracking-wider">
            {PERSONAL_INFO.name}
          </span>
          <span className="text-[var(--phosphor)]">/</span>
          <span className="text-[var(--text-secondary)]">{PERSONAL_INFO.role}</span>
          <span className="hidden sm:inline text-[var(--border-line)]">|</span>
          <span className="hidden sm:inline text-[var(--text-muted)]">
            以确定性代码抵抗系统熵增
          </span>
        </div>

        {/* 中间：技术栈标签 */}
        <div className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1.5">
          <span>Next.js 15</span>
          <span>•</span>
          <span>TypeScript</span>
          <span>•</span>
          <span>Tailwind</span>
          <span>•</span>
          <span>Go Philosophy</span>
        </div>

        {/* 右侧：版权与返回顶部 */}
        <div className="flex items-center gap-5">
          <span className="text-xs font-mono text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved.
          </span>
          <button
            onClick={scrollToTop}
            aria-label="返回顶部"
            className="w-8 h-8 rounded-lg bg-[var(--bg-card)] border border-[var(--border-line)] hover:border-[var(--phosphor)] text-[var(--text-secondary)] hover:text-[var(--phosphor)] flex items-center justify-center transition-all group cursor-pointer"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
