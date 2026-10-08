export interface BookChapter {
  id: string;
  title: string;
  content: string;
  pageTitle?: string;
}

export type BookCategory =
  | "古典演义"
  | "现当代名著"
  | "诸子哲学"
  | "史书纪传"
  | "世情小品"
  | "世界经典"
  | "认知工匠";

export interface Book {
  id: string;
  title: string;
  remoteTitle?: string; // 用于对接到远程开放数字文库的完整书名
  author: string;
  year?: string;
  region?: string;
  coverTone: "xuan" | "celadon" | "terracotta" | "indigo" | "ink" | "amber";
  category: BookCategory;
  tagline: string;
  description: string;
  curatorNote: string;
  rating: number;
  totalWords: string;
  estimatedReadTime: string;
  chapters: BookChapter[];
  dateLabel?: string;
}

export function getCurrentWeekOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime() + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60000;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return Math.min(Math.max(Math.ceil((dayOfYear + start.getDay() + 1) / 7), 1), 52);
}

// 分类元数据（复刻厦图左侧分类导航）
export const LIBRARY_CATEGORIES: { id: BookCategory | "全部"; name: string; icon: string; countDesc: string }[] = [
  { id: "全部", name: "全部馆藏", icon: "🏛️", countDesc: "海量藏书" },
  { id: "古典演义", name: "古典演义", icon: "📜", countDesc: "四大名著与百回传奇" },
  { id: "现当代名著", name: "现当代名著", icon: "🖋️", countDesc: "鲁迅·老舍·沈从文" },
  { id: "诸子哲学", name: "诸子哲学", icon: "🧭", countDesc: "老庄·心学·论语" },
  { id: "史书纪传", name: "史书纪传", icon: "⚔️", countDesc: "史记·通鉴·三国志" },
  { id: "世情小品", name: "世情小品", icon: "🍵", countDesc: "浮生·幽梦·随笔" },
  { id: "世界经典", name: "世界经典", icon: "🌌", countDesc: "瓦尔登·老人与海" },
  { id: "认知工匠", name: "认知工匠", icon: "💡", countDesc: "纳瓦尔·现代工匠" },
];

// 本周今日荐读列表（复刻厦图截图一）
export const TODAY_FEATURED_CAROUSEL = [
  {
    date: "09/27",
    day: "周五",
    title: "超越左右",
    author: "社会与经济学文存",
    tagline: "拓宽时代认知边界",
    tone: "indigo" as const,
    active: false,
  },
  {
    date: "09/28",
    day: "周六",
    title: "走向繁荣",
    author: "宏观发展战略",
    tagline: "现代经济演进逻辑",
    tone: "amber" as const,
    active: false,
  },
  {
    date: "09/29",
    day: "周日",
    title: "文明与革命",
    author: "文明史研究组",
    tagline: "从传统走向现代的深层推力",
    tone: "terracotta" as const,
    active: false,
  },
  {
    date: "09/30",
    day: "今天",
    title: "大国创新",
    author: "科技战略研究组",
    tagline: "丈量时代前行的脉络，致敬这片土地的生生不息",
    tone: "xuan" as const,
    active: true,
  },
  {
    date: "10/01",
    day: "明天",
    title: "新经济征程",
    author: "高质量发展探索",
    tagline: "探寻自主软件与技术前沿",
    tone: "celadon" as const,
    active: false,
  },
  {
    date: "10/02",
    day: "周四",
    title: "工匠之心",
    author: "系统架构随笔",
    tagline: "重塑软件工程师的价值底座",
    tone: "ink" as const,
    active: false,
  },
];

// --- 动态全量章节生成器 ---

// 1. 红楼梦 120 回
const HLM_FIRST_TITLES = [
  "甄士隐梦幻识通灵 贾雨村风尘怀闺秀",
  "贾夫人仙逝扬州城 冷子兴演说荣国府",
  "贾雨村夤缘复旧职 林黛玉抛父进京都",
  "薄命女偏逢薄命郎 葫芦僧乱判葫芦案",
  "游幻境指迷十二钗 饮仙醪曲演红楼梦",
  "贾宝玉初试云雨情 刘姥姥一进荣国府",
  "送宫花贾琏戏熙凤 宴宁府宝玉会秦钟",
  "比通灵金莺微露意 探宝钗黛玉半含酸",
  "恋风流情友入家塾 起嫌疑顽童闹学堂",
  "金寡妇贪利权受辱 张太医论病细穷源",
  "庆寿辰宁府排家宴 见熙凤贾瑞起淫心",
  "王熙凤毒设相思局 贾天祥正照风月鉴",
  "秦可卿死封龙禁尉 王熙凤协理宁国府",
  "林如海捐馆扬州城 贾宝玉路逮北静王",
  "王凤姐弄权铁槛寺 秦鲸卿得趣馒头庵",
  "贾二爷偷娶尤二姨 尤三姐自刎鸳鸯剑",
  "苦尤娘赚入大观园 酸凤姐大闹宁国府",
  "林黛玉焚稿断痴情 薛宝钗出闺成大礼",
  "苦绛珠魂归离恨天 病神瑛泪洒相思地",
  "贾政还乡途中遇雪 宝玉出家辞别贾政",
  "甄士隐详说太虚情 贾雨村归结红楼梦",
];

