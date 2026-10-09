'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, Copy, Check, Send, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import { GithubIcon } from '@/components/Icons';
import { PERSONAL_INFO } from '../data/portfolioData';
import { copyToClipboard } from '@/utils/clipboard';

export const ContactSection: React.FC = () => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleCopy = async (text: string, type: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent(
      subject || '技术交流与合作'
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* 标题 */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-[var(--phosphor)] bg-[var(--phosphor-subtle)] border border-[var(--phosphor-muted)] mb-3">
          <MessageSquare className="w-3.5 h-3.5" />
          04 // Transmission Channel
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          见字如面，开启联络
        </h2>
        <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
          探讨后端架构、自动化工坊或独立造物，随时欢迎信号连通。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* 左侧：即时渠道卡片组 */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* 邮箱直连卡片 */}
          <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-line)] hover:border-[var(--phosphor)] transition-all group">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-[var(--phosphor-subtle)] border border-[var(--phosphor-muted)] flex items-center justify-center text-[var(--phosphor)]">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-line)]">
                PRIMARY
              </span>
            </div>
            <div className="mt-4">
              <div className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">电子信箱</div>
              <div className="text-base font-mono font-medium text-[var(--text-primary)] mt-1 select-all">
                {PERSONAL_INFO.email}
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-[var(--border-line)] flex items-center gap-3">
              <button
                onClick={() => handleCopy(PERSONAL_INFO.email, 'email')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-[var(--bg-card)] border border-[var(--border-line)] hover:border-[var(--phosphor)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
              >
                {copiedType === 'email' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[var(--phosphor)]" />
                    已复制邮箱
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    复制地址
                  </>
                )}
              </button>
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-[var(--phosphor)] hover:underline cursor-pointer"
              >
                唤起邮件客户端
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 微信卡片 */}
          <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-line)] hover:border-[var(--phosphor)] transition-all">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-[var(--phosphor-subtle)] border border-[var(--phosphor-muted)] flex items-center justify-center text-[var(--phosphor)]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-line)]">
                IM CHANNEL
              </span>
            </div>
            <div className="mt-4">
              <div className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">微信 WeChat</div>
              <div className="text-base font-mono font-medium text-[var(--text-primary)] mt-1 select-all">
                {PERSONAL_INFO.wechat}
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-[var(--border-line)] flex items-center gap-3">
              <button
                onClick={() => handleCopy(PERSONAL_INFO.wechat, 'wechat')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-[var(--bg-card)] border border-[var(--border-line)] hover:border-[var(--phosphor)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
              >
                {copiedType === 'wechat' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[var(--phosphor)]" />
                    已复制微信号
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    复制微信号
                  </>
                )}
              </button>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">添加时请注明来意</span>
            </div>
          </div>

          {/* GitHub 卡片 */}
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-line)] hover:border-[var(--phosphor)] transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] flex items-center justify-center text-[var(--text-primary)] group-hover:text-[var(--phosphor)] transition-colors">
                <GithubIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono text-[var(--text-muted)]">OPEN SOURCE</div>
                <div className="text-sm font-bold text-[var(--text-primary)]">github.com/ciooool</div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--phosphor)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </a>
        </div>

        {/* 右侧：快速信笺终端 (Direct Mail Dispatcher) */}
        <div className="lg:col-span-7">
          <div className="h-full p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-line)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-line)] mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                    Direct Dispatcher Terminal
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">STATUS: READY</span>
              </div>

              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1.5 uppercase">
                    主题 / 议题 (Subject)
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="例如：关于分布式缓存方案探讨 / 合作邀请"
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--phosphor)] transition-colors placeholder:text-[var(--text-muted)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1.5 uppercase">
                    信件正文 (Transmission Content)
                  </label>
                  <textarea
                    rows={6}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="在此阐述您的构想、需求或探讨主题..."
                    className="w-full p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--phosphor)] transition-colors resize-none placeholder:text-[var(--text-muted)]"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-mono text-sm font-semibold bg-[var(--phosphor)] text-[var(--bg-base)] shadow-lg shadow-[var(--phosphor-subtle)] hover:opacity-95 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    封装并唤起邮件发送
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-8 pt-4 border-t border-[var(--border-line)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                PGP/RFC 2822 规范兼容
              </span>
              <span>24小时内响应预期</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
