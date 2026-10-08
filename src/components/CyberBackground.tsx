"use client";

import React from "react";
import StarfieldCanvas from "./StarfieldCanvas";

export default function CyberBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* 1. 星辰微粒粒子画布 */}
      <StarfieldCanvas />

      {/* 2. Omar Fawzy 标志性双色动态流动极光 (Aurora Drift) */}
      <div className="aurora-container absolute inset-0 overflow-hidden opacity-70">
        {/* 左上方紫罗兰极光球 (Violet Aurora) */}
        <div
          className="absolute rounded-full filter blur-[100px] sm:blur-[140px] animate-drift-a"
          style={{
            background: "radial-gradient(circle, rgba(76, 59, 191, 0.45) 0%, rgba(139, 123, 255, 0.15) 45%, transparent 70%)",
            width: "48vw",
            height: "48vw",
            minWidth: "360px",
            minHeight: "360px",
            top: "-10vw",
            left: "-8vw",
          }}
        />

        {/* 右下方电光深青/薄荷绿极光球 (Teal / Mint Aurora) */}
        <div
          className="absolute rounded-full filter blur-[100px] sm:blur-[140px] animate-drift-b"
          style={{
            background: "radial-gradient(circle, rgba(15, 95, 122, 0.45) 0%, rgba(92, 242, 196, 0.15) 45%, transparent 70%)",
            width: "42vw",
            height: "42vw",
            minWidth: "320px",
            minHeight: "320px",
            bottom: "-8vw",
            right: "-6vw",
          }}
        />

        {/* 中央微弱柔光呼应 */}
        <div
          className="absolute rounded-full filter blur-[120px] sm:blur-[160px] animate-pulse"
          style={{
            background: "radial-gradient(circle, rgba(92, 242, 196, 0.1) 0%, rgba(76, 59, 191, 0.08) 50%, transparent 75%)",
            width: "35vw",
            height: "35vw",
            top: "35%",
            left: "32%",
            animationDuration: "8s",
          }}
        />
      </div>

      {/* 3. 赛博数码细网格底纹 (Cyber Grid Overlay with Radial Vignette) */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(92, 242, 196, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139, 123, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 75% 75% at 50% 50%, #000 30%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 75% at 50% 50%, #000 30%, transparent 95%)",
        }}
      />

      {/* 4. 底部地平线赛博微光晕 (Bottom Street / Cyber Horizon) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 opacity-40 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(92, 242, 196, 0.08) 0%, rgba(76, 59, 191, 0.04) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}
