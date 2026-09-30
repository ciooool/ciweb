import React from "react";
import { siteConfig } from "@/data/siteConfig";
import { Terminal, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 py-12 bg-white dark:bg-zinc-950 transition-colors">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Brand & Slogan */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-zinc-900 dark:text-white">
                {siteConfig.personal.name}.dev
              </span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Crafting digital assets with engineering rigor.
              </p>
            </div>
          </div>

          {/* Center: Tech note */}
          <div className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
            <span>Powered by Next.js 16 · Tailwind CSS · Go · Vercel</span>
          </div>

          {/* Right: Copyright */}
          <div className="text-xs text-zinc-400 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} {siteConfig.personal.name}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
