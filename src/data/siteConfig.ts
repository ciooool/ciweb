export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: "SaaS / Web App" | "Developer Tool" | "Open Source" | "AI Application";
  status: "Live" | "Beta" | "Building";
  techStack: string[];
  metrics?: string;
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  highlight: string;
  description: string;
  deliverables: string[];
  bestFor: string;
}

export interface PlaybookPost {
  id: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  tags: string[];
  link?: string;
}

export const siteConfig = {
  // 个人基本信息（后续你可以随时改成你自己的真实信息）
  personal: {
    name: "Ciooool",
    role: "全栈工程师 & 独立开发者 (Indie Hacker)",
    tagline: "从 0 到 1 打造极简高可用产品，探索独立开发与软件工程的长效复利。",
    bio: "热衷于探索现代全栈技术（Next.js / TypeScript / Go）、AI 原生工作流与微型 SaaS 商业化。拒绝平庸的代码堆砌，专注于用技术解决真实世界的微小痛点。",
    location: "China · Remote Available",
    availabilityStatus: "🚀 正在打磨独立微工具 · 接受 MVP 承接与技术咨询",
    email: "ciooool.dev@example.com",
    github: "https://github.com",
    twitter: "https://twitter.com",
    wechatQrNote: "添加微信：ciooool_dev（备注：技术交流/项目合作）",
  },

  // 核心技能矩阵
  skills: [
    { name: "Next.js / React 19", level: "Frontend Core", highlight: "App Router / SSR / Tailwind" },
    { name: "TypeScript", level: "Type Safe", highlight: "Clean Architecture / API Contracts" },
    { name: "Go / Gin", level: "Backend & Systems", highlight: "High Concurrency / Microservices" },
    { name: "PostgreSQL & SQLite", level: "Database", highlight: "Data Modeling / Prisma / Drizzle" },
    { name: "Docker / CI-CD", level: "DevOps", highlight: "Zero-Downtime / Edge Deployment" },
    { name: "AI Agent Engineering", level: "Workflow", highlight: "AI-Augmented Development" },
  ],

  // 独立产品与作品展示 (Showcase)
  projects: [
    {
      id: "json-go-converter",
      title: "DevForge QuickTool",
      tagline: "开发者在线高效转换与格式化套件",
      description: "一站式解决 JSON 快速转 Go Struct、SQL DDL 生成及正则测试的轻量 Web 工具，纯前端隐私计算，零延迟秒开。",
      category: "Developer Tool",
      status: "Live",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
      metrics: "内置于本站 · 实时可用",
      demoUrl: "#interactive-tool",
      githubUrl: "https://github.com",
      featured: true,
    },
    {
      id: "ai-prompt-studio",
      title: "PromptPulse AI",
      tagline: "面向独立开发者的 AI 结构化提示词工作台",
      description: "针对复杂工程需求与代码重构场景打造的 Prompt 迭代与版本管理小工具，支持多模型测试与模板一键导出。",
      category: "AI Application",
      status: "Beta",
      techStack: ["Next.js", "OpenAI SDK", "Tailwind CSS"],
      metrics: "自动化提效 40%",
      demoUrl: "https://github.com",
      githubUrl: "https://github.com",
      featured: true,
    },
    {
      id: "go-micro-monitor",
      title: "GoLogLens (开源引擎)",
      tagline: "轻量级高性能分布式日志流解析器",
      description: "基于 Go 语言开发的低内存占用日志过滤与告警系统，单机可压测支撑 50,000+ EPS，支持 Docker 一键部署。",
      category: "Open Source",
      status: "Building",
      techStack: ["Go", "Goroutines", "Docker", "Prometheus"],
      metrics: "单核极低内存占用",
      demoUrl: "https://github.com",
      githubUrl: "https://github.com",
      featured: true,
    },
  ] as ProjectItem[],

  // 商业服务与接单转化 (Services & Consulting)
  services: [
    {
      id: "mvp-launch",
      title: "MVP 快速原型敏捷交付",
      highlight: "2~3 周从 Idea 到上线可运行产品",
      description: "为初创团队、个人创作者量身定制从 0 到 1 的全栈产品交付。包含完整的前端设计、后端 API、数据库及全球 CDN 部署。",
      deliverables: ["响应式现代化 Web 站点 / SaaS 原型", "数据库设计与核心业务接口", "域名解析与云端自动化部署方案"],
      bestFor: "想要快速验证市场想法的创业者与独立开发者",
    },
    {
      id: "system-refactor",
      title: "系统架构与高性能后端设计",
      highlight: "Go / 微服务高并发优化",
      description: "针对现有业务出现的响应慢、吞吐瓶颈或混乱代码进行深度重构梳理。提供高并发设计与轻量化后端服务实现。",
      deliverables: ["系统架构拓扑与数据流图", "Go 高性能 API 核心模块编写", "数据库慢查询与索引优化方案"],
      bestFor: "业务量增长面临技术瓶颈的中小团队",
    },
    {
      id: "custom-tooling",
      title: "定制微工具与自动化脚本",
      highlight: "解放重复人力的定制利器",
      description: "企业内部数据处理、三方接口对接、自动化报表收集、爬虫或定制化小工具开发，开箱即用，免后续繁重维护。",
      deliverables: ["跨平台可执行二进制或 Web 界面", "开箱即用 Docker 镜像与使用说明", "完整源码与后续维护交接"],
      bestFor: "需要自动化替代重复性人工操作的业务方",
    },
  ] as ServiceItem[],

  // 深度实战专栏 (Engineering Playbook)
  playbookPosts: [
    {
      id: "post-1",
      title: "我是如何通过 Next.js 与 AI Agent 在两周内从零发布一个完整产品的？",
      summary: "打破技术栈壁垒，深入解析单人团队如何借助大模型与现代组件化框架，一个人跑通产品设计、研发与全球自动化上线的全闭环。",
      date: "2026-03-25",
      readTime: "8 分钟阅读",
      tags: ["独立开发", "Next.js", "AI 协同", "全栈经验"],
    },
    {
      id: "post-2",
      title: "从单体到轻量微服务：Go 语言高并发场景下的避坑实践",
      summary: "复盘实际业务中 Goroutine 泄漏、Channel 死锁排查全过程，以及如何用极低的服务器成本支撑高 QPS 读写业务。",
      date: "2026-02-18",
      readTime: "12 分钟阅读",
      tags: ["Go语言", "高并发", "架构设计", "性能调优"],
    },
    {
      id: "post-3",
      title: "程序员如何建立自己的第二曲线：给普通开发者的独立开发破局指南",
      summary: "为什么我不建议你盲目写传统的博客？如何用‘产品思维’构建属于自己的数字资产与技术影响力。",
      date: "2026-01-10",
      readTime: "10 分钟阅读",
      tags: ["职业成长", "个人品牌", "独立思考"],
    },
  ] as PlaybookPost[],
};
