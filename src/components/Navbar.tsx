"use client";

import React, { useState } from "react";
import { siteConfig } from "@/data/siteConfig";
import { Terminal, Menu, X, ArrowUpRight, BookOpen } from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80 transition-colors">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm transition-transform group-hover:scale-105">
            <Terminal className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-white flex items-center gap-1.5">
              {siteConfig.personal.name}
              <span className="text-xs font-mono font-normal px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                .dev
              </span>
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <a href="#library" className="hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
            <BookOpen className="h-4 w-4" />
            <span>数字书房</span>
          </a>
          <a href="#projects" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            作品工坊
          </a>
          <a href="#interactive-tool" className="hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1">
            <span>在线工具</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </a>
          <a href="#services" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            服务与咨询
          </a>
          <a href="#playbook" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            实战复盘
          </a>
          <a href="#contact" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            关于我
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Day/Night Theme Switcher */}
          <ThemeToggle />

          <a
            href={siteConfig.personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            title="GitHub Profile"
          >
            <GithubIcon className="h-5 w-5" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all hover:shadow"
          >
            <span>预约咨询</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 bg-white px-4 pt-3 pb-5 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col space-y-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <a
              href="#library"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5"
            >
              <BookOpen className="h-4 w-4" />
              <span>数字书房 (在线阅读)</span>
            </a>
            <a
              href="#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-zinc-950 dark:hover:text-white"
            >
              作品工坊
            </a>
            <a
              href="#interactive-tool"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-zinc-950 dark:hover:text-white"
            >
              在线工具 (实时交互)
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-zinc-950 dark:hover:text-white"
            >
              服务与咨询
            </a>
            <a
              href="#playbook"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-zinc-950 dark:hover:text-white"
            >
              实战复盘
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-zinc-950 dark:hover:text-white"
            >
              关于我 & 联系
            </a>
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center rounded-lg bg-zinc-900 py-2.5 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                即刻联系 / 预约咨询
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
