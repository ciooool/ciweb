'use client';

import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // 移动端/触摸屏设备完全禁用自定义光标追踪
    if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let isVisible = false;
    let animationFrameId: number;

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        cursor.style.opacity = '1';
        dot.style.opacity = '1';
      }

      // 实时点 0 延迟跟随物理光标
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      // 检测可交互元素，产生微磁吸/高光缩放
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('a, button, [role="button"], input, textarea, select, [data-interactive]')
        );
        if (isClickable) {
          cursor.classList.add('cursor-hovering');
        } else {
          cursor.classList.remove('cursor-hovering');
        }
      }
    };

    // 阻尼柔和跟随环 (Spring Follower)
    const render = () => {
      const ease = 0.22;
      currentX += (mouseX - currentX) * ease;
      currentY += (mouseY - currentY) * ease;

      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const onPointerLeave = () => {
      isVisible = false;
      cursor.style.opacity = '0';
      dot.style.opacity = '0';
    };

    const onPointerEnter = () => {
      isVisible = true;
      cursor.style.opacity = '1';
      dot.style.opacity = '1';
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);
    document.addEventListener('mouseenter', onPointerEnter);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      document.removeEventListener('mouseenter', onPointerEnter);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        /* 柔和环境光晕环 */
        .ambient-cursor-ring {
          position: fixed;
          top: 0;
          left: 0;
          width: 32px;
          height: 32px;
          margin-top: -16px;
          margin-left: -16px;
          border-radius: 50%;
          border: 1px solid var(--phosphor);
          pointer-events: none;
          z-index: 99999;
          opacity: 0;
          will-change: transform;
          transition: opacity 0.2s ease, width 0.2s ease, height 0.2s ease, margin 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
        }

        .ambient-cursor-ring.cursor-hovering {
          width: 44px;
          height: 44px;
          margin-top: -22px;
          margin-left: -22px;
          border-color: var(--violet);
          background-color: var(--violet-subtle);
          box-shadow: 0 0 16px var(--violet-glow);
        }

        /* 准心物理微点 */
        .ambient-cursor-dot {
          position: fixed;
          top: 0;
          left: 0;
          width: 4px;
          height: 4px;
          margin-top: -2px;
          margin-left: -2px;
          border-radius: 50%;
          background: var(--phosphor);
          box-shadow: 0 0 6px var(--phosphor);
          pointer-events: none;
          z-index: 100000;
          opacity: 0;
          will-change: transform;
          transition: opacity 0.15s ease;
        }
      `}</style>
      <div ref={cursorRef} className="ambient-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="ambient-cursor-dot" aria-hidden="true" />
    </>
  );
}
