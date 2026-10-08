export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: "全栈应用" | "工程工具" | "开源体系" | "工业物联";
  techStack: string[];
  metrics: string;
  demoUrl?: string;
  githubUrl?: string;
}

export interface BookModel {
  title: string;
  concept: string;
  takeaway: string;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  category: string;
  year: string;
  rating: number;
  readingTime: string;
  coverTone: "emerald" | "amber" | "indigo" | "rose" | "teal" | "slate";
  tagline: string;
  whyRead: string;
  models: BookModel[];
  keyQuote: string;
  weReadUrl: string;
  doubanUrl: string;
}

export interface SkillItem {
  name: string;
  category: string;
  desc: string;
}

export interface PortfolioData {
  personal: {
    name: string;
    role: string;
    headline: string;
    bio: string;
    location: string;
    availability: string;
    email: string;
    wechat: string;
    github: string;
    twitter: string;
    avatar: string;
    avatarAlt: string;
  };
  ledgerStats: Array<{ number: string; label: string }>;
  principles: Array<{ num: string; title: string; desc: string }>;
  skills: SkillItem[];
  projects: ProjectItem[];
  books: BookItem[];
}

export const portfolioData: PortfolioData = {
  personal: {
    name: "Ciooool",
    role: "全栈系统架构师 & 独立开发者 (Indie Maker)",
    headline: "以代码构建系统，以阅读重塑心智。",
    bio: "深耕现代全栈系统工程（Next.js / TypeScript / Go），同时搭建这座数字认知书房与独立造物工坊。崇尚极简克制的高效工程，追求无需他人许可的长效数字复利。",
    location: "China · Remote Available",
    availability: "开放高质量微产品造物 · 承接高并发架构咨询与 MVP 研发",
    email: "913849845@qq.com",
    wechat: "WYZ929357",
    github: "https://github.com/ciooool",
    twitter: "https://x.com",
    avatar: "/avatar_portrait.jpg",
    avatarAlt: "/avatar_back.jpg",
  },

  ledgerStats: [
    { number: "5+ Years", label: "全栈系统架构与研发" },
    { number: "8 部", label: "殿堂级核心认知著作" },
    { number: "99.9%", label: "系统可用性与架构韧性" },
    { number: "100%", label: "自驱设计与独立造物" },
  ],

  principles: [
    {
      num: "01",
      title: "极简克制 · Clean Engineering",
      desc: "拒绝冗余依赖与虚饰代码，坚持最少的心智负担实现最高的工程吞吐。",
    },
    {
      num: "02",
      title: "长期复利 · Digital Leverage",
      desc: "打造不依赖外部许可的独立软件资产、微型 SaaS 与自迭代认知模型。",
    },
    {
      num: "03",
      title: "知行合一 · Cognitive Flywheel",
      desc: "以工程造物验证现实世界，以经典阅读沉淀底层心智，形成自闭环飞轮。",
    },
  ],

  skills: [
    { name: "Next.js 16 & React 19", category: "Frontend Core", desc: "App Router / Server Components / Turbopack" },
    { name: "TypeScript", category: "Language", desc: "Strict Type System / Domain-Driven Architecture" },
    { name: "Go (Golang)", category: "Systems Core", desc: "High Concurrency / Goroutines / Microservices" },
    { name: "PostgreSQL & SQLite", category: "Database", desc: "Data Modeling / ACID / Prisma / Drizzle" },
    { name: "Docker & CI/CD", category: "DevOps", desc: "Zero-Downtime Deployment / Containerization" },
    { name: "AI Agent Engineering", category: "Workflows", desc: "LLM Orchestration / Function Calling / MCP" },
  ],

  projects: [
    {
      id: "zenlib",
      title: "ZenLib 数字心智书房",
      tagline: "全景个人认知模型藏书阁与沉浸式数字阅读空间",
      description: "基于 Next.js 与轻量级持久化方案构建的数字阅读禅房。深度结构化拆解 8 卷经典著作心智模型，直通官方正版图书检索与双端持久化漫游。",
      category: "全栈应用",
      techStack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"],
      metrics: "8+ 殿堂认知模型 · 0 外部臃肿依赖",
      demoUrl: "#books",
      githubUrl: "https://github.com/ciooool/ciweb",
    },
    {
      id: "devforge",
      title: "DevForge 案头工程微工具",
      tagline: "纯前端本地隐私计算代码转换与密码学安全沙箱",
      description: "针对高频开发痛点设计的轻量微工具集：支持深层多级嵌套的 JSON 递归生成 Go Struct 引擎，以及基于 Web Crypto API 的高熵密钥生成器。",
      category: "工程工具",
      techStack: ["Web Crypto API", "AST Parsing", "Go CodeGen", "Client-Side Sandbox"],
      metrics: "100% 客户端本地计算 · 零服务端泄露",
      demoUrl: "#tools",
      githubUrl: "https://github.com/ciooool/ciweb",
    },
    {
      id: "quotecraft",
      title: "QuoteCraft 赛博灵感金句工坊",
      tagline: "现代极简高质感赛博案头金句排印与社交分享卡片",
      description: "一键将经典书籍哲思与代码架构心法凝练为高质感极简卡片。支持多套赛博色彩主题、实时排版预览与一键排印复制。",
      category: "开源体系",
      techStack: ["SVG Engine", "Canvas API", "Responsive Typography", "Clipboard API"],
      metrics: "双向色彩方案 · 一键复制分享",
      demoUrl: "#tools",
      githubUrl: "https://github.com/ciooool/ciweb",
    },
    {
      id: "haiwell-iot",
      title: "Haiwell Cloud 工业物联边缘枢纽",
      tagline: "工业设备高并发状态流转与远程控制网关",
      description: "采用 Go 语言构建的工业物联网状态流中心。处理海量设备心跳报文、WebSocket 双向握手与生产环境安全通道动态调度。",
      category: "工业物联",
      techStack: ["Go", "WebSocket", "Redis", "TCP / MQTT Gateway"],
      metrics: "毫秒级心跳分发 · 99.99% 通道可用性",
      demoUrl: "https://github.com/ciooool",
      githubUrl: "https://github.com/ciooool",
    },
  ],

  // 严格精选 8 本殿堂级核心著作 (用户指定基础书单 + 严选拓展)
  books: [
    {
      id: "old-man-and-the-sea",
      title: "老人与海",
      author: "欧内斯特·海明威",
      category: "意志与人文经典",
      year: "1952",
      rating: 4.9,
      readingTime: "精读 2 小时",
      coverTone: "emerald",
      tagline: "硬汉意志的终极图腾，极简冰山理论的传世巅峰",
      whyRead: "在浮躁的信息流时代，圣地亚哥老人的孤独出海是抵抗虚无的最强心力锚点。人可以被消灭，但绝不会被打败。",
      models: [
        {
          title: "硬汉不屈模型",
          concept: "外界力量可以摧毁肉身，但无法摧折精神自主权。",
          takeaway: "将尊严建立在自律与坚持的过程本身，而非外界评判的结果。",
        },
        {
          title: "极简冰山理论",
          concept: "文字只展示八分之一，情感与深邃的八分之七隐于水下。",
          takeaway: "高效系统与文章同样追求克制，去除一切非必要修饰。",
        },
      ],
      keyQuote: "人不是生来要给打败的。你可以消灭他，可就是打不败他。",
      weReadUrl: `https://weread.qq.com/web/search/books?keyword=${encodeURIComponent("老人与海")}`,
      doubanUrl: `https://www.douban.com/search?q=${encodeURIComponent("老人与海")}`,
    },
    {
      id: "ming-dynasty-stories",
      title: "明朝那些事儿",
      author: "当年明月",
      category: "历史博弈与社会机制",
      year: "2006",
      rating: 4.9,
      readingTime: "通读 30 小时",
      coverTone: "amber",
      tagline: "以史为鉴知兴替，以心度人见幽微：帝国近三百年微观博弈全景",
      whyRead: "用现代金融、心理学与权谋博弈视角解构宏大历史。穿透权力幻象，看懂个体在复杂社会机制中的抉择沉浮。",
      models: [
        {
          title: "历史周期与路径依赖",
          concept: "王朝由盛转衰不是偶然暴君，而是制度演进中的熵增必然。",
          takeaway: "在系统设计中预先防范技术债务积累与组织僵化。",
        },
        {
          title: "唯心坚守力量",
          concept: "面对滚滚历史洪流，唯有内心的良知与信念不会被尘埃湮没。",
          takeaway: "知行合一，用纯粹的热爱度过属于自己的一生。",
        },
      ],
      keyQuote: "成功只有一个——按照自己的方式，去度过人生。",
      weReadUrl: `https://weread.qq.com/web/search/books?keyword=${encodeURIComponent("明朝那些事儿")}`,
      doubanUrl: `https://www.douban.com/search?q=${encodeURIComponent("明朝那些事儿")}`,
    },
    {
      id: "rich-dad-poor-dad",
      title: "富爸爸穷爸爸",
      author: "罗伯特·清崎",
      category: "财富杠杆与心智自由",
      year: "1997",
      rating: 4.8,
      readingTime: "精读 4 小时",
      coverTone: "indigo",
      tagline: "打破老鼠赛跑陷阱，重构现金流与资产认知底层逻辑",
      whyRead: "穷人为钱工作，富人让钱为自己工作。这本书是每个工程师与创作者迈向财务独立与时间自主的启蒙第一课。",
      models: [
        {
          title: "资产 vs 负债判据",
          concept: "资产是把钱放进口袋的东西，负债是把钱从口袋拿走的东西。",
          takeaway: "持续积累可产生现金流的资产（软件、代码资产、版权），远离无谓消费负债。",
        },
        {
          title: "逃离老鼠赛跑",
          concept: "仅靠出卖线性时间换取薪资，永远无法真正掌控自由。",
          takeaway: "构建不依赖个人即时劳动的自动化复利系统。",
        },
      ],
      keyQuote: "穷人和中产阶级为金钱而工作，富人让金钱为他们工作。",
      weReadUrl: `https://weread.qq.com/web/search/books?keyword=${encodeURIComponent("富爸爸穷爸爸")}`,
      doubanUrl: `https://www.douban.com/search?q=${encodeURIComponent("富爸爸穷爸爸")}`,
    },
    {
      id: "naval-almanack",
      title: "纳瓦尔宝典",
      author: "埃里克·乔根森 / 纳瓦尔",
      category: "财富杠杆与心智自由",
      year: "2020",
      rating: 4.9,
      readingTime: "精读 3 小时",
      coverTone: "teal",
      tagline: "运用专长、责任感与无许可杠杆，追求财富与心智自由指南",
      whyRead: "现代独立开发者、全栈工程师与创作者的最强圣经。系统阐释了代码与媒体这两种无边际成本杠杆的巨大威力。",
      models: [
        {
          title: "无许可杠杆效应",
          concept: "代码和媒体是无需他人许可就能无限复制并发挥效能的现代超级杠杆。",
          takeaway: "写一次代码，服务百万人；沉淀一次认知，影响无限长远。",
        },
        {
          title: "独特专长与责任感",
          concept: "做那些即使别人教你也学不会的事情，勇于以个人名义承担商业风险。",
          takeaway: "成为独特的自驱个体，长效复利将自然涌现。",
        },
      ],
      keyQuote: "获得财富不是靠运气，而是靠成为具有这种能力的人。",
      weReadUrl: `https://weread.qq.com/web/search/books?keyword=${encodeURIComponent("纳瓦尔宝典")}`,
      doubanUrl: `https://www.douban.com/search?q=${encodeURIComponent("纳瓦尔宝典")}`,
    },
    {
      id: "poor-charlie-almanack",
      title: "穷查理宝典",
      author: "查理·芒格",
      category: "多元思维与决策模型",
      year: "2005",
      rating: 4.9,
      readingTime: "研读 15 小时",
      coverTone: "amber",
      tagline: "终生学习的智者箴言：多元思维模型与人类误判心理学",
      whyRead: "拥有普世智慧的基石之作。芒格教我们跨越单一学科的锤子思维，在头脑中建立多元网格，用逆向思考做正确决策。",
      models: [
        {
          title: "多元思维模型网格",
          concept: "在手里只有锤子的人看来，所有问题都像钉子。必须掌握数学、物理、心理学核心框架。",
          takeaway: "架构师不仅懂语法，更要洞察系统演进规律与人性偏见。",
        },
        {
          title: "逆向思考法则",
          concept: "反过来想，总是反过来想。如果我知道我会死在哪里，我就永远不去那个地方。",
          takeaway: "先想系统会如何崩溃死掉，提前将其彻底消除。",
        },
      ],
      keyQuote: "反过来想，总是反过来想。如果我知道我会在哪里死去，我就永远不去那个地方。",
      weReadUrl: `https://weread.qq.com/web/search/books?keyword=${encodeURIComponent("穷查理宝典")}`,
      doubanUrl: `https://www.douban.com/search?q=${encodeURIComponent("穷查理宝典")}`,
    },
    {
      id: "antifragile",
      title: "反脆弱",
      author: "纳西姆·尼古拉斯·塔勒布",
      category: "多元思维与决策模型",
      year: "2012",
      rating: 4.8,
      readingTime: "精读 10 小时",
      coverTone: "slate",
      tagline: "从不确定性中获益：应对黑天鹅事件的终极思维范式",
      whyRead: "脆弱的事物喜欢安宁，反脆弱的事物在混乱中茁壮成长。无论是软件分布式架构还是个人职业规划，反脆弱都是最强护甲。",
      models: [
        {
          title: "凸性偏好与选择权",
          concept: "下行风险有限，上行收益无限；保持试错成本低廉，捕捉突发机遇。",
          takeaway: "用极简技术栈快速构建多款独立产品，小步迭代。",
        },
        {
          title: "杠铃策略",
          concept: "在极端保守和极端进取之间分配资源，避开脆弱的平庸中间地带。",
          takeaway: "稳固底层的确定性，积极拥抱前沿创新的高杠杆探索。",
        },
      ],
      keyQuote: "风会熄灭蜡烛，却能点燃大火。我们要成为火，渴望狂风。",
      weReadUrl: `https://weread.qq.com/web/search/books?keyword=${encodeURIComponent("反脆弱")}`,
      doubanUrl: `https://www.douban.com/search?q=${encodeURIComponent("反脆弱")}`,
    },
    {
      id: "hackers-and-painters",
      title: "黑客与画家",
      author: "保罗·格雷厄姆",
      category: "工程哲学与创造力",
      year: "2004",
      rating: 4.8,
      readingTime: "精读 5 小时",
      coverTone: "rose",
      tagline: "硅谷教父论程序员、创造力、财富与互联网未来的神作",
      whyRead: "黑客不是破坏者，而是像画家一样用代码创作美的工匠。阐明了程序员如何通过自主创造财富，塑造科技时代的新规则。",
      models: [
        {
          title: "工匠创造力模型",
          concept: "编程像画画一样，是一种通过不断素描、迭代逐步发现美与真相的过程。",
          takeaway: "优秀的代码是自明的艺术品，追求卓越的设计品味。",
        },
        {
          title: "创造财富方程式",
          concept: "财富不是零和博弈的金钱分配，而是通过创造人们需要的东西增量创造出来的价值。",
          takeaway: "解决真实痛点，直接向世界提供价值。",
        },
      ],
      keyQuote: "黑客与画家一样，本质上都是创作者，努力在创作优秀的东西。",
      weReadUrl: `https://weread.qq.com/web/search/books?keyword=${encodeURIComponent("黑客与画家")}`,
      doubanUrl: `https://www.douban.com/search?q=${encodeURIComponent("黑客与画家")}`,
    },
    {
      id: "mythical-man-month",
      title: "人月神话",
      author: "小弗雷德里克·布鲁克斯",
      category: "工程哲学与创造力",
      year: "1975",
      rating: 4.8,
      readingTime: "研读 6 小时",
      coverTone: "indigo",
      tagline: "软件工程领域里程碑：洞察系统复杂性与焦油坑法则",
      whyRead: "向进度落后的项目增加人手，只会使进度更加落后。布鲁克斯法则穿越半个世纪依然支配着现代软件工程的开发规律。",
      models: [
        {
          title: "布鲁克斯法则",
          concept: "向落后的项目增加人手只会带来沟通成本指数级膨胀，使进度更加迟滞。",
          takeaway: "小而精悍的特种兵团队胜过臃肿的人海战术。",
        },
        {
          title: "概念完整性",
          concept: "一个系统最重要的设计品质是概念完整性，它应当反映一个清晰心智构想。",
          takeaway: "由统一的主理人或核心架构师主导系统设计骨架。",
        },
      ],
      keyQuote: "向进度落后的软件项目中增加人手，只会使进度更加落后。",
      weReadUrl: `https://weread.qq.com/web/search/books?keyword=${encodeURIComponent("人月神话")}`,
      doubanUrl: `https://www.douban.com/search?q=${encodeURIComponent("人月神话")}`,
    },
  ],
};

export const PERSONAL_INFO = portfolioData.personal;
