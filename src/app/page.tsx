'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import BookshelfSection from '@/components/BookshelfSection';
import { ContactSection } from '@/components/ContactSection';
import Footer from '@/components/Footer';
import LampPullRig from '@/components/LampPullRig';
import MiniPendantLamp from '@/components/MiniPendantLamp';
import AmbientBackground from '@/components/AmbientBackground';
import StreetCanvas from '@/components/StreetCanvas';
import QuickToolsDrawer from '@/components/QuickToolsDrawer';

export default function Home() {
  const [lampOpen, setLampOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const isNoLamp = typeof window !== 'undefined' && window.location.search.includes('nolamp');
      const hasSeen = sessionStorage.getItem('ciooool_lamp_intro_done') || isNoLamp;
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

      {/* 2. 拟真物理拉绳吊灯组件 (大帷幕开场沉浸式体验 / 随时逆向放下幕布) */}
      {isClient && (
        <LampPullRig
          isOpen={lampOpen}
          onClose={handleCloseLamp}
        />
      )}

      {/* 3. 屏幕右上角常驻微型金属拉线吊灯 (帷幕拉开后常驻发光，拉一下关闭并放下幕布) */}
      {isClient && !lampOpen && (
        <MiniPendantLamp
          onPull={() => setLampOpen(true)}
          isLit={true}
        />
      )}

      {/* 4. 悬浮极简顶栏 (昼夜切换 / 物理拉灯 / 音效开关 / 快捷工具 ⌘K / 快速导航) */}
      <Navbar onOpenLamp={() => setLampOpen(true)} />

      {/* 5. 核心内容板块 (已精简移除案头工具占位，页面更为纯粹克制) */}
      <main className="flex-1 relative z-10">
        {/* 01. 首屏价值宣言与工程账本 */}
        <Hero />

        {/* 02. 主理人自白、造物法则与主力技术栈 */}
        <AboutSection />

        {/* 03. 殿堂级精选著作认知书房 (腾讯官方微信读书 200 OK 直达) */}
        <BookshelfSection />

        {/* 05. 见字如面全渠道联络 */}
        <ContactSection />

        {/* 06. 底部横向赛博都市天际线与穿梭车流 */}
        <StreetCanvas />
      </main>

      {/* 6. 隐藏式快捷工具组件 (支持 ⌘K 全局唤醒与顶栏直达，对标 123.haiwell.com) */}
      {isClient && <QuickToolsDrawer isCurtainClosed={lampOpen} />}

      {/* 7. 极简页脚 */}
      <Footer />
    </div>
  );
}
