import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ZenLibrary from "@/components/ZenLibrary";
import QuoteCardStudio from "@/components/QuoteCardStudio";
import ProjectShowcase from "@/components/ProjectShowcase";
import InteractiveTool from "@/components/InteractiveTool";
import ServicesSection from "@/components/ServicesSection";
import PlaybookSection from "@/components/PlaybookSection";
import AboutAndContact from "@/components/AboutAndContact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* 顶部全局导航 (含日/夜间主题切换) */}
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero 价值宣言：代码与阅读双轮驱动 */}
        <Hero />

        {/* 2. ZenLib 沉浸式数字禅房 (免费藏书阁、在线阅读器、本周精选、本地拖拽阅读) */}
        <ZenLibrary />

        {/* 3. QuoteCraft 灵感金句卡片工坊 (自研专属微工具，杂志级排版，社交裂变) */}
        <QuoteCardStudio />

        {/* 4. 独立产品工坊与实战案例 (SaaS/微工具/开源项目) */}
        <ProjectShowcase />

        {/* 5. 在线即时交互开发工具 (DevForge: JSON转Go / Token生成器) */}
        <InteractiveTool />

        {/* 6. 商业服务交付与技术咨询 (MVP敏捷交付 / 高并发优化 / 自动化工具) */}
        <ServicesSection />

        {/* 7. 技术深度复盘与洞察专栏 */}
        <PlaybookSection />

        {/* 8. 关于我与全渠道联系转化 */}
        <AboutAndContact />
      </main>

      {/* 底部版权与 Slogan */}
      <Footer />
    </div>
  );
}
