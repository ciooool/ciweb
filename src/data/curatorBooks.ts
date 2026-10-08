import { BookCoverTone } from "@/components/ZenBookCover";

export type CuratorCategory =
  | "全部"
  | "系统架构与代码工匠"
  | "商业杠杆与独立创造"
  | "东方心法与静笃哲学"
  | "心智模型与决策清醒"
  | "人文经典与精神林泉";

export interface MentalModel {
  title: string;
  concept: string;
  takeaway: string;
}

export interface CuratorBook {
  id: string;
  title: string;
  author: string;
  category: Exclude<CuratorCategory, "全部">;
  year?: string;
  region?: string;
  coverTone: BookCoverTone;
  rating: number;
  readingTime: string;
  tagline: string;
  whyRead: string;
  curatorEssay: string;
  models: MentalModel[];
  quotes: string[];
  weReadUrl: string;
  doubanUrl: string;
}

export const CURATOR_CATEGORIES: { id: CuratorCategory; name: string; icon: string; countDesc: string }[] = [
  { id: "全部", name: "全部馆藏", icon: "00", countDesc: "25 卷精选" },
  { id: "系统架构与代码工匠", name: "架构与工匠", icon: "01", countDesc: "代码尊严与设计" },
  { id: "商业杠杆与独立创造", name: "杠杆与创造", icon: "02", countDesc: "无需许可的资产" },
  { id: "东方心法与静笃哲学", name: "心法与静笃", icon: "03", countDesc: "知行合一·守柔处下" },
  { id: "心智模型与决策清醒", name: "模型与决策", icon: "04", countDesc: "第一性原理·反脆弱" },
  { id: "人文经典与精神林泉", name: "经典与林泉", icon: "05", countDesc: "极简生活·灵魂滋养" },
];