function generateHlmChapters(): BookChapter[] {
  return Array.from({ length: 120 }, (_, idx) => {
    const num = idx + 1;
    const pad = String(num).padStart(3, "0");
    const titleSnippet = HLM_FIRST_TITLES[idx] || `红楼梦第 ${num} 回`;
    return {
      id: `hlm-chap-${num}`,
      title: `第 ${num} 回：${titleSnippet}`,
      pageTitle: `紅樓夢/第${pad}回`,
      content:
        idx === 0
          ? `此开卷第一回也。作者自云：曾历过一番梦幻之后，故将真事隐去，而借“通灵”之说，撰此《石头记》一书也。故曰“甄士隐”云云。

满纸荒唐言，一把辛酸泪！
都云作者痴，谁解其中味？

列位看官：你道此书从何而来？说起根由虽近荒唐，细按则深有趣味。
原来女娲氏炼石补天之时，于大荒山无稽崖炼成高经十二丈、方经二十四丈顽石三万六千五百零一块。娲皇氏只用了三万六千五百块，只单单剩了一块未用，便弃在此山青埂峰下。

谁知此石自经煅炼之后，灵性已通，因见众石俱得补天，独自己无材不堪入选，遂自怨自叹，日夜悲号惭愧……
一日，正当嗟悼之际，俄见一僧一道远远而来，生得骨骼不凡，丰神迥异，来至峰下，坐于石边高谈快论。先说些云山雾海、神仙玄幻之事，后便说到红尘中荣华富贵。此石听了，不觉打动凡心，也想要到人间去享一享这荣华富贵……`
          : "",
    };
  });
}

// 2. 三国演义 120 回
const SG_TITLES = [
  "宴桃园豪杰三结义 斩黄巾英雄首立功",
  "张翼德怒鞭督邮 何国舅谋诛宦竖",
  "议温明董卓叱丁原 馈金珠李肃说吕布",
  "废汉帝陈留践位 谋董贼孟德献刀",
  "发矫诏诸镇应曹公 破关兵三英战吕布",
  "焚金阙董卓行凶 匿玉玺孙坚背约",
  "袁绍磐河战公孙 孙坚跨江击刘表",
  "王司徒巧使连环计 董太师大闹凤仪亭",
  "除暴凶吕布助司徒 犯长安李傕听贾诩",
  "勤王室马腾举义 报父仇曹操兴师",
  "草船借箭孔明神算 赤壁鏖兵曹操溃败",
  "降孙皓三分归一统 司马炎一统立大晋",
];

function generateSgChapters(): BookChapter[] {
  return Array.from({ length: 120 }, (_, idx) => {
    const num = idx + 1;
    const pad = String(num).padStart(3, "0");
    const titleSnippet = SG_TITLES[idx] || `三国演义第 ${num} 回`;
    return {
      id: `sg-chap-${num}`,
      title: `第 ${num} 回：${titleSnippet}`,
      pageTitle: `三國演義/第${pad}回`,
      content:
        idx === 0
          ? `滚滚长江东逝水，浪花淘尽英雄。
是非成败转头空。
青山依旧在，几度夕阳红。
白发渔樵江渚上，惯看秋月春风。
一壶浊酒喜相逢。
古今多少事，都付笑谈中。

---

话说天下大势，分久必合，合久必分。周末七国分争，并入于秦。及秦灭之后，楚、汉分争，又并入于汉。汉朝自高祖斩白蛇而起义，一统天下，后来光武中兴，传至献帝，遂分为三国。

推其致乱之由，殆始于桓、灵二帝。桓帝禁锢善类，崇信宦官。及桓帝崩，灵帝即位，大将军窦武、太傅陈蕃共相辅佐。时有宦官曹节等弄权，窦武、陈蕃谋诛之，机事不密，反为所害，中涓自此愈横。

中平元年秋七月，涿郡张角兄弟起兵，号曰“黄巾”，势如破竹……
涿县刘备、关羽、张飞三人志同道合，相聚于张飞庄后桃园中，焚香再拜结为异姓兄弟！`
          : "",
    };
  });
}

// 3. 西游记 100 回
const XYJ_TITLES = [
  "灵根育孕源流出 心性修持大道生",
  "悟彻菩提真妙理 断魔归本合元神",
  "四海千山皆拱伏 九幽十类尽除名",
  "官封弼马心何足 名注齐天意未宁",
  "乱蟠桃大圣偷丹 反天宫诸神捉怪",
  "观音赴会问原因 小圣施威降大圣",
  "八卦炉中逃大圣 五行山下定心猿",
  "我佛造经传极乐 观音奉旨上长安",
  "陈光蕊赴任逢灾 江流僧复仇报本",
  "径回东土 五圣成真 功德圆满",
];

function generateXyjChapters(): BookChapter[] {
  return Array.from({ length: 100 }, (_, idx) => {
    const num = idx + 1;
    const pad = String(num).padStart(3, "0");
    const titleSnippet = XYJ_TITLES[idx] || `西游记第 ${num} 回`;
    return {
      id: `xyj-chap-${num}`,
      title: `第 ${num} 回：${titleSnippet}`,
      pageTitle: `西遊記/第${pad}回`,
      content:
        idx === 0
          ? `混沌未分天地乱，茫茫渺渺无人见。
自从盘古破鸿蒙，开辟从兹清浊辨。
覆载群生仰至仁，发明万物皆成善。
预知造化会元功，须看西游释厄传。

感盘古开辟，三皇治世，五帝分伦，世界之间，遂分为四大部洲：曰东胜神洲，曰西牛贺洲，曰南赡部洲，曰北俱芦洲。这部书单表东胜神洲。
海外有一国土，名曰傲来国。国近大海，海中有一座名山，唤为花果山。那座山正当顶上，有一块仙石。
内育仙胞，一日迸裂，产一石卵，似圆球样大。因见风，化作一个石猴，五官俱备，四肢皆全……`
          : "",
    };
  });
}

