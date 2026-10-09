"use client";

import React, { useState } from "react";
import { portfolioData } from "@/data/portfolioData";
import { useTheme } from "@/context/ThemeContext";
import { soundManager } from "@/utils/audio";
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Lightbulb,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";

interface NavbarProps {
  onOpenLamp?: () => void;
}

export default function Navbar({ onOpenLamp }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleToggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
    if (!next) soundManager.playClick();
  };

  const handleThemeChange = () => {
    soundManager.playClick();
    toggleTheme();
  };

  const navLinks = [
    { href: "#about", label: "关于主理" },
    { href: "#projects", label: "独立作品" },
    { href: "#books", label: "心智书房" },
    { href: "#skills", label: "技术栈" },
    { href: "#tools", label: "案头工具" },
    { href: "#contact", label: "见字如面" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-theme-line backdrop-blur-md transition-colors"
      style={{ backgroundColor: "var(--navbar-bg)" }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-theme-phosphor shadow-[0_0_10px_var(--phosphor)] animate-pulse" />
          </div>
          <span className="font-mono text-base tracking-wider text-theme-primary font-bold group-hover:text-theme-phosphor transition-colors">
            {portfolioData.personal.name}
          </span>
          <span className="text-[10px] font-mono tracking-widest text-theme-secondary uppercase border-l border-theme-line pl-2.5 py-0.5 hidden sm:inline-block">
            Architect & Maker
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono tracking-wider text-theme-secondary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-theme-phosphor transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* 1. 拉灯体验 */}
          {onOpenLamp && (
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenLamp();
              }}
              className="p-2 rounded-xl border border-theme-line hover:border-theme-phosphor text-theme-secondary hover:text-theme-phosphor transition-all bg-theme-surface/50 cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-mono"
              title="进入暗室拉灯体验"
            >
              <Lightbulb className="w-3.5 h-3.5 text-theme-phosphor" />
              <span>拉灯</span>
            </button>
          )}

          {/* 2. Web Audio 原生合成音效开关 */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-xl border border-theme-line hover:border-theme-phosphor text-theme-secondary hover:text-theme-phosphor transition-all bg-theme-surface/50 cursor-pointer"
            title={isMuted ? "开启环境音效" : "静音"}
            aria-label="Sound Toggle"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {/* 3. 真实有效的白天/黑夜主题切换 */}
          <button
            onClick={handleThemeChange}
            className="p-2 rounded-xl border border-theme-line hover:border-theme-violet text-theme-secondary hover:text-theme-violet transition-all bg-theme-surface/50 cursor-pointer relative group"
            title={theme === "dark" ? "切换为日间明亮模式" : "切换为极夜深色模式"}
            aria-label={theme === "dark" ? "切换为白天浅色模式" : "切换为极夜深色模式"}
            data-testid="theme-toggle"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform group-hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 rotate-0 transition-transform group-hover:-rotate-12" />
            )}
          </button>

          {/* 4. GitHub 链接 */}
          <a
            href={portfolioData.personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl border border-theme-line hover:border-theme-phosphor text-theme-secondary hover:text-theme-primary transition-all bg-theme-surface/50 hidden sm:inline-flex"
            title="GitHub 个人主页"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          {/* 5. 立即联络 CTA 胶囊按钮 */}
          <a
            href="#contact"
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-theme-phosphor text-[#070a13] text-xs font-mono font-bold hover:opacity-90 hover:shadow-[0_0_15px_var(--phosphor)] transition-all ml-1 shadow-sm cursor-pointer"
          >
            <span>联络</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* 移动端汉堡菜单 */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-theme-line text-theme-secondary hover:text-theme-primary transition-colors ml-1 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* 移动端菜单抽屉 */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-theme-line bg-theme-surface px-6 py-6 font-mono space-y-4 text-sm tracking-wider shadow-xl animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-theme-secondary hover:text-theme-phosphor py-1 transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}
          {onOpenLamp && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLamp();
              }}
              className="flex items-center gap-2 text-theme-phosphor pt-2 border-t border-theme-line w-full text-left cursor-pointer"
            >
              <Lightbulb className="w-4 h-4" />
              <span>拉灯开场体验</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