export const CURATOR_BOOKS: CuratorBook[] = [
  // 1. 系统架构与代码工匠
  {
    id: "pragmatic-programmer",
    title: "程序员修炼之道：从小工到专家",
    author: "大卫·托马斯 / 安德鲁·亨特",
    category: "系统架构与代码工匠",
    year: "1999",
    region: "美国",
    coverTone: "terracotta",
    rating: 4.9,
    readingTime: "精读 3 小时",
    tagline: "拒绝平庸的机器指令堆砌，做掌控全生命周期的现代工匠",
    whyRead:
      "全球软件工程领域的精神图腾。没有枯燥过时的 API 文档，只有关于责任担当、正交性解耦、曳光弹敏捷探索与破窗效应治理的永恒心法。",
    curatorEssay:
      "作为程序员，最大的危险不是写不出代码，而是沦为出卖打字速度的“外包苦力”。这本书教会我：把代码当成手艺，不要留下一扇破损的窗户。当你对自己的交付物有精神洁癖时，你的职业生涯就拥有了无法被轻易替代的护城河。",
    models: [
      {
        title: "破窗效应（Broken Window Theory）",
        concept: "一栋大楼如果有一扇窗户破了且无人修缮，很快整栋大楼都会被砸烂。",
        takeaway: "发现坏代码、低劣命名或未处理异常时，随手重构它。守护代码库的尊严，就是在守护自己的专业自尊。",
      },
      {
        title: "曳光弹开发法（Tracer Bullets）",
        concept: "在黑夜中射击时，用能发光的子弹贯穿全链路，以光亮即时校准枪口。",
        takeaway: "做新系统时，绝不闭门造车写 3 个月文档。先用一根最细但真实贯通前端到后端的链路穿透系统，架构骨架一旦稳定，后续只补血肉。",
      },
      {
        title: "正交性设计（Orthogonality）",
        concept: "在几何学中，相互垂直的向量互不影响；在软件中，修改 A 组件绝不破坏 B 组件。",
        takeaway: "高内聚、低耦合的系统，重构成本趋近于零。让每个模块只负责单一职责，消除隐式全局依赖。",
      },
    ],
    quotes: [
      "不要留下一扇破损的窗户。发现坏代码时，花两分钟随手重构它。",
      "我的代码我负责。当程序崩溃时，诚实剖析原因，并提供切实可行的解决备选方案。",
      "石头汤与催化剂：先写出一个能跑通的核心原型，别人就会主动往锅里加蔬菜和肉。",
      "在软件设计中，没有放之四海皆准的银弹，只有关于权衡的艺术。",
    ],
    weReadUrl: "https://weread.qq.com/web/search/books?keyword=程序员修炼之道",
    doubanUrl: "https://search.douban.com/book/subject_search?search_text=程序员修炼之道",
  },
  {
    id: "ddia",
    title: "数据密集型应用系统设计",
    author: "马丁·克莱普曼 (Martin Kleppmann)",
    category: "系统架构与代码工匠",
    year: "2017",
    region: "剑桥",
    coverTone: "indigo",
    rating: 5.0,
    readingTime: "精读 8 小时",
    tagline: "分布式系统的九阳真经，每一位后端架构师的登堂入室之作",
    whyRead:
      "剥离掉 Kafka、Redis、MySQL 的表面参数调优，直击分布式系统的数据复制、分区、事务隔离与共识算法底层第一性原理。",
    curatorEssay:
      "任何号称能支撑亿级并发的系统，本质上都是在 CAP 定理与物理延迟之间做权衡。马丁·克莱普曼不仅拆解了技术，更传授了一种理性的系统观：没有完美的存储，只有针对具体业务场景的最优取舍。",
    models: [
      {
        title: "不可靠网络的心智模型（Unreliable Networks）",
        concept: "在分布式网络中，网络延迟、时钟漂移和节点暂停是客观物理法则，而非罕见异常。",
        takeaway: "永远假设远程调用会超时或失败。设计系统时必须具备幂等性重试、优雅降级与超时熔断。",
      },
      {
        title: "派生数据与事件溯源（Derived Data & Event Sourcing）",
        concept: "所有只读缓存、全文搜索索引和报表，都是基于原始不可变事件日志（Log）派生出来的只读物化视图。",
        takeaway: "把系统看作由事件驱动的状态机。日志是最纯粹的真相源（Single Source of Truth），可随时重演与自我修复。",
      },
      {
        title: "强一致与最终一致的代价（Consistency vs Availability）",
        concept: "线性一致性（Linearizability）代价高昂，需要协调者通信；大多数高吞吐场景只需因果一致性。",
        takeaway: "不盲目追求绝对分布式锁，根据业务对脏读的容忍度选择隔离级别（如快照隔离 Snapshot Isolation）。",
      },
    ],
    quotes: [
      "计算机科学中只有两件难事：缓存失效和命名问题。",
      "在分布式系统中，你无法区分一个节点是死了、卡住了、还是网络把它的响应丢掉了。",
      "好架构不是在真空中臆造出来的，而是在面对不可靠硬件时建立可靠抽象的艺术。",
    ],
    weReadUrl: "https://weread.qq.com/web/search/books?keyword=数据密集型应用系统设计",
    doubanUrl: "https://search.douban.com/book/subject_search?search_text=数据密集型应用系统设计",
  },
  {
    id: "hackers-painters",
    title: "黑客与画家：硅谷创业之父谈技术与艺术",
    author: "保罗·格雷厄姆 (Paul Graham)",
    category: "系统架构与代码工匠",
    year: "2004",
    region: "硅谷",
    coverTone: "ink",
    rating: 4.8,
    readingTime: "精读 2.5 小时",
    tagline: "黑客与画家一样，本质上都是创造者，而不是枯燥的科学执行机器",
    whyRead:
      "Y Combinator 创始人 Paul Graham 的经典随笔集。重新定义了黑客精神、创造性劳动的价值、以及独立创作者如何通过软件改变财富分配。",
    curatorEssay:
      "在这本书之前，许多人以为写代码是像会计记账一样的苦力活。Graham 告诉你：写程序就像在空白画布上作画，优秀的软件具有优雅、对称、洗练的极高美学价值。它是独立创作者最锋利的杠杆。",
    models: [
      {
        title: "独立创作者的财富守恒律（Wealth Creation）",
        concept: "财富不是存量金钱的转移，而是通过创造人们需要的东西凭空创造出来的新价值。",
        takeaway: "不要把精力花在办公室政治和抢夺存量蛋糕上。用代码开发一个小工具，解决 1000 个人的真痛点，你就在创造真实的社会财富。",
      },
      {
        title: "好品味是客观存在的（Good Taste is Not Relative）",
        concept: "许多人借口‘品味纯属主观’来掩饰平庸。但伟大的设计永远共享着简洁、直接、克制与对称。",
        takeaway: "无论是代码命名、页面交互还是排版留白，追求如自然造物般的极致简洁。消除多余修饰，保留纯粹功能。",
      },
      {
        title: "制造属于自己的不公平优势（Unfair Advantage）",
        concept: "大公司因为官僚流程行动迟缓；独立开发者的唯一武器是极端敏捷与对用户的狂热同理心。",
        takeaway: "在巨头看不上的细分微小利基市场深耕，把一个微型痛点解决到极致，构建巨头无法模仿的个人壁垒。",
      },
    ],
    quotes: [
      "黑客与画家、作家、建筑师一样，他们的共同点是：他们都是创造者。",
      "如果你想致富，有两样东西必不可少：可测量性和杠杆效应。",
      "最优秀的软件不是功能堆叠最多的，而是让使用者感受不到复杂性阻隔的优雅作品。",
    ],
    weReadUrl: "https://weread.qq.com/web/search/books?keyword=黑客与画家",
    doubanUrl: "https://search.douban.com/book/subject_search?search_text=黑客与画家",
  },

  // 2. 商业杠杆与独立创造
  {
    id: "navals-almanack",
    title: "纳瓦尔宝典：财富与自由的微观模型",
    author: "埃里克·乔根森 / 纳瓦尔·拉维坎特",
    category: "商业杠杆与独立创造",
    year: "2020",
    region: "硅谷",
    coverTone: "amber",
    rating: 4.9,
    readingTime: "精读 2 小时",
    tagline: "把自己产品化，用代码与媒体构建无需他人许可的绝对杠杆",
    whyRead:
      "一部写给现代知识工作者的清醒之书。纳瓦尔剥离掉所有空洞的鸡汤，以第一性原理揭示：程序员如何摆脱单纯出卖时间的陷阱，通过自主构建的资产获得真正的个人自由。",
    curatorEssay:
      "纳瓦尔是真正活明白了的当代思想家。他最震撼我的一句话是：‘如果你的收入直接挂钩于你的工作小时数，那你本质上还没有获得财务自由。’作为独立开发者，写代码必须为了拥有资产，而不是为了交差。",
    models: [
      {
        title: "无需许可的超级杠杆（Permissionless Leverage）",
        concept: "劳动力杠杆需要管理别人，资本杠杆需要找人借钱；唯有代码和媒体，计算机从不拒绝执行你的指令。",
        takeaway: "每一行部署到公网的代码、每一篇有深度的技术沉思，都是当你在睡觉时依然在为你工作的 24 小时数字雇员。",
      },
      {
        title: "把自己产品化（Productize Yourself）",
        concept: "拥有属于你独特的专长与真实判断力（自己），并用可无限扩展的软件形态将其交付（产品化）。",
        takeaway: "不要做可被替代的标准 CRUD 工具人，找到你技术能力与人文认知的交叉点，在这个独特细分维度上，全世界无人能与你竞争。",
      },
      {
        title: "长线复利博弈（Play Long-term Games with Long-term People）",
        concept: "生活中所有的巨大回报——无论是财富、声誉还是人际关系，都来自于复利的非线性指数爆发。",
        takeaway: "避开一次性的零和博弈与短期投机，沉下心在一个垂直领域深耕 5~10 年，静候复利之神眷顾。",
      },
    ],
    quotes: [
      "追求财富，而不是金钱或地位。财富是拥有在睡觉时也能为你运转的资产。",
      "代码是世界上最民主的杠杆。计算机不会因为你的出身、学历或背景而拒绝执行你的指令。",
      "最好的简历不是一张纸，而是你在公网上的作品、代码与思想沉淀。",
      "极度忙碌往往只是为了逃避深入思考的痛苦。",
    ],
    weReadUrl: "https://weread.qq.com/web/search/books?keyword=纳瓦尔宝典",
    doubanUrl: "https://search.douban.com/book/subject_search?search_text=纳瓦尔宝典",
  },
  {
    id: "rework",
    title: "重来：更为简单有效的商业思维",
    author: "贾森·弗里德 / 戴维·海涅迈尔·汉森 (37signals / Basecamp)",
    category: "商业杠杆与独立创造",
    year: "2010",
    region: "芝加哥",
    coverTone: "terracotta",
    rating: 4.8,
    readingTime: "精读 1.5 小时",
    tagline: "无需融资、拒绝加班、极简团队，独立微型公司的极简生存法则",
    whyRead:
      "由全球最传奇的独立小而美软件公司 37signals 创始人写就。打破商业计划书、风投融资、疯狂扩张的虚伪泡沫，教你如何用极小的人力赚取丰厚的利润。",
    curatorEssay:
      "在这家公司，只有几十人，但每年创造数千万美元的净利润。他们创造了 Ruby on Rails，也创造了一种自由、体面、有尊严的生活方式。他们证明了：你不需要成为一家拥有上千名员工的疲惫巨头，才能活得很酷。",
    models: [
      {
        title: "先解决你自己的痛点（Scratch Your Own Itch）",
        concept: "最伟大的软件往往不是做调研算出来的，而是创始人自己在日常工作中被恶心到受不了时随手做出来的救命工具。",
        takeaway: "从自己最痛的一个微小需求出发开发工具。既然你自己是目标用户，你就拥有对产品细节最深刻敏锐的直觉。",
      },
      {
        title: "拥抱微小与限制（Embrace Constraints）",
        concept: "没有资金、没有时间、团队只有一个人，这不是劣势，而是逼你剥离一切多余废话、直击核心的最佳契机。",
        takeaway: "如无必要，勿增实体。把核心功能砍到只剩一个，但把这一个做到丝般顺滑。",
      },
      {
        title: "公开你的手艺就是最好的营销（Out-teach the Competition）",
        concept: "小团队打不起昂贵的品牌广告，最好的公关是毫无保留地向全世界公开你的工作流、踩坑记录与思考。",
        takeaway: "真诚是最稀缺的杠杆。在个人网站上写详尽的架构复盘与开源工具，比任何公关稿更能赢得尊重与可信度。",
      },
    ],
    quotes: [
      "做事的意义在于做成一件有价值的事，而不是忙得焦头烂额。",
      "所谓的商业计划书，不过是白纸黑字的幻想小说。",
      "不要成为受害者思维里的‘大公司模仿者’。微小是一种不可多得的巨大优势。",
    ],
    weReadUrl: "https://weread.qq.com/web/search/books?keyword=重来",
    doubanUrl: "https://search.douban.com/book/subject_search?search_text=重来",
  },
  {
    id: "rich-dad-poor-dad",
    title: "富爸爸穷爸爸：财务自由的底层心法",
    author: "罗伯特·清崎 / 莎伦·莱希特",
    category: "商业杠杆与独立创造",
    year: "1997",
    region: "美国",
    coverTone: "amber",
    rating: 4.8,
    readingTime: "精读 2 小时",
    tagline: "穷人为钱工作，富人让钱为自己工作。资产与负债的终极认知分水岭",
    whyRead:
      "全球财商启蒙第一神作。剥离掉繁杂的金融术语，用最生动的对比戳破中产阶级‘老鼠赛跑’的困局，教知识工作者如何分清资产与负债、构建持续产生现金流的资产栏。",
    curatorEssay:
      "作为程序员，最容易陷入的隐形陷阱是：‘技术越好 -> 工资越高 -> 换更大的房子更好的车（负债激增） -> 被房贷锁死不敢冒险’，永远停留在老鼠赛跑的轮盘上。富爸爸教会我：真正的资产是无论你工作与否，都能把钱放进你口袋的东西（比如软件版权、高毛利业务、现金流工具）。写代码必须转化为长效资产，而不是仅仅换取一次性月薪。",
    models: [
      {
        title: "老鼠赛跑陷阱（The Rat Race）",
        concept: "恐惧与贪婪驱使人们拼命工作以换取薪资上涨，但随之而来的是支出与负债的同步膨胀，导致人们陷入永远无法停下的工作滚轮。",
        takeaway: "建立对现金流的绝对敏感度。抑制盲目消费型负债，尽早将主动劳动收入转换为可自我造血的被动软件资产与产品所有权。",
      },
      {
        title: "资产 vs 负债的第一性原理（Assets vs. Liabilities）",
        concept: "资产是把钱放进你口袋里的东西；负债是把钱从你口袋里掏走的东西。很多人把耗尽现金流的自住房当成了资产。",
        takeaway: "独立开发者的代码、SaaS 产品、知识产权是极高质量的数字轻资产；而高昂的固定开销与虚荣消费是吞噬时间与自由的负债。",
      },
      {
        title: "关注你自己的事业（Mind Your Own Business）",
        concept: "你的职业（Profession）是你每天为雇主做的事；而你的事业（Business）围绕着你自己的资产栏展开。",
        takeaway: "保留白天的工作作为生存基本盘，但在业余时间必须经营专属于你自己的数字产品帝国，不要一生都在为别人修筑水管。",
      },
    ],
    quotes: [
      "穷人和中产阶级为金钱而工作，富人让金钱为他们工作。",
      "资产是把钱放进我口袋里的东西；负债是把钱从我口袋里掏走的东西。",
      "大多数人之所以一生都在财务困境中挣扎，是因为他们在学校里学到了如何拼命工作，却从未学会如何让钱为自己工作。",
      "金钱不是真正的财富，你头脑中的财商认知和创造资产的能力才是。",
      "如果你不能学会让钱在你睡觉时为你工作，你将一直工作到死。",
    ],
    weReadUrl: "https://weread.qq.com/web/search/books?keyword=富爸爸穷爸爸",
    doubanUrl: "https://search.douban.com/book/subject_search?search_text=富爸爸穷爸爸",
  },

  // 3. 东方心法与静笃哲学
  {
    id: "dao-de-jing",
    title: "道德经：东方至道与系统解耦心法",
    author: "老子（李耳）",
    category: "东方心法与静笃哲学",
    year: "春秋",
    region: "楚国苦县",
    coverTone: "celadon",
    rating: 5.0,
    readingTime: "精读 2 小时",
    tagline: "大音希声，大象无形。软件解耦的最高境界与开发者静笃心法",
    whyRead:
      "五千言道尽天地运化之机。在纷扰的代码重构与技术内卷中，老子教我们如何以“无为”做架构、以“守柔”化解系统刚性、以“虚静”保持心流与高阶专注。",
    curatorEssay:
      "“上善若水，润物无声。”最高级的软件系统正像流水一样，默默承载庞大的数据流，接口轻盈，对外界系统无侵入感。唯其不争，天下莫能与之争。治大国如烹小鲜，写高可用微服务亦如是。",
    models: [
      {
        title: "守柔处下与非侵入式设计（处众人之所恶）",
        concept: "最高明的系统默默承担最脏最累的异常捕获、超时重试与边界容灾，把最干净优雅的接口留给外界。",
        takeaway: "不抢风头，不搞侵入性极强的中心化架构。底层系统像水一样顺应调用方的需求流转，唯其不争，故天下莫能与之争。",
      },
      {
        title: "无名与常无欲的架构视角（去偶像化）",
        concept: "“名可名，非常名。”任何可以被教条死板固化的模式，都不是永恒不变的架构规律。",
        takeaway: "不要盲信银弹。放下对某种特定技术栈或框架的盲目崇拜，用虚静的心态审视最根本的业务约束与数据流动。",
      },
      {
        title: "慎终如始与防微杜渐（合抱之木，生于毫末）",
        concept: "大系统的崩溃往往不是因为地震，而是成百上千个微小的坏味道积累导致的破窗灾难。",
        takeaway: "在项目临近上线的最后 10% 阶段，保持如第一天写代码般的谨慎与敬畏，绝不在最后一公里掉以轻心。",
      },
    ],
    quotes: [
      "道可道，非常道；名可名，非常名。",
      "上善若水。水善利万物而不争，处众人之所恶，故几于道。",
      "合抱之木，生于毫末；九层之台，起于累土；千里之行，始于足下。",
      "民之从事，常于几成而败之。慎终如始，则无败事。",
    ],
    weReadUrl: "https://weread.qq.com/web/search/books?keyword=道德经",
    doubanUrl: "https://search.douban.com/book/subject_search?search_text=道德经",
  },
  {
    id: "zhuang-zi",
    title: "庄子：逍遥游与打破认知牢笼",
    author: "庄周",
    category: "东方心法与静笃哲学",
    year: "战国",
    region: "宋国蒙地",
    coverTone: "xuan",
    rating: 5.0,
    readingTime: "精读 3 小时",
    tagline: "北冥有鱼，其名为鲲。在效率裹挟的时代夺回绝对的精神灵性",
    whyRead:
      "先秦散文与逍遥哲学的极峰之作。借鲲鹏展翅、庖丁解牛、庄周梦蝶，带领我们打破世俗评价标准的偏狭牢笼，游于广漠之野。",
    curatorEssay:
      "当整个社会都在按 KPI、薪资、估值给一个人打标签时，庄子是唯一一个在两千年前对你说‘无用之用，方为大用’的人。独立开发者之所以独立，是因为我们在灵魂深处不愿沦为流水线上的标准零件。",
    models: [
      {
        title: "小知不及大知（朝菌不知晦朔，蟪蛄不知春秋）",
        concept: "目光短浅的蜩与学鸠会嘲笑鲲鹏飞跃九万里的雄心，因为它们的生活半径只有榆枋树梢。",
        takeaway: "不要在意平庸者的质疑与嘲笑。做高维度的长期事情时，天然无法被局限在眼前短期蝇头微利的人所理解。",
      },
      {
        title: "庖丁解牛的游刃有余（以无厚入有间）",
        concept: "十九年不换一把刀，是因为刀刃游走于骨肉关节的缝隙之间，依乎天理，从不硬碰硬。",
        takeaway: "在复杂的商业协作和架构演进中，寻找阻力最小的自然缝隙，顺势而为，不打消耗精力的硬仗。",
      },
      {
        title: "无用之用与物物而不物于物（保持主体性）",
        concept: "栎树因为木材质地无法做船和棺木，才得以免遭刀斧砍伐，安享天年成为参天神木。",
        takeaway: "掌控技术与金钱，而不是被技术与金钱所驱使奴役。保留一颗不受世俗功利污染的纯真灵性。",
      },
    ],
    quotes: [
      "独与天地精神往来，而不敖倪于万物。",
      "彼节者有间，而刀刃者无厚；以无厚入有间，恢恢乎其于游刃必有余地矣！",
      "鹪鹩巢于深林，不过一枝；偃鼠饮河，不过满腹。",
      "日出而作，日入而息，逍遥于天地之间，而心意自得。",
    ],
    weReadUrl: "https://weread.qq.com/web/search/books?keyword=庄子",
    doubanUrl: "https://search.douban.com/book/subject_search?search_text=庄子",
  },
  {
    id: "chuan-xi-lu",
    title: "传习录：王阳明心学与知行合一实战",
    author: "王阳明（王守仁）",
    category: "东方心法与静笃哲学",
    year: "明代",
    region: "浙江余姚",
    coverTone: "amber",
    rating: 5.0,
    readingTime: "精读 2.5 小时",
    tagline: "知是行之始，行是知之成。破山中贼易，破心中贼难",
    whyRead:
      "阳明心学的核心语录集。王阳明龙场悟道，倡导致良知与知行合一，影响了东亚五百年的政治家、思想家与现代商业领袖。",
    curatorEssay:
      "许多程序员懂得成百上千种高深的架构理论，但从来没有独立交付过一款能让真实用户付款的产品。王阳明教导我们：未有知而不行者，知而不行只是未知。唯有在真实的交付与市场挫败中，认知才能真正落地生根。",
    models: [
      {
        title: "真知即所以为行（知行合一）",
        concept: "知与行是一枚硬币的两面。就像‘见好色属知，好好色属行’，心动之时便已是行。",
        takeaway: "拒绝坐在桌前做毫无行动的空洞臆想。在代码的每一次敲下、产品的每一次发布中去校准心性。",
      },
      {
        title: "事上磨练（On-the-Job Cultivation）",
        concept: "闭门打坐修不出真正的定力，唯有在最艰难的逆境与具体的事务冲突中，心性才能真正淬炼成熟。",
        takeaway: "把线上 Bug、交付压力和商业波动看作打磨自己心性的磨刀石，遇事不慌，反躬自省。",
      },
      {
        title: "此心光明，亦复何言（致良知）",
        concept: "良知是每个人内心深处最清澈纯粹的判断力，不被私欲与浮华蒙蔽。",
        takeaway: "做产品与做人守住最根本的诚实底线。不欺骗用户，不走旁门左道，内心坦荡光明。",
      },
    ],
    quotes: [
      "知是行的主意，行是知的功夫；知是行之始，行是知之成。",
      "破山中贼易，破心中贼难。",
      "人须在事上磨炼，方立得住，方能‘静亦定，动亦定’。",
      "此心光明，亦复何言！",
    ],
    weReadUrl: "https://weread.qq.com/web/search/books?keyword=传习录",
    doubanUrl: "https://search.douban.com/book/subject_search?search_text=传习录",
  },

  // 4. 心智模型与决策清醒
  {
    id: "poor-charlies-almanack",
    title: "穷查理宝典：查理·芒格的智慧箴言录",
    author: "彼得·考夫曼 / 查理·芒格",
    category: "心智模型与决策清醒",
    year: "2005",
    region: "内布拉斯加",
    coverTone: "amber",
    rating: 5.0,
    readingTime: "精读 4 小时",
    tagline: "手里拿着锤子的人，看什么都像钉子。多元思维模型大成之作",
    whyRead:
      "巴菲特数十年的幕后导师查理·芒格的毕生心血。详细阐述了如何搭建由数学、物理、生物、心理学构成的多元思维栅格，做出高胜率的清醒决策。",
    curatorEssay:
      "芒格教会了我受用终身的两件事：第一，逆向思考（如果想知道怎么成功，先研究人是怎么死掉的并彻底避开它）；第二，跨学科格栅思维（不要只懂写代码，懂一点心理学和微观经济学，你的工程价值将提升十倍）。",
    models: [
      {
        title: "逆向思考（Inversion）",
        concept: "“如果我知道我将死在哪里，我将永远不去那个地方。”",
        takeaway: "想要做一个高可用系统，先列出所有会导致系统崩溃的 10 个致命因素，然后一条一条建立防御机制。",
      },
      {
        title: "多元思维模型格栅（Latticework of Mental Models）",
        concept: "单一维度的专家往往拥有严重的偏见（铁锤人综合征）。必须掌握人类 100 个核心基础学科的大模型。",
        takeaway: "用生物学的进化论看软件演进，用物理学的惯性看组织架构，用微观经济学的边际成本看产品定价。",
      },
      {
        title: "人类误判心理学（25种认知偏误）",
        concept: "从损失厌恶、社会认同到过度自信，人类的大脑充斥着数百万年进化留下的认知后门。",
        takeaway: "在做关键技术选型或重大人生决策时，建立检查清单（Checklist），防止自己欺骗自己。",
      },
    ],
    quotes: [
      "如果我知道我将死在何处，那我将永远不去那个地方。",
      "手里握着锤子的人，看什么都像钉子。",
      "获取智慧是一种道德责任。每天夜里睡觉时，努力比当天早晨醒来时聪明一点点。",
      "要得到你想要的东西，最可靠的办法是让你自己配得上它。",
    ],
    weReadUrl: "https://weread.qq.com/web/search/books?keyword=穷查理宝典",
    doubanUrl: "https://search.douban.com/book/subject_search?search_text=穷查理宝典",
  },
  {
    id: "antifragile",
    title: "反脆弱：从不确定性中获益",
    author: "纳西姆·尼古拉斯·塔勒布 (Nassim Taleb)",
    category: "心智模型与决策清醒",
    year: "2012",
    region: "纽约",
    coverTone: "indigo",
    rating: 4.8,
    readingTime: "精读 3.5 小时",
    tagline: "风会熄灭蜡烛，却能使火越烧越旺。在动荡世界中获得不对称收益",
    whyRead:
      "《黑天鹅》作者塔勒布的思想巅峰之作。提出了超越‘坚固’的第三种状态——‘反脆弱’：不仅不怕混乱与冲击，反而能从波动中吸取养分、变得更强。",
    curatorEssay:
      "传统的软件系统追求‘零故障’（脆弱的刚性），一旦遭遇未预料到的黑天鹅就会雪崩。反脆弱的系统（如混沌工程 Chaos Engineering）则故意注入随机错误来测试韧性。人生与职业亦如是：做拥有不对称凸性收益的事。",
    models: [
      {
        title: "杠铃策略（Barbell Strategy）",
        concept: "拒绝中庸和平庸的中间态，在极度保守（90%安全底线）和极度投机（10%小额不对称试错）两端配置资源。",
        takeaway: "保持 90% 稳定的核心工作维持生存，拿出 10% 的业余时间去做潜在收益无限的独立开源项目或微产品探索。",
      },
      {
        title: "凸性效应与不对称性（Convexity）",
        concept: "下行风险有限（最多亏一点时间），而上行收益无限（可能获得全球用户的长期复利关注）。",
        takeaway: "永远寻找具有不对称凸性回报的机会。写在公网上的作品就是典型的凸性资产：失败成本极低，成功收益极高。",
      },
      {
        title: "林迪效应（Lindy Effect）",
        concept: "对于不可消亡的事物（如思想、技术、经典著作），它的预期寿命与它已经存在的时间成正比。",
        takeaway: "少读昨天刚出的技术热点快餐文，多读存在了 30 年以上的经典书籍。经典被历史反复淘洗，信噪比最高。",
      },
    ],
    quotes: [
      "风会熄灭蜡烛，却能使火越烧越旺。我们要成为火，渴望狂风的吹拂。",
      "杀不死我的，使我更强大。",
      "没有经历过波动的稳定，是通向更大灾难的假象。",
    ],
    weReadUrl: "https://weread.qq.com/web/search/books?keyword=反脆弱",
    doubanUrl: "https://search.douban.com/book/subject_search?search_text=反脆弱",
  },
  {
    id: "principles",
    title: "原则：生活与工作的方法论",
    author: "瑞·达利欧 (Ray Dalio)",
    category: "心智模型与决策清醒",
    year: "2017",
    region: "桥水基金",
    coverTone: "ink",
    rating: 4.8,
    readingTime: "精读 3 小时",
    tagline: "极度求真，极度透明。把生活与决策抽象为可迭代的代码算法",
    whyRead:
      "全球最大对冲基金桥水创办人 Ray Dalio 的心法总结。教我们如何正视痛苦、总结原则，像调试计算机程序一样调试自己的人生系统。",
    curatorEssay:
      "Dalio 把现实世界看作一台精密的机器，把个人看作机器中的工程师与操作者。这本书最核心的公式是：痛苦 + 反思 = 进步。犯错不可怕，可怕的是在同一个地方重复摔倒而没有沉淀出算法化的防御原则。",
    models: [
      {
        title: "五步达成愿望的算法流程（The 5-Step Process）",
        concept: "1.设立明确目标 -> 2.直面阻碍的问题 -> 3.精准诊断根因 -> 4.规划解决路径 -> 5.严格执行交付。",
        takeaway: "在执行一个技术项目或个人目标时，绝不要把步骤混淆。诊断问题时不要过早跳到解决方案，严格按流程闭环。",
      },
      {
        title: "极度开放与头脑风暴（Radical Open-mindedness）",
        concept: "人最大的弱点是自我意识障碍（Ego）与盲点。承认自己可能错了，主动寻求可信同行的批判。",
        takeaway: "代码评审（Code Review）不是为了找茬，而是为了借助另一个维度的视角消除自己的盲点。",
      },
      {
        title: "可信度加权决策（Believability-weighted Decision Making）",
        concept: "不要搞无原则的盲目民主投票，让在某一领域有多次成功交付记录的可信之人拥有更大的发言权重。",
        takeaway: "在做系统架构或商业决策时，优先听取在该领域拿过真实交付成果的人的意见，过滤掉键盘侠的噪音。",
      },
    ],
    quotes: [
      "痛苦 + 反思 = 进步。",
      "如果你不能极度诚实地直面现实，你就无法做出正确的决策。",
      "像机器一样运转你的原则，像工程师一样审视机器的输出。",
    ],
    weReadUrl: "https://weread.qq.com/web/search/books?keyword=原则",
    doubanUrl: "https://search.douban.com/book/subject_search?search_text=原则",
  },

  // 5. 人文经典与精神林泉
  {
    id: "walden",
    title: "瓦尔登湖：数字喧嚣中的极简与内省",
    author: "亨利·戴维·梭罗",
    category: "人文经典与精神林泉",
    year: "1854",
    region: "康科德",
    coverTone: "celadon",
    rating: 4.8,
    readingTime: "精读 3 小时",
    tagline: "简朴，简朴，简朴！在信息洪流中夺回对个人时间的绝对支配",
    whyRead:
      "梭罗在瓦尔登湖畔独居两年的灵魂记录。在这部超越时代的散文中，他探讨了我们到底需要多少物质才能从容生活，以及如何在被 KPI 绑架的时代夺回心灵的主权。",
    curatorEssay:
      "在屏幕前日复一日敲打键盘的我们，时常会忘记抬头看看天空的颜色。把代码当成手艺，把产品当成表达，但在核心深处，要永远留出一片像瓦尔登湖般清澈不受污染的精神天地。",
    models: [
      {
        title: "生命的真正代价（The Cost of a Thing）",
        concept: "一件东西的真正代价，是为了换取它而需要立即或长期付出的那一整段生命。",
        takeaway: "每当我们为了买一件并不真正需要的物品而被迫去加班忍受消耗时，我们付出的不是金钱，而是不可逆转的生命长度。",
      },
      {
        title: "极简生活的精神从容（Simplify, Simplify, Simplify）",
        concept: "让你的事情只有两件或三件，而不是一百件；把你的账目记在你的大拇指指甲上。",
        takeaway: "在工具和需求上做极限减法。削减无意义的社交虚荣，你所能拥有的专注力与个人自由将远超绝大多数人。",
      },
      {
        title: "从容不迫的生命自觉（Living Deliberately）",
        concept: "“我步入丛林，因为我希望生活得从容不迫，免得在行将就木时，才发现自己根本不曾生活过。”",
        takeaway: "做自己时间的主人，不要在人云亦云的焦虑中浑浑噩噩度过一生。",
      },
    ],
    quotes: [
      "一件东西的代价，就是为了换取它，而需要立刻或长期付出的那一整段生命。",
      "大多数人都在过着一种默默绝望的生活。所谓的顺从，不过是根深蒂固的绝望。",
      "简朴，简朴，简朴！我说，让你的事情只有两件或三件，而不是一百件或一千件。",
      "时间只是我垂钓的溪流。我喝着溪水，但当我在饮水时，我看见了沙底，察觉到了水流是多么浅薄。",
    ],
    weReadUrl: "https://weread.qq.com/web/search/books?keyword=瓦尔登湖",
    doubanUrl: "https://search.douban.com/book/subject_search?search_text=瓦尔登湖",
  },
  {
    id: "old-man-sea",
    title: "老人与海：硬汉的精神图腾",
    author: "欧内斯特·海明威",
    category: "人文经典与精神林泉",
    year: "1952",
    region: "古巴哈瓦那",
    coverTone: "indigo",
    rating: 4.9,
    readingTime: "精读 2 小时",
    tagline: "人不是生来要给打败的。你可以消灭他，可就是打不败他",
    whyRead:
      "海明威诺贝尔文学奖获奖杰作。老渔夫圣地亚哥在连续八十四天没有捕到鱼后，独自在墨西哥湾流中同大马林鱼与鲨鱼搏斗的硬汉史诗。",
    curatorEssay:
      "独立开发者一个人从零开始做一个产品、在黑暗中孤独前行、面对市场的无人问津，本质上与老人在汪洋大海上孤独搏斗没有任何区别。海明威教给我们的是：无论最终大鱼是否被鲨鱼咬得只剩骨架，在茫茫深海中搏斗过的过程，已经铸造了一个人不可磨灭的尊严。",
    models: [
      {
        title: "专业主义的严谨习惯（Preparedness over Luck）",
        concept: "“走运当然好，但我宁愿做到分毫不差。这样，当运气来的时候，你就准备好了。”",
        takeaway: "不把希望寄托在虚无缥缈的运气上。把每一次架构设计、每一个接口打磨到极致，运气到来时便能稳稳接住。",
      },
      {
        title: "不可被击败的尊严（Invictus Mindset）",
        concept: "你可以消灭我的肉体，吞噬我的猎物，但你永远无法击碎我的意志。",
        takeaway: "独立创造者的核心资本不是银行存款，而是面对失败时拍拍灰尘、第二天重新开工的无限韧性。",
      },
    ],
    quotes: [
      "人不是生来要给打败的。你可以消灭他，可就是打不败他！",
      "每一天都是一个新的日子。走运当然好，但我宁愿做到分毫不差。",
      "一个人可以被毁灭，但不能被击败。",
    ],
    weReadUrl: "https://weread.qq.com/web/search/books?keyword=老人与海",
    doubanUrl: "https://search.douban.com/book/subject_search?search_text=老人与海",
  },
  {
    id: "siddhartha",
    title: "悉达多：一首印度的诗与灵魂寻找之旅",
    author: "赫尔曼·黑塞 (Hermann Hesse)",
    category: "人文经典与精神林泉",
    year: "1922",
    region: "瑞士",
    coverTone: "xuan",
    rating: 4.9,
    readingTime: "精读 2.5 小时",
    tagline: "真理无法通过言辞传授，只能通过亲身经历去体验与证悟",
    whyRead:
      "诺贝尔文学奖得主黑塞的心灵史诗。讲述婆罗门青年悉达多离开舒适圈，历经苦行、情欲、商业名利与河流倾听，最终找到内心终极平静的探索之旅。",
    curatorEssay:
      "每个人年轻时都想通过读几本书、听别人讲几个道理来走捷径搞懂人生。但黑塞告诉你：教义是二手知识，智慧无法被教导。你必须亲自跳进人生的河流里，去犯错、去受挫、去沉沦、去爱、去原谅，才能抵达真正的觉醒。",
    models: [
      {
        title: "亲身证悟的不可替代性（Experiential Wisdom）",
        concept: "任何被语言组织出来的‘真理’，其反面往往也是真理。真正的智慧无法被概念化灌输。",
        takeaway: "不沉迷于做纸上谈兵的评论家。跳进代码与商业的真实泥潭中去，踩过所有坑，智慧才会真正长在骨头里。",
      },
      {
        title: "三大底层心性能量（思考、等待、斋戒）",
        concept: "悉达多身无分文走向世界时，他的所有财富只有三样：‘我会思考，我会等待，我能斋戒。’",
        takeaway: "会思考让你能洞悉因果，会等待让你耐得住寂寞抵御短期诱惑，能斋戒让你对物质匮乏毫无恐惧。这是独立创作者最强大的内驱力。",
      },
      {
        title: "万物归一的河流模型（The River of Life）",
        concept: "河流在源头，同时在入海口，在瀑布，在渡口。它永远存在，但无休止流动。",
        takeaway: "学会接纳所有的冲突与矛盾。把人生的挫折、成功、迷茫看作同一条大河在不同维度的浪花。",
      },
    ],
    quotes: [
      "智慧是无法言传的。智者试图传授的智慧，听起来往往像愚蠢的话语。",
      "大多数人就像随风飘落的树叶，在空中飘摇翻滚，最终落在地上；但有些人却像天上的星辰，循着固定的轨道前行，无论什么狂风都无法动摇他们。",
      "我会思考，我会等待，我能斋戒。",
    ],
    weReadUrl: "https://weread.qq.com/web/search/books?keyword=悉达多",
    doubanUrl: "https://search.douban.com/book/subject_search?search_text=悉达多",
  },
];
