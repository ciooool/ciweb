"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { soundManager } from "@/utils/audio";
import { Volume2, VolumeX, X } from "lucide-react";

interface CyberLampIntroProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CyberLampIntro({ isOpen, onClose }: CyberLampIntroProps) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isLit, setIsLit] = useState(false);
  const [flickerState, setFlickerState] = useState(0); // 0 = off, 1 = flash, 2 = dim, 3 = full bright
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const dragStartY = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 触发拉灯开启动画
  const triggerIgnition = useCallback(() => {
    if (isLit) return;
    setIsLit(true);
    soundManager.playLampSwitch();

    // 弹簧回弹振荡效果
    let t = 0;
    const startOffset = dragOffset;
    const animateSpring = () => {
      t += 0.08;
      // 衰减正弦振荡
      const offset = startOffset * Math.exp(-t * 3.5) * Math.cos(t * 12);
      if (Math.abs(offset) < 0.5 || t > 1.2) {
        setDragOffset(0);
      } else {
        setDragOffset(offset);
        animFrameRef.current = requestAnimationFrame(animateSpring);
      }
    };
    animFrameRef.current = requestAnimationFrame(animateSpring);

    // 逼真电弧灯丝点火爆闪序列 (Flicker sequence)
    setFlickerState(1); // 瞬间过载高亮
    setTimeout(() => setFlickerState(0.4), 60); // 瞬间骤降
    setTimeout(() => setFlickerState(1.2), 120); // 二次复炽
    setTimeout(() => setFlickerState(0.85), 200); // 稳定微颤
    setTimeout(() => setFlickerState(1.0), 320); // 恒定全开

    // 延迟 700ms 优雅淡出揭晓网站
    setTimeout(() => {
      setIsFadingOut(true);
    }, 750);

    setTimeout(() => {
      try {
        sessionStorage.setItem("ciooool_lamp_intro_done", "true");
      } catch {
        // Ignore private mode storage errors
      }
      onClose();
    }, 1450);
  }, [dragOffset, isLit, onClose]);

  // 鼠标 / 触屏拖拽事件
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isLit) return;
    setIsDragging(true);
    dragStartY.current = e.clientY;
    (e.target as Element).setPointerCapture(e.pointerId);
    soundManager.playCordTension();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isLit) return;
    const currentY = e.clientY;
    const rawDelta = currentY - dragStartY.current;
    // 增加弹性阻尼，越往下拉阻力越大，最大拉动 72px
    if (rawDelta > 0) {
      const dampened = Math.min(72, rawDelta * 0.7);
      setDragOffset(dampened);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || isLit) return;
    setIsDragging(false);
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    // 只要下拉超过 25px 或者点击（小于 5px 算轻点操作），都触发点亮！
    if (dragOffset > 25 || dragOffset < 6) {
      triggerIgnition();
    } else {
      // 没达到阈值则弹回
      setDragOffset(0);
    }
  };

  // 键盘无障碍支持（Enter / Space / Escape）
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        triggerIgnition();
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, triggerIgnition, onClose]);

  // 清理动画帧
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const lampRestY = 440;
  const cordAnchorX = 536;
  const cordAnchorY = 286;
  const handleY = lampRestY + dragOffset;
  const isPullReady = dragOffset > 25;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 flex items-center justify-center select-none overflow-hidden transition-all duration-700 ${
        isFadingOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        backgroundColor: "#05070F",
        background: isLit
          ? "radial-gradient(ellipse 80% 60% at 50% 25%, #0B192E 0%, #05070F 85%)"
          : "radial-gradient(ellipse 60% 50% at 50% 20%, #0d1326 0%, #05070F 75%)",
      }}
    >
      {/* 顶部工具栏（跳过 & 音效切换） */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <button
          onClick={() => {
            const next = !isMuted;
            setIsMuted(next);
            soundManager.setMuted(next);
          }}
          className="p-2.5 rounded-full border border-[#1F2A4D] bg-[#0A0E1A]/80 text-[#8B7BFF] hover:text-[#5CF2C4] hover:border-[#5CF2C4]/50 transition-all backdrop-blur-md"
          title={isMuted ? "开启音效" : "静音"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#1F2A4D] bg-[#0A0E1A]/80 text-xs font-mono text-[#9FB0D0] hover:text-white hover:border-[#5CF2C4]/50 transition-all backdrop-blur-md"
        >
          <span>Skip</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SVG 舞台主画布 */}
      <svg
        className="w-full h-full max-w-[1200px] max-h-[1000px] absolute inset-0 m-auto pointer-events-none"
        viewBox="0 0 1000 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* 金属与外壳渐变 */}
          <linearGradient id="lampMetal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#121625" />
            <stop offset="40%" stopColor="#4B5577" />
            <stop offset="60%" stopColor="#2A3149" />
            <stop offset="100%" stopColor="#0D101B" />
          </linearGradient>

          <linearGradient id="shadeBody" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#080B15" />
            <stop offset="20%" stopColor="#1B2238" />
            <stop offset="45%" stopColor="#323E5E" />
            <stop offset="70%" stopColor="#171F36" />
            <stop offset="100%" stopColor="#070910" />
          </linearGradient>

          <linearGradient id="handleBody" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#151A2B" />
            <stop offset="38%" stopColor="#4D5879" />
            <stop offset="55%" stopColor="#2D3550" />
            <stop offset="100%" stopColor="#0E121E" />
          </linearGradient>

          {/* 点亮时的霓虹高斯光晕渐变 */}
          <radialGradient id="lampBloom" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#5CF2C4" stopOpacity={0.35 * flickerState} />
            <stop offset="40%" stopColor="#5CF2C4" stopOpacity={0.12 * flickerState} />
            <stop offset="75%" stopColor="#8B7BFF" stopOpacity={0.06 * flickerState} />
            <stop offset="100%" stopColor="#8B7BFF" stopOpacity="0" />
          </radialGradient>

          {/* 主圆锥光束 (Outer Beam) */}
          <linearGradient id="beamGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CFFFF0" stopOpacity={0.32 * flickerState} />
            <stop offset="30%" stopColor="#5CF2C4" stopOpacity={0.15 * flickerState} />
            <stop offset="75%" stopColor="#8B7BFF" stopOpacity={0.05 * flickerState} />
            <stop offset="100%" stopColor="#8B7BFF" stopOpacity="0" />
          </linearGradient>

          {/* 高能内芯光束 (Core Beam) */}
          <linearGradient id="beamCoreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.45 * flickerState} />
            <stop offset="35%" stopColor="#BFF9E7" stopOpacity={0.16 * flickerState} />
            <stop offset="100%" stopColor="#BFF9E7" stopOpacity="0" />
          </linearGradient>

          {/* 地面光池 (Floor Pool) */}
          <radialGradient id="poolGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A8F7DF" stopOpacity={0.38 * flickerState} />
            <stop offset="55%" stopColor="#5CF2C4" stopOpacity={0.12 * flickerState} />
            <stop offset="100%" stopColor="#5CF2C4" stopOpacity="0" />
          </radialGradient>

          {/* 模糊滤镜 */}
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="beamSoft" x="-30%" y="-10%" width="160%" height="120%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
        </defs>

        {/* 光束投射与地面光池 (只有点亮时投射) */}
        {isLit && (
          <g className="transition-opacity duration-300">
            {/* 顶端大范围辐射光晕 */}
            <circle cx="500" cy="310" r="420" fill="url(#lampBloom)" />

            {/* 外层大光束 */}
            <path
              d="M 500 290 L 100 900 L 900 900 Z"
              fill="url(#beamGrad)"
              filter="url(#beamSoft)"
            />

            {/* 内层高亮核心光束 */}
            <path
              d="M 500 290 L 280 900 L 720 900 Z"
              fill="url(#beamCoreGrad)"
              filter="url(#beamSoft)"
            />

            {/* 地面光圈 */}
            <ellipse cx="500" cy="850" rx="420" ry="55" fill="url(#poolGrad)" />

            {/* 光束中悬浮闪烁的粒子微尘 (Floating Motes) */}
            <g className="opacity-75">
              {[
                { cx: 480, cy: 400, r: 2.2, dur: "3s" },
                { cx: 520, cy: 460, r: 1.8, dur: "4s" },
                { cx: 460, cy: 540, r: 2.5, dur: "3.5s" },
                { cx: 540, cy: 590, r: 1.5, dur: "4.5s" },
                { cx: 490, cy: 680, r: 2.0, dur: "3.2s" },
                { cx: 430, cy: 740, r: 2.4, dur: "5s" },
                { cx: 560, cy: 760, r: 1.6, dur: "3.8s" },
              ].map((mote, i) => (
                <circle
                  key={i}
                  cx={mote.cx}
                  cy={mote.cy}
                  r={mote.r}
                  fill="#FFFFFF"
                  className="animate-pulse"
                  style={{ animationDuration: mote.dur }}
                  filter="url(#softGlow)"
                />
              ))}
            </g>
          </g>
        )}

        {/* 吊灯天花板悬索 */}
        <line x1="500" y1="0" x2="500" y2="160" stroke="#1E263D" strokeWidth="3" />
        <line x1="499" y1="0" x2="499" y2="160" stroke="#68769D" strokeOpacity="0.4" strokeWidth="1" />

        {/* 吊灯灯体 (Lamp Shade & Bulb) */}
        <g id="lampBody">
          {/* 顶部五金接口 */}
          <rect x="492" y="150" width="16" height="20" rx="3" fill="url(#lampMetal)" />
          <path d="M 484 168 H 516 V 180 A 4 4 0 0 1 512 184 H 488 A 4 4 0 0 1 484 180 Z" fill="url(#lampMetal)" />

          {/* 工业喇叭灯罩 */}
          <path
            d="M 482 184 C 440 186 398 234 394 286 L 606 286 C 602 234 560 186 518 184 Z"
            fill="url(#shadeBody)"
            stroke={isLit ? "#5CF2C4" : "#2A3654"}
            strokeWidth="1.5"
            strokeOpacity={isLit ? "0.8" : "0.5"}
          />
          {/* 灯罩立体高光与阴影 */}
          <path
            d="M 440 200 C 420 220 405 255 400 280"
            fill="none"
            stroke="#C8D4F5"
            strokeOpacity="0.22"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* 灯罩底部内凹反光圈 */}
          <ellipse cx="500" cy="286" rx="106" ry="14" fill={isLit ? "#051A18" : "#04070F"} stroke="#3A4668" strokeWidth="1.5" />
          {isLit && (
            <ellipse cx="500" cy="286" rx="104" ry="13" fill="#5CF2C4" fillOpacity="0.25" filter="url(#softGlow)" />
          )}

          {/* 灯泡底座与玻璃灯罩 */}
          <circle
            cx="500"
            cy="296"
            r="24"
            fill={isLit ? "#FFFFFF" : "#1B2338"}
            stroke={isLit ? "#5CF2C4" : "#445070"}
            strokeWidth="2"
            filter={isLit ? "url(#softGlow)" : undefined}
          />

          {/* 灯丝钨丝回路 (Filament) */}
          {isLit ? (
            <path
              d="M 490 298 Q 495 284 500 298 T 510 298"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              filter="url(#softGlow)"
            />
          ) : (
            <path
              d="M 490 298 Q 495 288 500 298 T 510 298"
              fill="none"
              stroke="#4A5677"
              strokeWidth="1.2"
            />
          )}

          {/* 灯丝光晕核 */}
          {isLit && (
            <circle cx="500" cy="298" r="48" fill="#5CF2C4" fillOpacity={0.45 * flickerState} filter="url(#softGlow)" />
          )}
        </g>

        {/* 拉绳索与金属圆珠链 (Pull Cord Chain) */}
        <g id="pullChain">
          {/* 金属线 (根据下拉带有细微贝塞尔弧线) */}
          <path
            d={`M ${cordAnchorX} ${cordAnchorY} Q ${cordAnchorX + dragOffset * 0.15} ${
              (cordAnchorY + handleY) / 2
            } ${cordAnchorX} ${handleY}`}
            fill="none"
            stroke="#637096"
            strokeWidth="1.8"
          />

          {/* 圆珠链上的金属小圆珠 */}
          {[0.12, 0.24, 0.36, 0.48, 0.6, 0.72, 0.84, 0.94].map((ratio, idx) => {
            const beadY = cordAnchorY + (handleY - cordAnchorY) * ratio;
            return (
              <circle
                key={idx}
                cx={cordAnchorX}
                cy={beadY}
                r="3"
                fill="#8E9AB8"
                stroke="#2B344D"
                strokeWidth="0.8"
              />
            );
          })}

          {/* 拉绳手柄 (Pull Handle) */}
          <g transform={`translate(${cordAnchorX}, ${handleY})`}>
            {/* 上卡扣 */}
            <rect x="-3" y="-2" width="6" height="5" rx="1.5" fill="#8D96B3" />
            {/* 主圆柱手柄 */}
            <rect
              x="-8"
              y="3"
              width="16"
              height="30"
              rx="8"
              fill="url(#handleBody)"
              stroke={isPullReady ? "#5CF2C4" : "#8B7BFF"}
              strokeWidth="1.6"
              filter={isPullReady ? "url(#softGlow)" : undefined}
            />
            {/* 手柄发光装饰环 */}
            <rect
              x="-8"
              y="22"
              width="16"
              height="4"
              fill={isPullReady ? "#5CF2C4" : "#8B7BFF"}
              className={isLit ? "opacity-30" : "animate-pulse"}
              filter="url(#softGlow)"
            />
            {/* 高光反光条 */}
            <ellipse cx="-3" cy="12" rx="1.5" ry="5" fill="#FFFFFF" opacity="0.35" />
          </g>
        </g>
      </svg>

      {/* 交互把手覆盖层（提供超灵敏点击与拖拽手势） */}
      <div
        className="absolute z-30 cursor-grab active:cursor-grabbing flex flex-col items-center pointer-events-auto"
        style={{
          left: "50%",
          top: "50%",
          transform: `translate(calc(-50% + 36px), calc(-50% + ${handleY - 450}px))`,
          touchAction: "none",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* 宽大触摸感应热区 */}
        <div className="w-20 h-28 flex items-center justify-center -mt-6">
          <div
            className={`w-9 h-14 rounded-full border border-dashed transition-all duration-200 ${
              isDragging
                ? "border-[#5CF2C4] bg-[#5CF2C4]/20 scale-110 shadow-[0_0_20px_rgba(92,242,196,0.5)]"
                : "border-[#8B7BFF]/40 hover:border-[#5CF2C4] hover:bg-[#5CF2C4]/10"
            }`}
          />
        </div>

        {/* 动态浮动提示 (Pull Hint) */}
        {!isLit && (
          <div className="flex flex-col items-center mt-2 pointer-events-none transition-all">
            <span
              className={`text-[11px] font-mono tracking-widest uppercase px-3 py-1 rounded-full border transition-all ${
                isPullReady
                  ? "border-[#5CF2C4] text-[#5CF2C4] bg-[#5CF2C4]/20 scale-105 shadow-[0_0_15px_rgba(92,242,196,0.4)]"
                  : "border-[#1F2A4D] text-[#8B7BFF] bg-[#0A0E1A]/80"
              }`}
            >
              {isPullReady ? "RELEASE TO IGNITE ⚡" : "PULL THE CHAIN"}
            </span>
            <span className="text-[10px] font-sans text-[#7D88AA] mt-1.5 opacity-80 animate-bounce">
              {isDragging ? "松手点亮" : "向下轻拉 / 点击点亮"}
            </span>
          </div>
        )}
      </div>

      {/* 底部欢迎副标题与键盘快捷引导 */}
      <div className="absolute bottom-10 left-0 right-0 z-10 flex flex-col items-center justify-center pointer-events-none text-center px-4">
        <h2 className="text-xl sm:text-2xl font-mono text-[#EAF0FF] tracking-wider mb-2">
          CIOOOUL ATELIER
        </h2>
        <p className="text-xs sm:text-sm font-sans text-[#7D88AA] max-w-md mb-3">
          拉动链绳点亮独立造物工坊 · 探索全栈系统与认知书房
        </p>
        <div className="inline-flex items-center gap-2 text-[10px] font-mono text-[#525E7E]">
          <span className="px-1.5 py-0.5 rounded border border-[#1F2A4D] bg-[#0A0E1A]">ENTER</span>
          <span>或</span>
          <span className="px-1.5 py-0.5 rounded border border-[#1F2A4D] bg-[#0A0E1A]">SPACE</span>
          <span>直接通电</span>
        </div>
      </div>
    </div>
  );
}