// 4. 水浒传 100 回
function generateShzChapters(): BookChapter[] {
  return Array.from({ length: 100 }, (_, idx) => {
    const num = idx + 1;
    const pad = String(num).padStart(3, "0");
    return {
      id: `shz-chap-${num}`,
      title: `第 ${num} 回：水浒传第 ${num} 回`,
      pageTitle: `水滸傳 (100回本)/第${pad}回`,
      content:
        idx === 0
          ? `话说大宋仁宗天子在位，嘉祐三年三月三日五更三点，天子驾坐紫宸殿，受百官朝贺。
是时，京师大疫，民不聊生。天子特命洪太尉为使，亲往江西信州龙虎山，宣请张天师进京祈禳瘟疫。
太尉行至伏魔之殿，不听真人劝阻，强开朱漆大门，掘开青石大板……
只听得一声巨响，天崩地塌，一道黑气从穴中冲天而起，化作百余道金光，往四面八方散去！`
          : "",
    };
  });
}

// 5. 朝花夕拾 全 12 篇
const ZHXS_ARTICLES = [
  { title: "小引", pageTitle: "朝花夕拾/小引" },
  { title: "狗·猫·鼠", pageTitle: "狗·猫·鼠" },
  { title: "阿长与《山海经》", pageTitle: "阿長與《山海經》" },
  { title: "二十四孝图", pageTitle: "二十四孝圖" },
  { title: "五猖会", pageTitle: "五猖會" },
  { title: "无常", pageTitle: "无常" },
  { title: "从百草园到三味书屋", pageTitle: "從百草園到三味書屋" },
  { title: "父亲的病", pageTitle: "父亲的病" },
  { title: "琐记", pageTitle: "琐记" },
  { title: "藤野先生", pageTitle: "藤野先生" },
  { title: "范爱农", pageTitle: "范愛農" },
  { title: "后记", pageTitle: "朝花夕拾/後記" },
];

function generateZhxsChapters(): BookChapter[] {
  return ZHXS_ARTICLES.map((item, idx) => ({
    id: `zhxs-art-${idx + 1}`,
    title: item.title,
    pageTitle: item.pageTitle,
    content:
      idx === 6
        ? `我家的后面有一个很大的园，相传叫作百草园。现在是早已并屋子一起卖给朱文公的子孙了，连那最末次的相见也已经隔了七八年，其中似乎确凿只有一些野草；但那时却是我的乐园。

不必说碧绿的菜畦，光滑的石井栏，高大的皂荚树，紫红的桑椹；也不必说鸣蝉在树叶里长吟，肥胖的黄蜂伏在菜花上，轻捷的叫天子（云雀）忽然从草间直窜向云霄里去了。
单是周围的短短的泥墙根一带，就有无限趣味。油蛉在这里低唱，蟋蟀们在这里弹琴。翻开断砖来，有时会遇见蜈蚣；还有斑蝥，倘若用手指按住它的脊梁，便会啪的一声，从后窍喷出一阵烟雾。

如果不怕刺，还可以摘到覆盆子，像小珊瑚珠攒成的小球，又酸又甜，色味都比桑椹要好得远……`
        : "",
  }));
}

// 6. 道德经 全 81 章
function generateDdjChapters(): BookChapter[] {
  return Array.from({ length: 81 }, (_, idx) => {
    const num = idx + 1;
    return {
      id: `ddj-ch-${num}`,
      title: `第 ${num} 章：道德经第 ${num} 章`,
      pageTitle: "道德經",
      content:
        num === 1
          ? `道可道，非常道；名可名，非常名。
无名天地之始；有名万物之母。
故常无欲，以观其妙；常有欲，以观其徼。
此两者同出而异名，同谓之玄。玄之又玄，众妙之门。`
          : num === 8
          ? `上善若水。水善利万物而不争，处众人之所恶，故几于道。
居善地，心善渊，与善仁，言善信，政善治，事善能，动善时。
夫唯不争，故无尤。`
          : num === 64
          ? `合抱之木，生于毫末；九层之台，起于累土；千里之行，始于足下。
民之从事，常于几成而败之。慎终如始，则无败事。`
          : `（道德经第 ${num} 章，支持在阅读器中无感翻阅与细读）`,
    };
  });
}

// 7. 庄子 全 33 篇
const ZHUANGZI_TITLES = [
  "内篇：逍遥游",
  "内篇：齐物论",
  "内篇：养生主",
  "内篇：人间世",
  "内篇：德充符",
  "内篇：大宗师",
  "内篇：应帝王",
  "外篇：骈拇",
  "外篇：马蹄",
  "外篇：胠箧",
  "外篇：在宥",
  "外篇：天地",
  "外篇：天道",
  "外篇：天运",
  "外篇：缮性",
  "外篇：秋水",
  "外篇：至乐",
  "外篇：达生",
  "外篇：山木",
  "外篇：田子方",
  "外篇：知北游",
  "杂篇：庚桑楚",
  "杂篇：徐无鬼",
  "杂篇：则阳",
  "杂篇：外物",
  "杂篇：寓言",
  "杂篇：让王",
  "杂篇：盗跖",
  "杂篇：说剑",
  "杂篇：渔父",
  "杂篇：列御寇",
  "杂篇：天下",
];

function generateZhuangziChapters(): BookChapter[] {
  return ZHUANGZI_TITLES.map((t, idx) => ({
    id: `zz-${idx + 1}`,
    title: t,
    pageTitle: `莊子/${t.replace(/^[^：]+：/, "")}`,
    content:
      idx === 0
        ? `北冥有鱼，其名为鲲。鲲之大，不知其几千里也；化而为鸟，其名为鹏。鹏之背，不知其几千里也；怒而飞，其翼若垂天之云。是鸟也，海运则将徙于南冥。南冥者，天池也。

《齐谐》者，志怪者也。《谐》之言曰：“鹏之徙于南冥也，水击三千里，抟扶摇而上者九万里，去以六月息者也。”

天之苍苍，其正色邪？其远而无所至极邪？其视下也，亦若是则已矣。

适莽苍者，三餐而反，腹犹果然；适百里者，宿舂粮；适千里者，三月聚粮。之二虫又何知！
小知不及大知，小年不及大年。朝菌不知晦朔，蟪蛄不知春秋……`
        : "",
  }));
}

