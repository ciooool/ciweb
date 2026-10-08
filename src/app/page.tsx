'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ProjectsSection from '@/components/ProjectsSection';
import BookshelfSection from '@/components/BookshelfSection';
import { InteractiveLab } from '@/components/InteractiveLab';
import { ContactSection } from '@/components/ContactSection';
import Footer from '@/components/Footer';
import LampPullRig from '@/components/LampPullRig';
import AmbientBackground from '@/components/AmbientBackground';
import StreetCanvas from '@/components/StreetCanvas';

export default function Home() {
  const [lampOpen, setLampOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const hasSeen = sessionStorage.getItem('ciooool_lamp_intro_done');
      if (!hasSeen) {
        setLampOpen(true);
      }
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  const handleCloseLamp = () => {
    setLampOpen(false);
    try {
      sessionStorage.setItem('ciooool_lamp_intro_done', 'true');
    } catch {}
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300 overflow-x-hidden selection:bg-[var(--phosphor)] selection:text-[var(--bg-base)]">
      {/* 1. 自适应全屏环境背景 (极光 + 星空画布 + 微光网格) */}
      <AmbientBackground />

      {/* 2. 拟真物理拉绳吊灯组件 (开场沉浸式体验 / 顶栏可随时重温) */}
      {isClient && (
        <LampPullRig
          isOpen={lampOpen}
          onClose={handleCloseLamp}
        />
      )}

      {/* 3. 悬浮极简顶栏 (昼夜切换 / 物理拉灯 / 音效开关 / 快速导航) */}
      <Navbar onOpenLamp={() => setLampOpen(true)} />

      {/* 4. 核心内容板块 */}
      <main className="flex-1 relative z-10">
        {/* 01. 首屏价值宣言与工程账本 */}
        <Hero />

        {/* 02. 主理人自白、造物法则与主力技术栈 */}
        <AboutSection />

        {/* 03. 独立作品工坊实战项目 */}
        <ProjectsSection />

        {/* 04. 殿堂级精选著作认知书房 (腾讯官方微信读书 200 OK 直达) */}
        <BookshelfSection />

        {/* 05. 案头工程微工具 (JSON转Go / 高熵Token生成) */}
        <InteractiveLab />

        {/* 06. 见字如面全渠道联络 */}
        <ContactSection />

        {/* 07. 底部横向赛博都市天际线与穿梭车流 */}
        <StreetCanvas />
      </main>

      {/* 5. 极简页脚 */}
      <Footer />
    </div>
  );
}
