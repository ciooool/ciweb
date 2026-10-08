"use client";

import React, { useState } from "react";
import { siteConfig } from "@/data/siteConfig";
import { Menu, X } from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EAE6DF] dark:border-[#2C2A28] bg-[#FAF8F5]/90 dark:bg-[#181716]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand / Logo (极简典雅宋体签名) */}
        <a href="#" className="flex items-center gap-2.5 group">
          <span className="font-serif text-lg tracking-wider text-[#1F1E1D] dark:text-[#EDE9E3] font-medium group-hover:opacity-80 transition-opacity">
            {siteConfig.personal.name}
          </span>
          <span className="text-[10px] font-mono tracking-widest text-[#948F86] uppercase border-l border-[#D5CEBF] dark:border-[#38342E] pl-2.5">
            Atelier
          </span>
        </a>

        {/* Desktop Nav (文学排版，克制素雅) */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-serif tracking-widest text-[#6B6760] dark:text-[#A8A49C]">
          <a
            href="#library"
            className="hover:text-[#1F1E1D] dark:hover:text-[#EDE9E3] transition-colors"
          >
            心智书房
          </a>
          <a
            href="#projects"
            className="hover:text-[#1F1E1D] dark:hover:text-[#EDE9E3] transition-colors"
          >
            独立作品
          </a>
          <a
            href="#interactive-tool"
            className="hover:text-[#1F1E1D] dark:hover:text-[#EDE9E3] transition-colors"
          >
            在线微工具
          </a>
          <a
            href="#quotecraft"
            className="hover:text-[#1F1E1D] dark:hover:text-[#EDE9E3] transition-colors"
          >
            金句工坊
          </a>
          <a
            href="#playbook"
            className="hover:text-[#1F1E1D] dark:hover:text-[#EDE9E3] transition-colors"
          >
            实战复盘
          </a>
          <a
            href="#contact"
            className="hover:text-[#1F1E1D] dark:hover:text-[#EDE9E3] transition-colors"
          >
            致友
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          <a
            href={siteConfig.personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-[#6B6760] hover:text-[#1F1E1D] dark:text-[#A8A49C] dark:hover:text-white transition-colors"
            title="GitHub"
          >
            <GithubIcon className="h-4 w-4" />
          </a>

          <a
            href="#contact"
            className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-[#D5CEBF] dark:border-[#38342E] text-xs font-serif tracking-wider text-[#1F1E1D] dark:text-[#EDE9E3] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            <span>书信联络</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#6B6760] hover:text-[#1F1E1D] dark:text-[#A8A49C] dark:hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#EAE6DF] dark:border-[#2C2A28] bg-[#FAF8F5] dark:bg-[#181716] px-4 py-6 font-serif space-y-4 text-sm tracking-wider">
          <a
            href="#library"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#6B6760] dark:text-[#A8A49C] hover:text-[#1F1E1D]"
          >
            心智书房
          </a>
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#6B6760] dark:text-[#A8A49C] hover:text-[#1F1E1D]"
          >
            独立作品
          </a>
          <a
            href="#interactive-tool"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#6B6760] dark:text-[#A8A49C] hover:text-[#1F1E1D]"
          >
            在线微工具
          </a>
          <a
            href="#quotecraft"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#6B6760] dark:text-[#A8A49C] hover:text-[#1F1E1D]"
          >
            金句工坊
          </a>
          <a
            href="#playbook"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#6B6760] dark:text-[#A8A49C] hover:text-[#1F1E1D]"
          >
            实战复盘
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#6B6760] dark:text-[#A8A49C] hover:text-[#1F1E1D]"
          >
            致友
          </a>
        </div>
      )}
    </header>
  );
}
