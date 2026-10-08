"use client";

import React from "react";
import { siteConfig, ProjectItem } from "@/data/siteConfig";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/Icons";

export default function ProjectShowcase() {
  const statusLabels: Record<string, string> = {
    Live: "线上运行",
    Beta: "迭代公测",
    Building: "构架中",
  };

  return (
    <section id="projects" className="py-20 md:py-28 border-b border-[#1F2A4D]/80 relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#5CF2C4] uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CF2C4] shadow-[0_0_8px_#5CF2C4]" />
              <span>INDEPENDENT ATELIER · 独立造物</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-[#EAF0FF] tracking-tight">
              独立作品与开源工具
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#9FB0D0] max-w-2xl font-sans leading-relaxed">
              拒绝纸上谈兵。从 0 到 1 构思并落地的微型 SaaS、独立开发套件及开源组件，探索无需他人许可的自主复利创造。
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-xs font-mono tracking-wider text-[#8B7BFF]">
            PROD SHIPMENTS · 持续交付
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteConfig.projects.map((project: ProjectItem) => (
            <div
              key={project.id}
              data-cursor="OPEN"
              className="group relative flex flex-col justify-between rounded-2xl border border-[#1F2A4D] bg-[#0A0E1A]/80 hover:bg-[#0E1528] hover:border-[#5CF2C4]/60 p-6 backdrop-blur-md shadow-lg hover:shadow-[0_8px_30px_rgba(92,242,196,0.15)] transition-all"
            >
              <div>
                {/* Card Top: Category & Status */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-mono tracking-wider text-[#7D88AA] uppercase">
                    {project.category}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono border ${
                      project.status === "Live"
                        ? "border-[#5CF2C4]/40 bg-[#5CF2C4]/10 text-[#5CF2C4]"
                        : "border-[#8B7BFF]/40 bg-[#8B7BFF]/10 text-[#8B7BFF]"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        project.status === "Live"
                          ? "bg-[#5CF2C4] shadow-[0_0_6px_#5CF2C4] animate-pulse"
                          : "bg-[#8B7BFF]"
                      }`}
                    />
                    {statusLabels[project.status] || project.status}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-lg font-sans font-bold text-[#EAF0FF] group-hover:text-[#5CF2C4] transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs font-mono text-[#8B7BFF] mt-1 mb-3">
                  {project.tagline}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#9FB0D0] font-sans leading-relaxed mb-6">
                  {project.description}
                </p>
              </div>

              <div>
                {/* Metrics / Highlight */}
                {project.metrics && (
                  <div className="flex items-center gap-2 text-xs font-mono text-[#9FB0D0] mb-4 px-3.5 py-2.5 rounded-xl bg-[#05070F] border border-[#1F2A4D]">
                    <Sparkles className="h-3.5 w-3.5 text-[#5CF2C4] shrink-0" />
                    <span className="text-[#5CF2C4] font-semibold text-[10px] tracking-widest uppercase">
                      亮点
                    </span>
                    <span className="truncate opacity-90">{project.metrics}</span>
                  </div>
                )}

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[10px] font-mono rounded border border-[#1F2A4D] text-[#9FB0D0] bg-[#05070F]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Links */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#1F2A4D]">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5CF2C4] text-[#05070F] text-xs font-mono font-bold hover:bg-[#7DF9D2] hover:shadow-[0_0_15px_rgba(92,242,196,0.4)] transition-all"
                    >
                      <span>在线体验</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1F2A4D] bg-[#05070F] text-xs font-mono text-[#9FB0D0] hover:text-[#EAF0FF] hover:border-[#8B7BFF] transition-all"
                    >
                      <GithubIcon className="h-3.5 w-3.5 opacity-80" />
                      <span>审阅源码</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
