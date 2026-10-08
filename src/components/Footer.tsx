import React from "react";
import { siteConfig } from "@/data/siteConfig";

export default function Footer() {
  return (
    <footer className="border-t border-[#1F2A4D] py-14 bg-[#05070F] text-[#9FB0D0] transition-colors relative z-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Brand & Colophon */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm tracking-wider text-[#EAF0FF] font-medium">
              {siteConfig.personal.name}
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#5CF2C4] uppercase border-l border-[#1F2A4D] pl-3">
              Atelier
            </span>
            <span className="hidden sm:inline-block text-xs font-mono text-[#7D88AA] border-l border-[#1F2A4D] pl-3">
              以代码抵抗熵增 · 自主构建
            </span>
          </div>

          {/* Center: Tech note */}
          <div className="text-xs font-mono text-[#7D88AA] flex items-center gap-1">
            <span>Next.js · Tailwind CSS · Go · Retro Arcade Core</span>
          </div>

          {/* Right: Copyright */}
          <div className="text-xs font-mono text-[#7D88AA]">
            &copy; {new Date().getFullYear()} {siteConfig.personal.name}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
