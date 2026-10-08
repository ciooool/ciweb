"use client";

import React, { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorWrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // 移动端/触摸屏设备完全禁用自定义光标
    if (window.matchMedia("(hover: none) or (pointer: coarse)").matches) return;

    const wrap = cursorWrapRef.current;
    const ring = ringRef.current;
    const core = coreRef.current;
    const label = labelRef.current;
    if (!wrap || !ring || !core || !label) return;

    let isVisible = false;

    // 0ms 硬件级零延迟：直接映射原生 PointerEvent 客户端物理坐标
    const onPointerMove = (e: PointerEvent) => {
      wrap.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

      if (!isVisible) {
        isVisible = true;
        wrap.style.opacity = "1";
        document.body.classList.add("custom-cursor-active");
      }

      // 检测目标是否具有交互或自定义标签
      const target = e.target as HTMLElement | null;
      if (target) {
        // 查找最近的带 data-cursor 的卡片或链接
        const cardWithLabel = target.closest("[data-cursor]") as HTMLElement | null;
        if (cardWithLabel) {
          const text = cardWithLabel.getAttribute("data-cursor") || "";
          label.textContent = text;
          wrap.classList.add("has-label");
        } else {
          wrap.classList.remove("has-label");
        }

        // 检测可点击交互元素 (链接/按钮/输入框)
        const isClickable = Boolean(
          target.closest("a, button, [role='button'], input[type='submit'], select, .cursor-pointer, [data-interactive]")
        );

        if (isClickable) {
          wrap.classList.add("on-link");
          wrap.classList.remove("on-text");
        } else {
          wrap.classList.remove("on-link");
          const isText = Boolean(target.closest("p, h1, h2, h3, h4, span, blockquote"));
          if (isText && !cardWithLabel) {
            wrap.classList.add("on-text");
          } else {
            wrap.classList.remove("on-text");
          }
        }
      }
    };

    const onPointerDown = () => {
      wrap.classList.add("on-click");
    };

    const onPointerUp = () => {
      wrap.classList.remove("on-click");
    };

    const onPointerLeave = () => {
      isVisible = false;
      wrap.style.opacity = "0";
      document.body.classList.remove("custom-cursor-active");
    };

    const onPointerEnter = () => {
      isVisible = true;
      wrap.style.opacity = "1";
      document.body.classList.add("custom-cursor-active");
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);
    document.addEventListener("mouseenter", onPointerEnter);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("mouseleave", onPointerLeave);
      document.removeEventListener("mouseenter", onPointerEnter);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        /* 仅在支持鼠标悬停的精密设备上隐藏系统原生光标 */
        @media (hover: hover) and (pointer: fine) {
          body.custom-cursor-active,
          body.custom-cursor-active a,
          body.custom-cursor-active button,
          body.custom-cursor-active [role="button"],
          body.custom-cursor-active input,
          body.custom-cursor-active textarea {
            cursor: none !important;
          }
        }

        /* 零延迟准星光标外包装容器 */
        .custom-cursor-wrap {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 999999;
          opacity: 0;
          will-change: transform;
          transition: opacity 0.2s ease;
        }

        /* 核心电光薄荷绿粒子 (4px) */
        .cursor-core {
          position: absolute;
          top: 0;
          left: 0;
          transform: translate(-50%, -50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #5cf2c4;
          box-shadow: 0 0 6px #5cf2c4;
          transition: width 0.18s cubic-bezier(0.16, 1, 0.3, 1),
                      height 0.18s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 0.18s ease;
        }

        /* 赛博十字发丝准星光环 (30px) */
        .cursor-ring {
          position: absolute;
          top: 0;
          left: 0;
          transform: translate(-50%, -50%);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid rgba(92, 242, 196, 0.65);
          box-shadow: 0 0 10px rgba(92, 242, 196, 0.2);
          transition: width 0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
                      height 0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
                      border-color 0.2s ease,
                      background-color 0.2s ease,
                      border-radius 0.2s ease,
                      transform 0.1s ease;
        }

        /* Omar Fawzy 同款微细十字发丝标线 */
        .cursor-ring::before,
        .cursor-ring::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          background: rgba(92, 242, 196, 0.7);
          transform: translate(-50%, -50%);
          transition: opacity 0.2s ease;
        }
        .cursor-ring::before {
          width: 1px;
          height: calc(100% + 8px);
        }
        .cursor-ring::after {
          width: calc(100% + 8px);
          height: 1px;
        }

        /* 悬停链接与按钮：准星十字隐去，环形膨胀为紫罗兰高光吸收态 */
        .custom-cursor-wrap.on-link .cursor-ring::before,
        .custom-cursor-wrap.on-link .cursor-ring::after {
          opacity: 0;
        }
        .custom-cursor-wrap.on-link .cursor-ring {
          width: 48px;
          height: 48px;
          border-color: rgba(139, 123, 255, 0.9);
          background-color: rgba(139, 123, 255, 0.14);
          box-shadow: 0 0 20px rgba(139, 123, 255, 0.45);
        }
        .custom-cursor-wrap.on-link .cursor-core {
          width: 0;
          height: 0;
          opacity: 0;
        }

        /* 悬停文本：准星收束为极客光标指示条 */
        .custom-cursor-wrap.on-text .cursor-ring::before,
        .custom-cursor-wrap.on-text .cursor-ring::after {
          opacity: 0;
        }
        .custom-cursor-wrap.on-text .cursor-ring {
          width: 2px;
          height: 22px;
          border-radius: 1px;
          border: none;
          background: #5cf2c4;
          box-shadow: 0 0 8px #5cf2c4;
        }
        .custom-cursor-wrap.on-text .cursor-core {
          width: 0;
          height: 0;
          opacity: 0;
        }

        /* 点击瞬态反馈 */
        .custom-cursor-wrap.on-click .cursor-ring {
          transform: translate(-50%, -50%) scale(0.85);
          border-color: #5cf2c4;
        }

        /* Omar Fawzy 同款卡片角标提示 (OPEN / INSPECT / CODE) */
        .cursor-label {
          position: absolute;
          top: 0;
          left: 0;
          transform: translate(-50%, -50%);
          font-family: var(--font-mono, monospace);
          font-size: 8px;
          letter-spacing: 0.15em;
          font-weight: 700;
          color: #5cf2c4;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.15s ease;
          pointer-events: none;
        }
        .custom-cursor-wrap.has-label .cursor-label {
          opacity: 1;
        }
        .custom-cursor-wrap.has-label .cursor-ring {
          width: 62px;
          height: 62px;
          border-color: #5cf2c4;
          background-color: rgba(92, 242, 196, 0.08);
        }
        .custom-cursor-wrap.has-label .cursor-ring::before,
        .custom-cursor-wrap.has-label .cursor-ring::after {
          opacity: 0;
        }
        .custom-cursor-wrap.has-label .cursor-core {
          width: 0;
          height: 0;
          opacity: 0;
        }
      `}</style>

      {/* 硬件级零延迟准星光标 */}
      <div ref={cursorWrapRef} className="custom-cursor-wrap" aria-hidden="true">
        <div ref={coreRef} className="cursor-core" />
        <div ref={ringRef} className="cursor-ring" />
        <span ref={labelRef} className="cursor-label" />
      </div>
    </>
  );
}
