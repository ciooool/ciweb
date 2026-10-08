"use client";

import React, { useState } from "react";
import { siteConfig } from "@/data/siteConfig";
import { Menu, X, Lightbulb, Volume2, VolumeX } from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import ThemeToggle from "@/components/ThemeToggle";
import { soundManager } from "@/utils/audio";

interface NavbarProps {
  onOpenLamp?: () => void;
}

export default function Navbar({ onOpenLamp }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1F2A4D]/80 bg-[#05070F]/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand / Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5CF2C4] shadow-[0_0_10px_#5CF2C4] animate-pulse" />
          </div>
          <span className="font-mono text-base tracking-wider text-[#EAF0FF] font-semibold group-hover:text-[#5CF2C4] transition-colors">
            {siteConfig.personal.name}
          </span>
          <span className="text-[10px] font-mono tracking-widest text-[#8B7BFF] uppercase border-l border-[#1F2A4D] pl-2.5 py-0.5">
            Dev & Mind
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono tracking-wider text-[#9FB0D0]">
          <a
            href="#library"
            className="hover:text-[#5CF2C4] transition-colors"
          >
            心智书房
          </a>
          <a
            href="#projects"
            className="hover:text-[#5CF2C4] transition-colors"
          >
            独立作品
          </a>
          <a
            href="#interactive-tool"
            className="hover:text-[#5CF2C4] transition-colors"
          >
            微工具
          </a>
          <a
            href="#quotecraft"
            className="hover:text-[#5CF2C4] transition-colors"
          >
            金句工坊
          </a>
          <a
            href="#playbook"
            className="hover:text-[#5CF2C4] transition-colors"
          >
            实战复盘
          </a>
          <a
            href="#contact"
            className="hover:text-[#5CF2C4] transition-colors"
          >
            联络
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* 拉灯体验彩蛋按钮 */}
          {onOpenLamp && (
            <button
              onClick={() => {
                soundManager.playLampSwitch();
                onOpenLamp();
              }}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#1F2A4D] bg-[#0A0E1A] hover:border-[#5CF2C4]/70 text-[#9FB0D0] hover:text-[#5CF2C4] text-xs font-mono transition-all shadow-xs"
              title="重新进入暗室拉绳点灯"
            >
              <Lightbulb className="w-3.5 h-3.5 text-[#8B7BFF] group-hover:text-[#5CF2C4] transition-colors" />
              <span>拉灯体验</span>
            </button>
          )}

          {/* 音效控制按钮 */}
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-full border border-[#1F2A4D] bg-[#0A0E1A] text-[#9FB0D0] hover:text-[#5CF2C4] hover:border-[#5CF2C4]/50 transition-all"
            title={isMuted ? "已静音（点击开启）" : "音效已开启（点击静音）"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <ThemeToggle />

          <a
            href={siteConfig.personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full border border-[#1F2A4D] bg-[#0A0E1A] text-[#9FB0D0] hover:text-white hover:border-[#5CF2C4]/50 transition-colors"
            title="GitHub"
          >
            <GithubIcon className="h-3.5 w-3.5" />
          </a>

          <a
            href="#contact"
            className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-[#5CF2C4]/50 bg-[#5CF2C4]/10 text-xs font-mono tracking-wider text-[#5CF2C4] hover:bg-[#5CF2C4]/20 hover:shadow-[0_0_15px_rgba(92,242,196,0.3)] transition-all"
          >
            <span>交流造物</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {onOpenLamp && (
            <button
              onClick={onOpenLamp}
              className="p-2 rounded-lg text-[#5CF2C4] hover:bg-[#5CF2C4]/10"
              title="拉灯体验"
            >
              <Lightbulb className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#9FB0D0] hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#1F2A4D] bg-[#0A0E1A] px-4 py-6 font-mono space-y-4 text-sm tracking-wider">
          <a
            href="#library"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#9FB0D0] hover:text-[#5CF2C4]"
          >
            心智书房
          </a>
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#9FB0D0] hover:text-[#5CF2C4]"
          >
            独立作品
          </a>
          <a
            href="#interactive-tool"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#9FB0D0] hover:text-[#5CF2C4]"
          >
            在线微工具
          </a>
          <a
            href="#quotecraft"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#9FB0D0] hover:text-[#5CF2C4]"
          >
            金句工坊
          </a>
          <a
            href="#playbook"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#9FB0D0] hover:text-[#5CF2C4]"
          >
            实战复盘
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#9FB0D0] hover:text-[#5CF2C4]"
          >
            交流造物
          </a>
        </div>
      )}
    </header>
  );
}
