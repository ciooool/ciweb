import React from "react";
import { siteConfig, ProjectItem } from "@/data/siteConfig";
import { ExternalLink, Sparkles, Terminal, Activity } from "lucide-react";
import { GithubIcon } from "@/components/Icons";

export default function ProjectShowcase() {
  const statusStyles = {
    Live: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
    Beta: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
    Building: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
  };

  return (
    <section id="projects" className="py-16 md:py-24 border-b border-zinc-200/60 dark:border-zinc-800/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
              <Terminal className="h-3.5 w-3.5" />
              <span>Indie Maker Lab</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              作品工坊与独立产品
            </h2>
            <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
              拒绝纸上谈兵。这里是我从 0 到 1 构思并落地的微型 SaaS、独立小工具及开源组件，每个项目都可直接交互或审阅源码。
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-sm text-zinc-500 dark:text-zinc-400">
            持续迭代中 · 保持构建
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteConfig.projects.map((project: ProjectItem) => (
            <div
              key={project.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs hover:shadow-md transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700"
            >
              <div>
                {/* Card Top: Category & Status */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {project.category}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                      statusStyles[project.status]
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                    {project.status}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-1 mb-3">
                  {project.tagline}
                </p>

                {/* Description */}
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
                  {project.description}
                </p>
              </div>

              <div>
                {/* Metrics / Highlight */}
                {project.metrics && (
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-4 px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                    <Activity className="h-3.5 w-3.5 text-emerald-500" />
                    <span>亮点：{project.metrics}</span>
                  </div>
                )}

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[11px] font-mono rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Links */}
                <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <span>在线体验</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                    >
                      <GithubIcon className="h-3.5 w-3.5" />
                      <span>查看源码</span>
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
