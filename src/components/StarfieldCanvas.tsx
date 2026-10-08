"use client";

import React, { useEffect, useRef } from "react";

export default function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // 生成粒子星辰
    const starCount = Math.floor((width * height) / 9000);
    const stars: Array<{
      x: number;
      y: number;
      radius: number;
      alpha: number;
      speed: number;
      color: string;
      twinkleSpeed: number;
      twinklePhase: number;
    }> = [];

    const colors = ["#FFFFFF", "#8B7BFF", "#5CF2C4", "#C4B5FD"];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.3 + 0.4,
        alpha: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.15 + 0.05,
        color: colors[Math.floor(Math.random() * colors.length)],
        twinkleSpeed: Math.random() * 0.02 + 0.008,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // 缓慢向下漂移
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }

        // 闪烁周期
        star.twinklePhase += star.twinkleSpeed;
        const currentAlpha =
          star.alpha * (0.6 + 0.4 * Math.sin(star.twinklePhase));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
        ctx.shadowBlur = star.radius > 1 ? 4 : 0;
        ctx.shadowColor = star.color;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      aria-hidden="true"
    />
  );
}
