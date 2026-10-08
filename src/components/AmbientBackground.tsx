"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // 随机微光星尘
    const starsCount = Math.min(60, Math.floor((width * height) / 22000));
    const stars = Array.from({ length: starsCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.25 + 0.05,
      twinkleSpeed: Math.random() * 0.02 + 0.008,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    const isLight = theme === "light";

    const render = () => {
      // 缓动鼠标视差
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const offsetX = ((mouseX - width / 2) / width) * 20;
      const offsetY = ((mouseY - height / 2) / height) * 20;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        star.twinklePhase += star.twinkleSpeed;
        const currentAlpha =
          star.alpha * (0.6 + 0.4 * Math.sin(star.twinklePhase));

        ctx.fillStyle = isLight
          ? `rgba(99, 102, 241, ${currentAlpha * 0.45})`
          : `rgba(234, 240, 255, ${currentAlpha * 0.75})`;

        ctx.beginPath();
        ctx.arc(star.x + offsetX, star.y + offsetY, star.r, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [theme]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. 双色动态流动极光 (Aurora Drift) */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 左上角紫罗兰球 */}
        <div
          className="absolute rounded-full filter blur-[100px] sm:blur-[140px] animate-aurora-1"
          style={{
            background:
              "radial-gradient(circle, var(--aurora-1) 0%, transparent 70%)",
            width: "50vw",
            height: "50vw",
            minWidth: "340px",
            minHeight: "340px",
            top: "-12vw",
            left: "-10vw",
          }}
        />

        {/* 右下角电光薄荷球 */}
        <div
          className="absolute rounded-full filter blur-[100px] sm:blur-[140px] animate-aurora-2"
          style={{
            background:
              "radial-gradient(circle, var(--aurora-2) 0%, transparent 70%)",
            width: "45vw",
            height: "45vw",
            minWidth: "300px",
            minHeight: "300px",
            bottom: "-10vw",
            right: "-8vw",
          }}
        />
      </div>

      {/* 2. 微光网格底纹 (Cyber Grid) */}
      <div
        className="absolute inset-0 opacity-40 transition-opacity"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 95%)",
        }}
      />

      {/* 3. 星尘轻量粒子画布 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-70"
      />
    </div>
  );
}