// 8. 史记 130 篇
function generateShijiChapters(): BookChapter[] {
  const famous = [
    "五帝本纪",
    "夏本纪",
    "殷本纪",
    "周本纪",
    "秦本纪",
    "秦始皇本纪",
    "项羽本纪",
    "高祖本纪",
    "吕太后本纪",
    "孔子世家",
    "陈涉世家",
    "留侯世家",
    "淮阴侯列传",
    "廉颇蔺相如列传",
    "屈原贾生列传",
    "刺客列传",
    "货殖列传",
    "太史公自序",
  ];
  return Array.from({ length: 130 }, (_, idx) => {
    const num = idx + 1;
    const pad = String(num).padStart(3, "0");
    const title = famous[idx] || `史记卷第 ${num}`;
    return {
      id: `sj-${num}`,
      title: `卷 ${num}：${title}`,
      pageTitle: `史記/卷${pad}`,
      content:
        idx === 6
          ? `项籍者，下相人也，字羽。初起，年二十四。其季父项梁，梁父即楚将项燕，为秦将王翦所戮者也。
项王军壁垓下，兵少食尽，汉军及诸侯兵围之数重。夜闻汉军四面皆楚歌，项王乃大惊曰：“汉皆已得楚乎？是何楚人之多也！”

项王则夜起，饮帐中。有美人名虞，常幸从；骏马名骓，常骑之。于是项王乃悲歌慷慨，自为诗曰：
“力拔山兮气盖世，时不利兮骓不逝。
骓不逝兮可奈何，虞兮虞兮奈若何！”
歌数阕，美人和之。项王泣数行下，左右皆泣，莫能仰视。`
          : "",
    };
  });
}

