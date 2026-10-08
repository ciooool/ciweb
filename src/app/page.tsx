"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ZenLibrary from "@/components/ZenLibrary";
import QuoteCardStudio from "@/components/QuoteCardStudio";
import ProjectShowcase from "@/components/ProjectShowcase";
import InteractiveTool from "@/components/InteractiveTool";
import AboutAndContact from "@/components/AboutAndContact";
import Footer from "@/components/Footer";
import CyberLampIntro from "@/components/CyberLampIntro";
import CyberBackground from "@/components/CyberBackground";

export default function Home() {
  // 默认开启，保证首屏直接渲染沉浸式暗室吊灯，避免白屏闪烁
  const [lampOpen, setLampOpen] = useState(true);

  useEffect(() => {
    try {
      const hasSeen = sessionStorage.getItem("ciooool_lamp_intro_done");
      if (hasSeen === "true") {
        setLampOpen(false);
      }
    } catch {
      // Ignore private browsing error
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans relative bg-[#05070F] text-[#EAF0FF]">
      {/* 赛博朋克深空背景：流动双色极光 + 星辰画布 + 微光网格 (Omar Fawzy 风格) */}
      <CyberBackground />

      {/* 可拖拽物理拉绳吊灯开场动画 (Omar Fawzy 风格) */}
      <CyberLampIntro
        isOpen={lampOpen}
        onClose={() => setLampOpen(false)}
      />

      {/* 顶部全局导航 (含拉灯重温、音效开关、日/夜间主题切换) */}
      <Navbar onOpenLamp={() => setLampOpen(true)} />

      <main className="flex-1 relative z-10">
        {/* 1. Hero 价值宣言：代码与阅读双轮驱动 */}
        <Hero />

        {/* 2. ZenLib 沉浸式数字禅房 (藏书阁、在线阅读器、本周精选) */}
        <ZenLibrary />

        {/* 3. QuoteCraft 灵感金句卡片工坊 */}
        <QuoteCardStudio />

        {/* 4. 独立产品工坊与实战案例 (SaaS/微工具/开源项目) */}
        <ProjectShowcase />

        {/* 5. 在线即时交互开发工具 (DevForge: JSON转Go / Token生成器) */}
        <InteractiveTool />

        {/* 6. 关于我与全渠道联系转化 */}
        <AboutAndContact />
      </main>

      {/* 底部版权 */}
      <Footer />
    </div>
  );
}
