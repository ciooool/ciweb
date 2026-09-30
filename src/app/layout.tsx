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
  title: "Ciooool | 全栈独立开发者 (Indie Hacker) & 系统架构工坊",
  description:
    "从 0 到 1 打造极简高可用产品。专注 Next.js / Go 全栈研发、独立微型 SaaS 孵化、技术咨询与工程实战复盘。",
  keywords: [
    "独立开发者",
    "Indie Hacker",
    "全栈工程师",
    "Go架构设计",
    "Next.js",
    "微型SaaS",
    "技术咨询",
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
      <body className="min-h-full flex flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors">
        {children}
      </body>
    </html>
  );
}
