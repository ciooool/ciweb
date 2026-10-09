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
      const deltaY = Math.max(0, Math.min(20, moveEvent.clientY - dragStartYRef.current));
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
      {/* 极简悬停提示 Tooltip (向左展开) */}
      <div
        className={`absolute top-16 right-8 px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wider whitespace-nowrap bg-[var(--bg-surface)] text-[var(--phosphor)] border border-[var(--border-line)] shadow-xl backdrop-blur-md transition-all duration-300 pointer-events-none ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--phosphor)] animate-ping" />
          拉绳 / 点击 · 熄灯闭幕
        </span>
      </div>

      {/* 极简高精度工业微吊灯 SVG */}
      <svg
        width="40"
        height="105"
        viewBox="0 0 40 105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-transform duration-300 ${
          isHovered && !isPulling ? 'animate-[pendulum_2.5s_ease-in-out_infinite]' : ''
        }`}
        style={{
          transformOrigin: 'top center',
          filter: isLit
            ? 'drop-shadow(0 0 10px rgba(92,242,196,0.65)) drop-shadow(0 0 20px rgba(92,242,196,0.25))'
            : 'none',
        }}
      >
        <defs>
          <linearGradient id="miniBrass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E6C875" />
            <stop offset="50%" stopColor="#C9A043" />
            <stop offset="100%" stopColor="#7E5F1E" />
          </linearGradient>

          <linearGradient id="miniObsidian" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#101524" />
            <stop offset="50%" stopColor="#253554" />
            <stop offset="100%" stopColor="#0B0F1A" />
          </linearGradient>

          <radialGradient id="miniBead" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#8A9FBF" />
            <stop offset="100%" stopColor="#1C2638" />
          </radialGradient>
        </defs>

        {/* 天花板固定扣 */}
        <rect x="17" y="0" width="6" height="3" rx="1" fill="#1C273E" stroke="#3A4D73" strokeWidth="0.6" />

        {/* 悬垂纤细金属电线 */}
        <line
          x1="20"
          y1="3"
          x2="20"
          y2="34"
          stroke="var(--border-line)"
          strokeWidth="1.2"
        />

        {/* 黄铜领圈固定口 */}
        <rect x="18" y="32" width="4" height="4" rx="1" fill="url(#miniBrass)" />

        {/* 锥台黑曜石微型灯罩 */}
        <polygon
          points="20,35 12,44 28,44"
          fill="url(#miniObsidian)"
          stroke="#3C527D"
          strokeWidth="0.8"
        />

        {/* 灯罩下缘边框 */}
        <ellipse cx="20" cy="44" rx="8" ry="2" fill="#0C101A" stroke="#5CF2C4" strokeWidth="0.7" />

        {/* 发光核心透镜 */}
        <circle
          cx="20"
          cy="46"
          r="4.5"
          fill={isLit ? '#FFFFFF' : '#192336'}
          stroke={isLit ? '#5CF2C4' : '#2A3B57'}
          strokeWidth="1"
        />
        {isLit && (
          <circle
            cx="20"
            cy="46"
            r="2"
            fill="#5CF2C4"
            className="animate-pulse"
          />
        )}

        {/* 右侧悬挂微型黄铜吊耳 */}
        <circle cx="25" cy="45" r="1.5" fill="url(#miniBrass)" />

        {/* 下垂微金属球链 (带下拉位移) */}
        <g
          transform={`translate(0, ${pullOffset})`}
          className="transition-transform duration-75"
        >
          {/* 链条微金属珠 */}
          {[50, 55, 60, 65, 70, 75].map((y, i) => (
            <circle
              key={i}
              cx="25"
              cy={y}
              r="1.2"
              fill="url(#miniBead)"
              stroke="#131B29"
              strokeWidth="0.4"
            />
          ))}

          {/* 交互拉动热区 (扩大点击范围) */}
          <rect
            x="12"
            y="72"
            width="26"
            height="28"
            fill="transparent"
            onPointerDown={handlePointerDown}
            className="cursor-pointer"
          />

          {/* 末端精致圆柱胶囊微拉坠 */}
          <rect
            x="23.2"
            y="78"
            width="3.6"
            height="11"
            rx="1.8"
            fill="#3B4D70"
            stroke={isHovered ? 'var(--phosphor)' : '#192233'}
            strokeWidth="0.7"
            className="transition-colors"
          />
          <line x1="23.5" y1="83" x2="26.5" y2="83" stroke="url(#miniBrass)" strokeWidth="0.6" />
          <circle cx="25" cy="89" r="1.2" fill="url(#miniBrass)" />
        </g>
      </svg>
    </div>
  );
};

export default MiniPendantLamp;
