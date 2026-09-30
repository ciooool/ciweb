import React from "react";
import { siteConfig, ServiceItem } from "@/data/siteConfig";
import { Briefcase, CheckCircle2, Rocket, ArrowRight, MessageSquare, Mail } from "lucide-react";

export default function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-24 border-b border-zinc-200/60 dark:border-zinc-800/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Commercial & Consulting</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            技术咨询与定制交付
          </h2>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            借助成熟的工程架构经验与 AI 原生敏捷流水线，提供高品质、快周期的产品技术落地服务。
          </p>
        </div>

        {/* 3 Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {siteConfig.services.map((service: ServiceItem, idx) => (
            <div
              key={service.id}
              className="flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
            >
              <div>
                <div className="text-xs font-mono font-semibold text-zinc-400 dark:text-zinc-500 mb-2">
                  0{idx + 1} //
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
                  {service.title}
                </h3>
                <div className="inline-block text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded mb-4">
                  {service.highlight}
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Deliverables List */}
                <div className="space-y-2 mb-6">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    核心交付物：
                  </span>
                  {service.deliverables.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                <span className="text-[11px] text-zinc-400 block mb-3">
                  适合场景：{service.bestFor}
                </span>
                <a
                  href="#contact"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-zinc-100 text-zinc-900 text-xs font-semibold hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  <span>探讨该方案</span>
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Consulting Banner / Conversion */}
        <div className="rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 text-white p-8 md:p-10 shadow-lg border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Rocket className="h-6 w-6 text-emerald-400" />
              <span>有一个绝妙的想法，或遇到了架构瓶颈？</span>
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              无论是快速验证 MVP 商业模型、定制企业自动化脚本，还是高并发 Go 系统架构评审，都可以随时联系我。承诺 24 小时内快速响应并给出客观评估。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <a
              href={`mailto:${siteConfig.personal.email}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-100 transition-all shadow-sm"
            >
              <Mail className="h-4 w-4" />
              <span>发送合作意向邮件</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-800 text-white font-semibold text-xs hover:bg-zinc-700 transition-all border border-zinc-700"
            >
              <MessageSquare className="h-4 w-4" />
              <span>添加微信沟通</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