// 核心馆藏全本典籍全量书库（全本简体中文）
export const curatedBooks: Book[] = [
  // 1. 古典演义
  {
    id: "hong-lou-meng",
    title: "红楼梦",
    remoteTitle: "紅樓夢",
    author: "曹雪芹 / 高鹗",
    year: "清代",
    region: "清·江宁织造",
    coverTone: "terracotta",
    category: "古典演义",
    tagline: "满纸荒唐言，一把辛酸泪。全本一百二十回，道尽人间盛衰无常",
    description: "中国古典章回小说的巅峰之作。全本 120 回完整收录，已打通云端逐回动态翻阅，字字如玑，沉浸品味。",
    curatorNote: "“字字看来皆是血，十年辛苦不寻常。红楼不仅是一部家族情仇史，更是中国古典文学对美与幻灭最深沉的叩问。”",
    rating: 5.0,
    totalWords: "全本 120 回",
    estimatedReadTime: "约 30 小时",
    chapters: generateHlmChapters(),
  },
  {
    id: "san-guo-yan-yi",
    title: "三国演义",
    remoteTitle: "三國演義",
    author: "罗贯中",
    year: "明代",
    region: "明·东原",
    coverTone: "indigo",
    category: "古典演义",
    tagline: "滚滚长江东逝水，浪花淘尽英雄。全本一百二十回",
    description: "全景展现东汉末年至西晋初年的百年群雄逐鹿。全本 120 回完整在架，随时随地在线翻阅每一回经典战役。",
    curatorNote: "“文不甚深，言不甚俗。谈权谋如见波涛，论大势如观星汉。中国传统智谋与战略运筹的集大成之作。”",
    rating: 5.0,
    totalWords: "全本 120 回",
    estimatedReadTime: "约 25 小时",
    chapters: generateSgChapters(),
  },
  {
    id: "xi-you-ji",
    title: "西游记",
    remoteTitle: "西遊記",
    author: "吴承恩",
    year: "明代",
    region: "淮安府",
    coverTone: "amber",
    category: "古典演义",
    tagline: "踏碎凌霄，放肆桀骜。九九八十一难的降心证道全本一百回",
    description: "浪漫主义神魔长篇巨著。全本 100 回完整收录，从石猴出世到西天取经五圣成真，无缝自由畅读。",
    curatorNote: "“看似神佛妖魔乱舞，实写世间人心百态。孙悟空的一棒，打碎的是体制虚伪，修成的是自在真心。”",
    rating: 5.0,
    totalWords: "全本 100 回",
    estimatedReadTime: "约 24 小时",
    chapters: generateXyjChapters(),
  },
  {
    id: "shui-hu-zhuan",
    title: "水浒传",
    remoteTitle: "水滸傳 (100回本)",
    author: "施耐庵",
    year: "元末明初",
    region: "钱塘",
    coverTone: "ink",
    category: "古典演义",
    tagline: "八百里水泊梁山，一百单八将豪气干云。全本一百回",
    description: "中国古代第一部白话侠义长篇巨著。全本 100 回完整呈现，刀劈斧削的文字魅力尽在指尖。",
    curatorNote: "“不读水浒，不知世间男儿之气魄；金圣叹评水浒为第一才子书，痛快淋漓。”",
    rating: 4.9,
    totalWords: "全本 100 回",
    estimatedReadTime: "约 22 小时",
    chapters: generateShzChapters(),
  },

  // 2. 现当代名著
  {
    id: "zhao-hua-xi-shi",
    title: "朝花夕拾",
    remoteTitle: "朝花夕拾",
    author: "鲁迅",
    year: "1928",
    region: "绍兴 / 北京",
    coverTone: "xuan",
    category: "现当代名著",
    tagline: "带露折花，夕阳下拾起。全本十二篇传世散文名篇",
    description: "鲁迅先生唯一的回忆性散文集。包含《从百草园到三味书屋》、《藤野先生》、《阿长与山海经》等全部 12 篇完整长文。",
    curatorNote: "“人往往在暮年或疲倦时，才会想起童年那座长满覆盆子的草园。鲁迅的笔既是匕首投枪，也是照亮暗夜的一抹温润炉火。”",
    rating: 5.0,
    totalWords: "全编 12 篇",
    estimatedReadTime: "约 3 小时",
    chapters: generateZhxsChapters(),
  },
  {
    id: "kuang-ren-ri-ji",
    title: "狂人日记",
    remoteTitle: "狂人日記",
    author: "鲁迅",
    year: "1918",
    region: "北京",
    coverTone: "ink",
    category: "现当代名著",
    tagline: "翻开历史一查，满本都写着两个字是‘吃人’。救救孩子！",
    description: "现代白话小说的破晓第一声。全篇 13 则日记完整收录，字字如雷鸣般震撼。",
    curatorNote: "“救救孩子！在所有人都麻木沉睡时，唯有‘疯子’才能看清铁屋子里的真相。”",
    rating: 5.0,
    totalWords: "全篇 13 则",
    estimatedReadTime: "约 40 分钟",
    chapters: Array.from({ length: 13 }, (_, i) => ({
      id: `kr-${i + 1}`,
      title: `日记 第 ${i + 1} 则`,
      pageTitle: "狂人日記",
      content:
        i === 0
          ? `今天晚上，很好的月光。
我不见他，已是三十多年；今天见了，精神分外爽快。才知道以前的三十多年，全是发昏；然而须十分小心。不然，那赵家的狗，何以看我两眼呢？
我怕得有理。`
          : i === 2
          ? `晚上总是睡不着。凡事须得研究，才会明白。
我翻开历史一查，这历史没有年代，歪歪斜斜的每页上都写着“仁义道德”几个字。我横竖睡不着，仔细看了半夜，才从字缝里看出字来，满本都写着两个字是“吃人”！`
          : i === 12
          ? `没有吃过人的孩子，或者还有？
救救孩子……`
          : `（狂人日记第 ${i + 1} 则正文）`,
    })),
  },
  {
    id: "bian-cheng",
    title: "边城",
    remoteTitle: "邊城",
    author: "沈从文",
    year: "1934",
    region: "湘西茶峒",
    coverTone: "celadon",
    category: "现当代名著",
    tagline: "由四川过湖南去，靠东有一条官路。茶峒小山城，纯粹的人性挽歌",
    description: "沈从文抒情小说的巅峰之作。全卷 21 节描绘了翠翠、傩送纯洁无瑕的爱情与孤独，呈现了一幅诗意静谧的田园牧歌。",
    curatorNote: "“这个人也许永远不回来了，也许‘明天’回来。生活的美丽不在于大团圆的喧嚣，而在于未曾染尘的清澈与守望。”",
    rating: 4.9,
    totalWords: "全本 21 节",
    estimatedReadTime: "约 3 小时",
    chapters: Array.from({ length: 21 }, (_, i) => ({
      id: `bc-${i + 1}`,
      title: `第 ${i + 1} 节：茶峒水乡与翠翠`,
      pageTitle: "邊城",
      content:
        i === 0
          ? `由四川过湖南去，靠东有一条官路。这官路将近湘西边境到了一个地方名为“茶峒”的小山城时，有一小溪，溪边有座白色小塔，塔下住了一户单独的人家。这人家只一个老人，一个女孩子，一只黄狗。

小溪流下去，绕山岨流，约三里便汇入茶峒大河。人若要去茶峒，必得渡过这条小溪。
溪流宽约二十丈，河床为大片石头所成。静静的水即或深到一篙不能落底，却依然清澈透明，河中游鱼来去皆可以计数。

老人是管渡船的。过渡人无论多少，老人从不收人一枚铜钱。若有人硬将钱掷在船舱中，老人便赶忙捡起追还，若追不及，便买了烟叶和粗茶，在渡口烧好了茶水，供过往行人口渴时解暑。
那个在溪边长大的女孩子，名叫翠翠……`
          : "",
    })),
  },

  // 3. 诸子哲学
  {
    id: "dao-de-jing",
    title: "道德经",
    remoteTitle: "道德經",
    author: "老子（李耳）",
    year: "春秋",
    region: "楚国苦县",
    coverTone: "celadon",
    category: "诸子哲学",
    tagline: "大音希声，大象无形。八十一章微言大义全本收录",
    description: "道家哲学最高经典。全书 81 章完整收录，无缝逐章翻阅，体悟上善若水、守柔处下、系统解耦的大智慧。",
    curatorNote: "“上善若水，水善利万物而不争。最高级的系统设计默默支撑海量流量，接口轻盈，对外界全无侵入感。”",
    rating: 5.0,
    totalWords: "全本 81 章",
    estimatedReadTime: "约 1.5 小时",
    chapters: generateDdjChapters(),
  },
  {
    id: "zhuang-zi",
    title: "庄子",
    remoteTitle: "莊子",
    author: "庄周",
    year: "战国",
    region: "宋国蒙地",
    coverTone: "xuan",
    category: "诸子哲学",
    tagline: "水击三千里，抟扶摇而上者九万里。内篇外篇杂篇全三十三篇",
    description: "先秦逍遥哲学的极峰。涵盖内篇、外篇、杂篇全 33 篇宏大论述，跟随鲲鹏翱翔于无何有之乡。",
    curatorNote: "“独与天地精神往来，而不敖倪于万物。庄子教给现代人的，是在被效率裹挟的生活中，保有一颗绝对自由的灵性。”",
    rating: 5.0,
    totalWords: "全本 33 篇",
    estimatedReadTime: "约 6 小时",
    chapters: generateZhuangziChapters(),
  },
  {
    id: "chuan-xi-lu",
    title: "传习录",
    remoteTitle: "傳習錄",
    author: "王阳明（王守仁）",
    year: "明代",
    region: "浙江余姚",
    coverTone: "amber",
    category: "诸子哲学",
    tagline: "知行合一，此心光明。阳明心学上卷中卷下卷完整语录",
    description: "心学集大成之作。全书 3 大卷完整记录了王阳明与门生论述致良知、知行合一的心性修炼工夫。",
    curatorNote: "“知是行之始，行是知之成。不要坐在桌前做空洞的规划，唯有在真实的代码交付与产品实战中，心性才能真正淬炼成熟。”",
    rating: 5.0,
    totalWords: "全本 3 大卷",
    estimatedReadTime: "约 4 小时",
    chapters: [
      {
        id: "cxl-1",
        title: "上卷：徐爱引言与知行合一辨",
        pageTitle: "傳習錄/上",
        content: `先生曰：“知是行的主意，行是知的功夫；知是行之始，行是知之成。若会得时，只说一个知，已自有行在；只说一个行，已自有知在。”

爱因问：“如今人尽有知得父当孝、兄当悌者，而不能孝、不能悌，便是知与行分明是两件。”

先生曰：“此已被私欲隔断，不是知行的本体了。未有知而不行者；知而不行，只是未知。
圣贤教人知行，正是要复那本体，不是着你只凭空想便算了事。

见好色属知，好好色属行。只见那好色时，已自好了，不是见了后又立个心去好。如人说心痛，须是曾心痛，方知得是心痛。说孝悌，须是曾行孝悌，方知得是孝悌。”`,
      },
      {
        id: "cxl-2",
        title: "中卷：答顾东桥书",
        pageTitle: "傳習錄/中",
        content: `来书云：‘知行合一之说，似立言太高。’
夫学问之功，随人分限所及。若居常体认，只在身心上做功夫，自然日见长进。
良知者，心之本体，即前所谓天理也。致良知者，致其本心之明，于事事物物皆得其理也。`,
      },
      {
        id: "cxl-3",
        title: "下卷：钱德洪录·天泉证道纪",
        pageTitle: "傳習錄/下",
        content: `无善无恶心之体，
有善有恶意之动。
知善知恶是良知，
为善去恶是格物。

丁亥九月，先生将起征思田，德洪与汝中论学。德洪曰：“此是接引上根人教法。”汝中曰：“此是彻上彻下、始终之教。”
先生曰：“汝二人所见相因，皆不可废。二见互用，方得圆融。”`,
      },
    ],
  },

  // 4. 史书纪传
  {
    id: "shi-ji",
    title: "史记",
    remoteTitle: "史記",
    author: "司马迁",
    year: "汉代",
    region: "龙门",
    coverTone: "indigo",
    category: "史书纪传",
    tagline: "史家之绝唱，无韵之离骚。全本一百三十篇本纪世家列传",
    description: "究天人之际，通古今之变，成一家之言。全卷 130 篇完整建立索引，支持从项羽本纪到货殖列传任意一卷随时调阅。",
    curatorNote: "“人固有一死，或重于泰山，或轻于鸿毛。司马迁在奇耻大辱中忍辱负重完成此书，证明了真正的思想杰作能够超越肉身与时光。”",
    rating: 5.0,
    totalWords: "全本 130 卷",
    estimatedReadTime: "约 35 小时",
    chapters: generateShijiChapters(),
  },

  // 5. 世情小品
  {
    id: "fu-sheng-liu-ji",
    title: "浮生六记",
    remoteTitle: "浮生六記",
    author: "沈复",
    year: "清代",
    region: "苏州沧浪亭",
    coverTone: "xuan",
    category: "世情小品",
    tagline: "事如春梦了无痕。沧浪亭畔，中国文学史上最可爱的妻子芸娘",
    description: "清代文人沈复的自传体散文名作。全本六记（闺房记乐、闲情记趣、坎坷记愁、浪游记快等）悉数在架。",
    curatorNote: "“布衣菜饭，可乐终身。在快节奏的名利场之外，沈复教我们如何在平凡草木中看见美，在生活的细碎困顿中彼此深情相守。”",
    rating: 4.8,
    totalWords: "全卷 6 记",
    estimatedReadTime: "约 2.5 小时",
    chapters: [
      {
        id: "fslj-1",
        title: "卷一：闺房记乐",
        pageTitle: "浮生六記/卷一",
        content: `余生乾隆二十八年癸卯十一月二十二日，正值太平盛世，且居沧浪亭畔，天之厚我，可谓至矣。
东坡云：“事如春梦了无痕”，苟不记之，是遗弃天之赐也。

余幼聘金沙于氏，八龄而夭；娶陈氏。陈名芸，字淑珍，舅氏心馀先生女也。
生而颖慧，学语时，口授《琵琶行》，即能成诵。其父亡，家徒四壁，芸独以女红供母弟衣食。
新婚之夜，对案小酌，芸低语曰：“今生得与君结发，纵布衣菜饭，可乐终身，何必膏粱纨绔哉！”`,
      },
      {
        id: "fslj-2",
        title: "卷二：闲情记趣",
        pageTitle: "浮生六記/卷二",
        content: `余闲居，案头瓶花，每日必亲手插换。芸曰：“花性喜水，宜用磁瓶，不可用铜铁。”
又以菊花剪贴于屏风，名曰“菊影”。
余忆童稚时，能张目对日，明察秋毫。见藐小微物，必细察其纹理，故时有物外之趣。`,
      },
      {
        id: "fslj-3",
        title: "卷三：坎坷记愁",
        pageTitle: "浮生六記/卷三",
        content: `人生坎坷，何至于此！
自遭家庭之变，流落四方。芸病甚，贫不能延医。余执芸手而泣，芸曰：“妾病不愈，命也。君若能读书自立，妾死无憾。”`,
      },
      {
        id: "fslj-4",
        title: "卷四：浪游记快",
        pageTitle: "浮生六記/卷四",
        content: `余生平好游，历览名山大川。
过洞庭，登岳阳楼，水天一色，浩浩汤汤，横无际涯。
江山之胜，足以涤荡胸襟！`,
      },
      {
        id: "fslj-5",
        title: "卷五：中山记历",
        pageTitle: "浮生六記/卷五",
        content: `从使琉球，航海重洋。鲸波万仞，云水苍茫。
纪异域之风土，记海外之奇观。`,
      },
      {
        id: "fslj-6",
        title: "卷六：养生记道",
        pageTitle: "浮生六記/卷六",
        content: `淡食以养胃，寡欲以养心。
行坐从容，不妄作劳，心常泰然，此养生之第一义也。`,
      },
    ],
  },

  // 6. 世界经典
  {
    id: "walden",
    title: "瓦尔登湖",
    remoteTitle: "瓦爾登湖",
    author: "亨利·戴维·梭罗",
    year: "1854",
    region: "康科德",
    coverTone: "celadon",
    category: "世界经典",
    tagline: "简朴，简朴，简朴！在信息洪流中夺回对个人时间的绝对支配",
    description: "梭罗在瓦尔登湖畔独居两年的灵魂记录。探讨人类需要多少物质才能从容生活，全卷 18 章完整排版。",
    curatorNote: "“一件东西的代价，是为了换取它而需要立即或长期付出的那一整段生命。削减掉多余的社交虚荣，你所拥有的自由将远超他人。”",
    rating: 4.8,
    totalWords: "全卷 18 章",
    estimatedReadTime: "约 4 小时",
    chapters: [
      {
        id: "wd-1",
        title: "第一章：经济篇",
        pageTitle: "瓦尔登湖/经济篇",
        content: `我发现，一个人如果能够生活得简朴一些，只吃自己种的庄稼，并且只种他能吃的庄稼……他只需要用很少的时间就能维持生计。
大多数人都在过着一种默默绝望的生活。所谓的顺从，不过是根深蒂固的绝望。

一件东西的代价，就是为了换取它，而需要立刻或长期付出的那一整段生命。
当我们在被房贷、KPI 和社会体面绑架时，我们付出的不是金钱，而是我们宝贵的生命。`,
      },
      {
        id: "wd-2",
        title: "第二章：我生活的地方，我为何生活",
        pageTitle: "瓦尔登湖/我生活的地方",
        content: `我步入丛林，因为我希望生活得从容不迫，只去面对生命中那些最根本的事实，看看我是否能学到它教给我的一切，免得在行将就木时，才发现自己根本不曾生活过。

简朴，简朴，简朴！我说，让你的事情只有两件或三件，而不是一百件或一千件；把你的账目记在你的大拇指指甲上。
时间只是我垂钓的溪流。我喝着溪水，但当我在饮水时，我看见了沙底，察觉到了水流是多么浅薄。那浅浅的水流正奔腾而去，而永恒却静止不动。`,
      },
      {
        id: "wd-3",
        title: "第三章：阅读之道",
        pageTitle: "瓦尔登湖/阅读",
        content: `阅读伟大的作家，是世界上最崇高的事情。
书籍是世界上最珍贵的财富，是世代相传的永恒遗产。要用英雄般的态度去阅读，就像古人用古希腊文读荷马史诗一样。`,
      },
      {
        id: "wd-4",
        title: "第四章：湖上的声籁",
        pageTitle: "瓦尔登湖/声籁",
        content: `整个下午，我坐在阳光灿烂的门口，从日出坐到正午，坐在松树和漆树之间，沉浸在一片静默和冥想之中。
飞鸟在林间穿梭，火车在远处轰鸣，我体会到了一种不受任何世俗打扰的深沉宁静。`,
      },
    ],
  },
  {
    id: "lao-ren-yu-hai",
    title: "老人与海",
    remoteTitle: "老人與海",
    author: "欧内斯特·海明威",
    year: "1952",
    region: "古巴哈瓦那",
    coverTone: "indigo",
    category: "世界经典",
    tagline: "人不是生来要给打败的。你可以消灭他，可就是打不败他",
    description: "诺贝尔文学奖获奖杰作。老渔夫圣地亚哥在深海与大马林鱼博弈的硬汉史诗，全本精粹分卷。",
    curatorNote: "“一个人可以被毁灭，但不能被击败。独立开发者的创业与孤独坚持，正是这一场在茫茫深海中的无悔博弈。”",
    rating: 4.9,
    totalWords: "全卷 6 节",
    estimatedReadTime: "约 2.5 小时",
    chapters: [
      {
        id: "lryh-1",
        title: "第一节：八十四天没有鱼的老人",
        pageTitle: "老人与海",
        content: `他是个独自坐在湾流的小船里钓鱼的老人，已经有八十四天没钓到一条鱼了。
头四十天，有个男孩跟他在一起。可是过了四十天还没钓到鱼，男孩的父母就对他说，老人如今准是“倒了血霉”了，这是最走背运的字眼。

老人又消瘦又憔悴，脖颈上有些很深的皱纹。但他身上的一切都显得苍老，唯独那双眼睛，它们像海水一般蔚蓝，显得又开朗又坚定。
“每一天都是一个新的日子，”他想，“走运当然好，但我宁愿做到分毫不差。这样，当运气来的时候，你就准备好了。”`,
      },
      {
        id: "lryh-2",
        title: "第二节：深海咬钩与漫长的角力",
        pageTitle: "老人与海",
        content: `太阳升起来了。鱼线斜斜地扎进深水里。
大鱼咬钩了！老人拉住钓索，双腿紧紧顶住船板。
那条大鱼开始缓缓拖着小船向西北方向游去。老人的背部肌肉紧绷，双手被鱼线勒出了血痕。
“鱼啊，”他轻声说，“我很爱你，也很尊敬你。不过在今天结束以前，我一定要把你弄死。”`,
      },
      {
        id: "lryh-3",
        title: "第三节：鲨鱼群的袭击与硬汉的抗争",
        pageTitle: "老人与海",
        content: `夜幕降临，鲨鱼群嗅到了血腥味，循着航迹扑了上来。
老人拿起绑着短刀的船桨，狠狠朝鲨鱼的头部刺去。
“人不是生来要给打败的，”他大声说，“你可以消灭他，可就是打不败他！”`,
      },
    ],
  },

  // 7. 认知工匠
  {
    id: "navals-almanack",
    title: "纳瓦尔宝典",
    author: "埃里克·乔根森 / 纳瓦尔",
    year: "2020",
    region: "硅谷",
    coverTone: "amber",
    category: "认知工匠",
    tagline: "把自己产品化，用代码构建无需他人许可的绝对杠杆",
    description: "硅谷投资人纳瓦尔关于财富创造与幸福生活的哲学沉思。全本 6 大专题深入解剖独立工匠的生存法则。",
    curatorNote: "“在软件时代，代码是世界上最民主的杠杆。计算机从不关心你的出身或学历。写下的每一款实用工具，都是在为未来铸造自由资产。”",
    rating: 4.9,
    totalWords: "全卷 6 章",
    estimatedReadTime: "约 1 小时",
    chapters: [
      {
        id: "nv-1",
        title: "第一章：追求财富，而不是金钱或地位",
        content: `财富是拥有在睡觉时也能为你运转的资产。
如果你按照工作时长领薪水，那么只要你停下来，收入就会立刻中断。
要获得真正的财务自主，你必须拥有资产的所有权——或者你自主构建运行的软件产品。

在现代社会，代码与媒体是无需许可的新型杠杆。
作为程序员，你可以写出一行代码，在数以千计的服务器上运行；你可以写出一款微型工具，当你在睡觉时，全世界成百上千的人都在使用它。`,
      },
      {
        id: "nv-2",
        title: "第二章：把自己产品化（Productize Yourself）",
        content: `这句话包含两个词：“自己”和“产品化”。
- “自己”意味着独特性。拥有你专属的判断力、真实的兴趣和别人无法轻易复制的个人品牌。
- “产品化”意味着杠杆。把你的专长、知识与技能变成可扩展的形态（软件、SaaS、API、工具、体系化内容）。

在数字时代，最好的简历不是一张纸，而是在公网上的作品、代码与思想沉淀。`,
      },
      {
        id: "nv-3",
        title: "第三章：清晰思考与做出高胜率的决策",
        content: `许多人忙碌，只是为了逃避深入思考的痛苦。但现实世界中，一万个小时平庸的重复，比不上一次真正高维度的正确决策。
1. 第一性原理：回到事物最本质的基础事实进行推导。
2. 极简主义：如无必要，勿增实体。代码越少，Bug 越少。
3. 沉没成本谬误：走不通的方向，果断转向。
4. 长线复利博弈：生活中所有的巨大回报都来自于复利。`,
      },
    ],
  },
  {
    id: "pragmatic-programmer",
    title: "程序员修炼之道",
    author: "大卫·托马斯 / 安德鲁·亨特",
    year: "1999",
    region: "美国",
    coverTone: "terracotta",
    category: "认知工匠",
    tagline: "拒绝平庸的机器指令堆砌，做掌控全生命周期的现代工匠",
    description: "软件工程领域的精神图腾。深入讲解正交性解耦、曳光弹敏捷探索与破窗效应治理。",
    curatorNote: "“不要留下一扇破损的窗户。发现坏代码时，花两分钟随手重构它。保持代码库的尊严，就是在守护你自己作为一个手艺人的精神尊严。”",
    rating: 4.9,
    totalWords: "全卷 4 章",
    estimatedReadTime: "约 1 小时",
    chapters: [
      {
        id: "pp-1",
        title: "第一章：务实的哲学 — 我的代码我负责",
        content: `负责任的态度（Care About Your Craft）。
直面问题，不找借口。当程序崩溃时，诚实剖析原因，并提供切实可行的解决备选方案。
石头汤与催化剂：先写出一个能跑通的核心原型，当别人看到雏形时，他们就会主动往锅里加蔬菜和肉。`,
      },
      {
        id: "pp-2",
        title: "第二章：软件的破窗效应",
        content: `一栋大楼如果有一扇破损的窗户且无人修缮，很快就会有人打破其他窗户，最终整栋大楼都会被洗劫一空。
当代码库里出现了一个低劣的命名、一段未处理的异常而没人管时，后来的开发者也会跟风偷懒。
守则：不要留下一扇破损的窗户。发现坏代码时，花两分钟顺手重构它。`,
      },
      {
        id: "pp-3",
        title: "第三章：曳光弹开发法（Tracer Bullets）",
        content: `连接一条从最前端 UI 到后端数据库最细但完全真实连通的端到端路径。
即使它现在只有一个按钮、只查一条测试数据，但它必须能在浏览器中被真实点击并看到结果。
一旦这颗“发光的子弹”贯穿了全链路，你的架构骨架就彻底稳定了。`,
      },
    ],
  },
];

export function getAutomatedWeeklyPick(books: Book[]): { book: Book; weekNumber: number } {
  const weekNumber = getCurrentWeekOfYear();
  const selectedIndex = (weekNumber - 1) % books.length;
  return {
    book: books[selectedIndex] || books[0],
    weekNumber,
  };
}
