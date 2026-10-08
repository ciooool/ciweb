"use client";

import React from "react";
import { portfolioData } from "@/data/portfolioData";
import { MapPin, Compass, ShieldCheck, Zap } from "lucide-react";

export default function AboutSection() {
  const iconList = [Compass, Zap, ShieldCheck];

  return (
    <section id="about" className="py-20 md:py-28 border-b border-theme-line relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-theme-phosphor uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-theme-phosphor shadow-[0_0_8px_var(--phosphor)]" />
            <span>DISPATCH & PHILOSOPHY · 主理人自白</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-theme-primary tracking-tight mb-4">
            关于工坊与工程法则
          </h2>
          <p className="text-sm sm:text-base text-theme-secondary max-w-2xl font-sans leading-relaxed">
            在信息爆炸与浮躁的软件世界中，坚持打造高内聚、低耦合、具有长效复利价值的数字资产与知识体系。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* 左侧：主理人自白与造物法则 (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-theme-line bg-theme-surface/75 backdrop-blur-md shadow-card">
              <div className="flex items-center gap-2 text-xs font-mono text-theme-muted mb-4">
                <MapPin className="h-4 w-4 text-theme-phosphor" />
                <span>{portfolioData.personal.location}</span>
                <span className="mx-1.5">·</span>
                <span className="text-theme-phosphor font-semibold">自驱全栈造物</span>
              </div>

              <p className="text-sm sm:text-base text-theme-primary leading-relaxed font-sans mb-6">
                我是 <strong>{portfolioData.personal.name}</strong>。热爱探索现代前后端系统工程（Next.js / TypeScript / Go）、分布式高并发与微型 SaaS 商业化闭环。不写无病呻吟的代码，只做解决真实痛点的产品。
              </p>

              <div className="p-4 rounded-xl border border-theme-line bg-theme-base/60 text-xs font-mono text-theme-secondary flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-theme-phosphor animate-pulse shrink-0" />
                <span>{portfolioData.personal.availability}</span>
              </div>
            </div>

            {/* 三大工程造物法则 */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono tracking-widest uppercase text-theme-muted mb-3">
                核心造物法则 (ENGINEERING PRINCIPLES)
              </h3>
              {portfolioData.principles.map((pr, idx) => {
                const Icon = iconList[idx] || Compass;
                return (
                  <div
                    key={pr.num}
                    className="p-5 rounded-xl border border-theme-line bg-theme-surface/60 backdrop-blur-sm hover:border-theme-phosphor/50 transition-all flex items-start gap-4 shadow-xs"
                  >
                    <div className="p-2 rounded-lg bg-theme-base border border-theme-line text-theme-phosphor shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-mono font-bold text-theme-primary mb-1">
                        {pr.title}
                      </h4>
                      <p className="text-xs text-theme-secondary leading-relaxed font-sans">
                        {pr.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 右侧：主力技术栈矩阵 (6 cols) */}
          <div id="skills" className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-mono tracking-widest uppercase text-theme-muted">
                主力工程技术栈 (CRAFT TOOLKIT)
              </h3>
              <span className="text-[10px] font-mono text-theme-violet">
                PRODUCTION VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {portfolioData.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="p-5 rounded-2xl border border-theme-line bg-theme-surface/75 backdrop-blur-md hover:border-theme-phosphor/50 transition-all shadow-xs group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded border border-theme-line bg-theme-base text-theme-violet">
                      {skill.category}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-theme-phosphor opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="text-sm font-sans font-bold text-theme-primary mb-1">
                    {skill.name}
                  </h4>
                  <p className="text-xs text-theme-muted leading-relaxed font-sans">
                    {skill.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* 架构质量宣言 */}
            <div className="p-6 rounded-2xl border border-theme-line bg-theme-surface/40 backdrop-blur-sm text-xs font-mono text-theme-secondary leading-relaxed space-y-2 mt-6">
              <div className="text-theme-primary font-bold flex items-center gap-2">
                <span className="text-theme-phosphor">❯</span> 系统架构标准
              </div>
              <p>
                严谨遵循 Clean Architecture 与单一职责原则。强类型静态校验（TypeScript / Go）、零运行时未捕获异常、秒级 CI/CD 自动化检测与高韧性容灾。
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
