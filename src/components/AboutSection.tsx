"use client";

import React from "react";
import { portfolioData } from "@/data/portfolioData";
import { MapPin, Compass, ShieldCheck, Zap, Terminal } from "lucide-react";
import TiltCard from "./TiltCard";

export default function AboutSection() {
  const iconList = [Compass, Zap, ShieldCheck];

  return (
    <section id="about" className="py-20 md:py-28 border-b border-theme-line relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-theme-phosphor uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-theme-phosphor shadow-[0_0_8px_var(--phosphor)]" />
            <span>DISPATCH & PHILOSOPHY · 主理人自白</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-theme-primary tracking-tight mb-3">
            工坊与工程法则
          </h2>
          <p className="text-sm sm:text-base text-theme-secondary max-w-2xl font-sans leading-relaxed">
            崇尚极简克制与长效数字复利，坚持打造解决真实痛点的优质软件。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* 左侧：主理人自白与三大法则 (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            <TiltCard
              maxTilt={5}
              scale={1.015}
              glare={true}
              className="p-6 sm:p-7 rounded-2xl border border-theme-line bg-theme-surface/75 backdrop-blur-md shadow-card hover:border-theme-phosphor/50 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-theme-muted mb-3">
                <MapPin className="h-3.5 w-3.5 text-theme-phosphor" />
                <span>{portfolioData.personal.location}</span>
                <span className="mx-1">·</span>
                <span className="text-theme-phosphor font-semibold">系统研发</span>
              </div>

              <p className="text-sm sm:text-base text-theme-primary leading-relaxed font-sans mb-5">
                我是 <strong>{portfolioData.personal.name}</strong>。热爱探索现代前后端系统工程（Next.js / TypeScript / Go）与高质量架构研发。
                不写冗余无用的代码，追求可靠实用的工程落地。
              </p>

              <div className="p-3.5 rounded-xl border border-theme-line bg-theme-base/60 text-xs font-mono text-theme-secondary flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-theme-phosphor animate-pulse shrink-0" />
                <span>{portfolioData.personal.availability}</span>
              </div>
            </TiltCard>

            {/* 三大工程造物法则 */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono tracking-widest uppercase text-theme-muted mb-2">
                核心法则 (ENGINEERING PRINCIPLES)
              </h3>
              {portfolioData.principles.map((pr, idx) => {
                const Icon = iconList[idx] || Compass;
                return (
                  <TiltCard
                    key={pr.num}
                    maxTilt={4}
                    scale={1.012}
                    glare={true}
                    className="p-4 sm:p-5 rounded-xl border border-theme-line bg-theme-surface/60 backdrop-blur-sm hover:border-theme-phosphor/50 transition-colors flex items-start gap-3.5 shadow-xs"
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
                  </TiltCard>
                );
              })}
            </div>
          </div>

          {/* 右侧：主力技术栈矩阵 (6 cols 3D Tilt) */}
          <div id="skills" className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-mono tracking-widest uppercase text-theme-muted">
                主力工程技术栈 (CRAFT TOOLKIT)
              </h3>
              <span className="text-[10px] font-mono text-theme-violet">
                PRODUCTION VERIFIED · 3D
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {portfolioData.skills.map((skill) => (
                <TiltCard
                  key={skill.name}
                  maxTilt={6}
                  scale={1.02}
                  glare={true}
                  className="p-4 sm:p-5 rounded-xl border border-theme-line bg-theme-surface/75 backdrop-blur-md hover:border-theme-phosphor/50 transition-colors shadow-xs group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded border border-theme-line bg-theme-base text-theme-violet font-semibold">
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
                </TiltCard>
              ))}
            </div>

            {/* 架构质量宣言 */}
            <TiltCard
              maxTilt={4}
              scale={1.01}
              glare={true}
              className="p-5 sm:p-6 rounded-2xl border border-theme-line bg-theme-surface/40 backdrop-blur-sm text-xs font-mono text-theme-secondary leading-relaxed space-y-2 mt-4"
            >
              <div className="text-theme-primary font-bold flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-theme-phosphor" />
                <span>系统架构标准</span>
              </div>
              <p>
                严谨遵循单一职责与 Clean Architecture。严格静态类型、高韧性容灾与自动化持续交付。
              </p>
            </TiltCard>
          </div>

        </div>

      </div>
    </section>
  );
}
