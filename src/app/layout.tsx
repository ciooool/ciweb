import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      className={`${spaceGrotesk.variable} ${ibmPlexSans.variable} ${jetbrainsMono.variable} dark h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#05070F] text-[#EAF0FF] transition-colors selection:bg-[#5CF2C4]/25 selection:text-[#5CF2C4]">
        {/* Omar Fawzy 同款拟真互动光标 */}
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
