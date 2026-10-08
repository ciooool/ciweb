import React from "react";
import { siteConfig } from "@/data/siteConfig";

export default function Footer() {
  return (
    <footer className="border-t border-[#EAE6DF] dark:border-[#2C2A28] py-14 bg-[#FAF8F5] dark:bg-[#181716] transition-colors">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Brand & Colophon */}
          <div className="flex items-center gap-3">
            <span className="font-serif text-sm tracking-wider text-[#1F1E1D] dark:text-[#EDE9E3] font-medium">
              {siteConfig.personal.name}
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#948F86] uppercase border-l border-[#D5CEBF] dark:border-[#38342E] pl-3">
              Atelier
            </span>
            <span className="hidden sm:inline-block text-xs font-serif text-[#948F86] border-l border-[#D5CEBF] dark:border-[#38342E] pl-3">
              致虚极，守静笃 · 以手艺抵抗熵增
            </span>
          </div>

          {/* Center: Tech note */}
          <div className="text-xs font-serif text-[#948F86] flex items-center gap-1">
            <span>Next.js · Tailwind CSS · Go · 自主构建</span>
          </div>

          {/* Right: Copyright */}
          <div className="text-xs font-mono text-[#948F86]">
            &copy; {new Date().getFullYear()} {siteConfig.personal.name}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
