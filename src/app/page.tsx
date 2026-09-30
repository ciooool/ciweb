import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProjectShowcase from "@/components/ProjectShowcase";
import InteractiveTool from "@/components/InteractiveTool";
import ServicesSection from "@/components/ServicesSection";
import PlaybookSection from "@/components/PlaybookSection";
import AboutAndContact from "@/components/AboutAndContact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* 顶部全局导航 */}
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero 价值宣言主展区 */}
        <Hero />

        {/* 2. 独立产品工坊与实战案例 */}
        <ProjectShowcase />

        {/* 3. 在线即时交互微工具 (DevForge) */}
        <InteractiveTool />

        {/* 4. 商业服务交付与技术咨询 */}
        <ServicesSection />

        {/* 5. 技术深度复盘与洞察专栏 */}
        <PlaybookSection />

        {/* 6. 关于我与全渠道联系转化 */}
        <AboutAndContact />
      </main>

      {/* 底部版权与 Slogan */}
      <Footer />
    </div>
  );
}
