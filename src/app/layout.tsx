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
  title: "Ciooool Atelier | 心智书房与独立创造工坊",
  description:
    "以代码构建系统，以阅读重塑心智。精选 25+ 部殿堂级心智模型神作深度拆解，与独立全栈系统造物工坊。",
  keywords: [
    "Ciooool",
    "心智书房",
    "独立开发者",
    "Indie Hacker",
    "全栈工匠",
    "Next.js",
    "Go",
    "认知模型",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#1F1E1D] dark:bg-[#181716] dark:text-[#EDE9E3] transition-colors selection:bg-[#9E7B5B]/20">
        {children}
      </body>
    </html>
  );
}
