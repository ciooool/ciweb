import React from "react";
import { siteConfig, ProjectItem } from "@/data/siteConfig";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/Icons";

export default function ProjectShowcase() {
  const statusLabels: Record<string, string> = {
    Live: "线上运行",
    Beta: "迭代公测",
    Building: "构架中",
  };

  return (
    <section id="projects" className="py-20 md:py-28 border-b border-[#EAE6DF] dark:border-[#2C2A28] transition-colors">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-serif tracking-widest text-[#9E7B5B] uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9E7B5B]" />
              <span>独立造物 · 匠人作坊</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#1F1E1D] dark:text-[#EDE9E3] tracking-tight">
              独立作品与数字资产
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#6B6760] dark:text-[#A8A49C] max-w-2xl font-serif leading-relaxed">
              拒绝纸上谈兵。从 0 到 1 构思并落地的微型 SaaS、独立工具及开源组件，探索无需许可的自主创造。
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-xs font-mono tracking-wider text-[#948F86]">
            ATELIER WORKS · 持续构建
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteConfig.projects.map((project: ProjectItem) => (
            <div
              key={project.id}
              className="group relative flex flex-col justify-between rounded-xl border border-[#EAE6DF] dark:border-[#2C2A28] bg-white dark:bg-[#1E1E20] p-6 shadow-2xs hover:border-[#D5CEBF] dark:hover:border-[#4A4742] transition-all"
            >
              <div>
                {/* Card Top: Category & Status */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-serif text-[#948F86]">
                    {project.category}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-serif border border-[#EAE6DF] dark:border-[#38342E] text-[#7A746C] dark:text-[#A8A49C]">
                    <span className="w-1 h-1 rounded-full bg-[#9E7B5B] mr-1.5" />
                    {statusLabels[project.status] || project.status}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-lg font-serif font-medium text-[#1F1E1D] dark:text-[#EDE9E3] group-hover:text-[#9E7B5B] transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs font-serif text-[#9E7B5B] mt-1 mb-3">
                  {project.tagline}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#6B6760] dark:text-[#A8A49C] font-serif leading-relaxed mb-6">
                  {project.description}
                </p>
              </div>

              <div>
                {/* Metrics / Highlight */}
                {project.metrics && (
                  <div className="flex items-center gap-2 text-xs font-serif text-[#7A746C] dark:text-[#A8A49C] mb-4 px-3 py-2 rounded-lg bg-[#FAF8F5] dark:bg-[#252528] border border-[#EAE6DF] dark:border-[#38342E]">
                    <span className="text-[10px] font-mono tracking-widest text-[#9E7B5B] uppercase">亮点</span>
                    <span className="opacity-80">{project.metrics}</span>
                  </div>
                )}

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[10px] font-mono rounded border border-[#EAE6DF] dark:border-[#38342E] text-[#7A746C] dark:text-[#A8A49C] bg-[#FAF8F5] dark:bg-[#181716]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Links */}
                <div className="flex items-center gap-4 pt-4 border-t border-[#EAE6DF] dark:border-[#2C2A28]">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      className="inline-flex items-center gap-1 text-xs font-serif text-[#1F1E1D] dark:text-[#EDE9E3] hover:text-[#9E7B5B] transition-colors"
                    >
                      <span>在线体验</span>
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-serif text-[#948F86] hover:text-[#1F1E1D] dark:hover:text-white transition-colors"
                    >
                      <GithubIcon className="h-3.5 w-3.5 opacity-70" />
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
