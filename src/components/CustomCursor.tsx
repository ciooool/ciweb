"use client";

import React, { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const [isHoveringText, setIsHoveringText] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [visible, setVisible] = useState(false);

  // 坐标引用
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const coreRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // 仅在支持高精度鼠标悬停的设备（PC/Mac）上启用
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    setEnabled(true);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      // 检测光标所指元素类型
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest("a, button, [role='button'], input[type='submit'], .cursor-pointer")
        );
        const isTextInput = Boolean(
          target.closest("input[type='text'], input[type='email'], textarea, [contenteditable='true']")
        );
        setIsHoveringLink(isInteractive);
        setIsHoveringText(isTextInput);
      }
    };

    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);
    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // 平滑弹性插值阻尼跟随循环 (Smooth Lerp Loop)
    const animate = () => {
      // 0.20 弹性滞后系数
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.22;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.22;

      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [visible]);

  if (!enabled || !visible) return null;

  return (
    <>
      {/* 隐藏系统原生鼠标箭头，启用赛博准星光标 */}
      <style jsx global>{`
        @media (hover: hover) and (pointer: fine) {
          body, a, button, input, textarea {
            cursor: none !important;
          }
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        {/* 1. 核心实心微粒 (跟随零延迟) */}
        <div
          ref={coreRef}
          className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 pointer-events-none ${
            isHoveringText
              ? "w-1 h-5 bg-[#5CF2C4] rounded-xs"
              : isHoveringLink
              ? "w-1.5 h-1.5 bg-[#8B7BFF]"
              : isMouseDown
              ? "w-1 h-1 bg-[#5CF2C4] scale-75"
              : "w-1.5 h-1.5 bg-[#5CF2C4] shadow-[0_0_8px_#5CF2C4]"
          }`}
        />

        {/* 2. 外部平滑跟随准星光环 (Lag Ring with Crosshair) */}
        <div
          ref={ringRef}
          className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-200 pointer-events-none ${
            isHoveringText
              ? "w-6 h-6 border-0 opacity-0"
              : isHoveringLink
              ? "w-13 h-13 border border-[#8B7BFF]/80 bg-[#8B7BFF]/15 shadow-[0_0_20px_rgba(139,123,255,0.4)] scale-105"
              : isMouseDown
              ? "w-6 h-6 border border-[#5CF2C4] bg-[#5CF2C4]/20 scale-90"
              : "w-8 h-8 border border-[#5CF2C4]/60 shadow-[0_0_12px_rgba(92,242,196,0.3)]"
          }`}
        >
          {/* 十字发丝准星微线 (Crosshair tick lines) */}
          {!isHoveringLink && !isHoveringText && (
            <>
              <span className="absolute w-[calc(100%+8px)] h-[1px] bg-[#5CF2C4]/40" />
              <span className="absolute h-[calc(100%+8px)] w-[1px] bg-[#5CF2C4]/40" />
            </>
          )}
        </div>
      </div>
    </>
  );
}
