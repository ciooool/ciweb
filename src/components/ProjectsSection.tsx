"use client";
import React from "react";
import { portfolioData, ProjectItem } from "@/data/portfolioData";
import { ExternalLink, Code2, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/Icons";

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-20 md:py-28 border-b border-theme-line relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-theme-phosphor uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-theme-phosphor shadow-[0_0_8px_var(--phosphor)]" />
              <span>FEATURED WORKS · 独立作品工坊</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-theme-primary tracking-tight">
              精选独立工程造物
            </h2>
            <p className="mt-3 text-sm sm:text-base text-theme-secondary max-w-2xl font-sans leading-relaxed">
              从底层架构、高并发服务端到极简前端交互，全栈自主实现、面向长效复利的独立应用。
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-xs font-mono tracking-wider text-theme-violet">
            FULL-STACK AUTONOMY · 100% 独立设计与研发
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {portfolioData.projects.map((project: ProjectItem) => (
            <div
              key={project.id}
              className="p-7 sm:p-9 rounded-2xl border border-theme-line bg-theme-surface/75 backdrop-blur-md hover:border-theme-phosphor/50 transition-all duration-300 flex flex-col justify-between shadow-card hover:shadow-lift group relative overflow-hidden"
            >
              <div>
                {/* 顶部标签与分类 */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-md border border-theme-line bg-theme-base text-theme-phosphor font-semibold">
                    {project.category}
                  </span>
                  <span className="text-[11px] font-mono text-theme-muted">
                    {project.metrics}
                  </span>
                </div>

                {/* 标题与副标 */}
                <h3 className="text-xl sm:text-2xl font-sans font-bold text-theme-primary mb-2 group-hover:text-theme-phosphor transition-colors flex items-center gap-2">
                  <span>{project.title}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-theme-phosphor" />
                </h3>
                
                <p className="text-xs font-mono text-theme-violet mb-4">
                  {project.tagline}
                </p>

                <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed font-sans mb-6">
                  {project.description}
                </p>

                {/* 技术栈标签 */}
                <div className="flex flex-wrap gap-1.5 mb-8">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-[11px] font-mono rounded border border-theme-line/80 bg-theme-base/60 text-theme-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* 底部操作链接 */}
              <div className="flex items-center gap-3 pt-5 border-t border-theme-line/60 font-mono text-xs">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-theme-phosphor text-[#070a13] font-bold hover:opacity-90 transition-opacity"
                  >
                    <span>即刻体验</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-theme-line bg-theme-base text-theme-secondary hover:text-theme-primary hover:border-theme-violet transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>查看源码</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
