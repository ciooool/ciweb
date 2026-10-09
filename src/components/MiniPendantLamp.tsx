'use client';

import React, { useState, useRef } from 'react';
import { soundManager } from '@/utils/audio';

interface MiniPendantLampProps {
  onPull: () => void;
  isLit?: boolean;
}

export const MiniPendantLamp: React.FC<MiniPendantLampProps> = ({
  onPull,
  isLit = true,
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullOffset, setPullOffset] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const dragStartYRef = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsPulling(true);
    dragStartYRef.current = e.clientY;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaY = Math.max(0, Math.min(22, moveEvent.clientY - dragStartYRef.current));
      setPullOffset(deltaY);
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      setIsPulling(false);
      setPullOffset(0);

      // 触发音效与关灯降幕
      soundManager.playLampSwitch();
      onPull();
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const handleClick = () => {
    if (isPulling) return;
    soundManager.playLampSwitch();
    onPull();
  };

  return (
    <div
      onClick={handleClick}
      className="fixed top-0 right-6 sm:right-10 z-40 select-none pointer-events-auto flex flex-col items-center group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="下拉拉绳 / 点击 · 熄灯闭幕"
    >
      {/* 悬停提示 Tooltip (向左展开) */}
      <div
        className={`absolute top-16 right-7 px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wider whitespace-nowrap bg-[var(--bg-surface)] text-[var(--phosphor)] border border-[var(--border-line)] shadow-xl backdrop-blur-md transition-all duration-300 pointer-events-none ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--phosphor)] animate-ping" />
          拉绳 · 熄灯闭幕
        </span>
      </div>

      {/* 物理吊灯 SVG 实体 */}
      <svg
        width="38"
        height="100"
        viewBox="0 0 38 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-transform duration-300 ${
          isHovered && !isPulling ? 'animate-[pendulum_2.5s_ease-in-out_infinite]' : ''
        }`}
        style={{
          transformOrigin: 'top center',
          filter: isLit
            ? 'drop-shadow(0 0 12px var(--phosphor)) drop-shadow(0 0 24px var(--phosphor-subtle))'
            : 'none',
        }}
      >
        {/* 天花板固定扣 */}
        <rect x="16" y="0" width="6" height="4" rx="1.5" fill="#3A4D73" />

        {/* 悬吊金属电线 */}
        <line
          x1="19"
          y1="4"
          x2="19"
          y2="38"
          stroke="var(--border-line)"
          strokeWidth="1.5"
          strokeDasharray="2 1"
        />

        {/* 灯头金属盖 (Socket) */}
        <path
          d="M13 38C13 36.5 15.5 35 19 35C22.5 35 25 36.5 25 38L24 43H14L13 38Z"
          fill="#1F2A44"
          stroke="#3A4D73"
          strokeWidth="1"
        />

        {/* 发光灯泡实体 */}
        <circle
          cx="19"
          cy="48"
          r="8"
          fill={isLit ? 'var(--phosphor)' : '#1A2338'}
          fillOpacity={isLit ? '0.92' : '0.4'}
          stroke={isLit ? '#FFFFFF' : '#3A4D73'}
          strokeWidth="1.2"
        />

        {/* 内部高亮发光灯丝 */}
        {isLit && (
          <ellipse
            cx="19"
            cy="47"
            rx="3.5"
            ry="4.5"
            fill="#FFFFFF"
            fillOpacity="0.85"
            className="animate-pulse"
          />
        )}

        {/* 从灯头底部垂下的拉绳与金属小珠 (带下拉交互位移) */}
        <g
          transform={`translate(0, ${pullOffset})`}
          className="transition-transform duration-75"
        >
          {/* 拉线 */}
          <line
            x1="19"
            y1="56"
            x2="19"
            y2="78"
            stroke={isHovered ? 'var(--phosphor)' : 'var(--text-muted)'}
            strokeWidth="1.2"
          />

          {/* 交互拉动热区 (扩大点击范围) */}
          <rect
            x="9"
            y="70"
            width="20"
            height="26"
            fill="transparent"
            onPointerDown={handlePointerDown}
            className="cursor-pointer"
          />

          {/* 末端金属拉坠 (Acorn Bead) */}
          <circle
            cx="19"
            cy="82"
            r="3.5"
            fill={isHovered ? 'var(--phosphor)' : '#EAF0FF'}
            stroke="#1F2A44"
            strokeWidth="1"
            className="transition-colors"
          />
          {/* 小光圈 */}
          <circle
            cx="19"
            cy="82"
            r="1.2"
            fill="#05070F"
          />
        </g>
      </svg>
    </div>
  );
};

export default MiniPendantLamp;
