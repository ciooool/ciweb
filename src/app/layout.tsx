import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ciooool Atelier | 全栈工程与心智书房",
  description:
    "以代码构建系统，以阅读重塑心智。赛博朋克极客风格个人主页与认知心智模型造物工坊。",
  keywords: [
    "Ciooool",
    "全栈工程师",
    "独立开发者",
    "Next.js",
    "Go",
    "心智模型",
    "Cyberpunk",
    "Indie Hacker",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#05070F] text-[#EAF0FF] transition-colors selection:bg-[#5CF2C4]/25 selection:text-[#5CF2C4]">
        {children}
      </body>
    </html>
  );
}
