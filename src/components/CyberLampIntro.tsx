"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { soundManager } from "@/utils/audio";
import { Volume2, VolumeX, X, ArrowRight } from "lucide-react";

interface CyberLampIntroProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CyberLampIntro({ isOpen, onClose }: CyberLampIntroProps) {
  // 开灯 / 关灯状态（支持双向往复切换）
  const [isLit, setIsLit] = useState(false);
  const [flickerLevel, setFlickerLevel] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // 物理坐标系 (SVG 1000x900 空间)
  const anchor = { x: 536, y: 286 }; // 吊灯边缘出绳孔
  const restPos = { x: 536, y: 440 }; // 静止手柄位置

  const [handlePos, setHandlePos] = useState({ x: 536, y: 440 });
  const [curveMid, setCurveMid] = useState({ x: 536, y: 363 });

  // 物理仿真引用
  const posRef = useRef({ x: 536, y: 440 });
  const velRef = useRef({ vx: 0, vy: 0 });
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, handleX: 536, handleY: 440 });
  const animFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const isLitRef = useRef(false);

  useEffect(() => {
    isLitRef.current = isLit;
  }, [isLit]);

  // 阻尼弹簧跳动回弹动画 (2D Damped Harmonic Spring Simulation)
  const startSpringAnimation = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const k = 0.22; // 弹簧劲度
    const damping = 0.82; // 空气阻尼

    const step = () => {
      if (isDraggingRef.current) return;

      const dx = posRef.current.x - restPos.x;
      const dy = posRef.current.y - restPos.y;

      const ax = -k * dx;
      const ay = -k * dy;

      velRef.current.vx = (velRef.current.vx + ax) * damping;
      velRef.current.vy = (velRef.current.vy + ay) * damping;

      posRef.current.x += velRef.current.vx;
      posRef.current.y += velRef.current.vy;

      // 计算绳索自然受力弯曲中点 (Bezier Curve Control Point)
      // 随着手柄横向摆动，绳线产生动态拱形弧度
      const midX = anchor.x + (posRef.current.x - anchor.x) * 0.45 + velRef.current.vx * 1.5;
      const midY = anchor.y + (posRef.current.y - anchor.y) * 0.52;

      setHandlePos({ x: posRef.current.x, y: posRef.current.y });
      setCurveMid({ x: midX, y: midY });

      // 如果振幅足够微小，平稳停靠在静止位
      if (
        Math.abs(dx) < 0.2 &&
        Math.abs(dy) < 0.2 &&
        Math.abs(velRef.current.vx) < 0.2 &&
        Math.abs(velRef.current.vy) < 0.2
      ) {
        posRef.current.x = restPos.x;
        posRef.current.y = restPos.y;
        velRef.current.vx = 0;
        velRef.current.vy = 0;
        setHandlePos(restPos);
        setCurveMid({ x: anchor.x, y: (anchor.y + restPos.y) / 2 });
        return;
      }

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  // 触发通电开关切换 (Toggle On / Off)
  const toggleLamp = useCallback(() => {
    const nextLit = !isLitRef.current;
    setIsLit(nextLit);
    soundManager.playLampSwitch();

    if (nextLit) {
      // 开灯：电弧多段闪烁起辉
      setFlickerLevel(1.2);
      setTimeout(() => setFlickerLevel(0.4), 60);
      setTimeout(() => setFlickerLevel(1.1), 120);
      setTimeout(() => setFlickerLevel(0.9), 180);
      setTimeout(() => setFlickerLevel(1.0), 260);
    } else {
      // 关灯：灯丝余辉迅速熄灭
      setFlickerLevel(0);
    }
  }, []);

  // 鼠标拖拽拉扯事件
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      handleX: posRef.current.x,
      handleY: posRef.current.y,
    };

    soundManager.playCordTension();

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = moveEvent.clientX - dragStartRef.current.mouseX;
      const deltaY = moveEvent.clientY - dragStartRef.current.mouseY;

      // 弹性物理阻尼计算：向下最大拉动 85px，左右可横向摆动 40px
      const targetY = Math.max(restPos.y - 10, Math.min(restPos.y + 85, restPos.y + deltaY * 0.75));
      const targetX = Math.max(anchor.x - 40, Math.min(anchor.x + 40, restPos.x + deltaX * 0.6));

      posRef.current.x = targetX;
      posRef.current.y = targetY;

      // 绳索在受拉力与左右偏转时的真实贝塞尔弯曲弧度
      const curveBow = (targetX - anchor.x) * 0.35;
      const midX = anchor.x + (targetX - anchor.x) * 0.5 + curveBow;
      const midY = anchor.y + (targetY - anchor.y) * 0.52;

      setHandlePos({ x: targetX, y: targetY });
      setCurveMid({ x: midX, y: midY });
    };

    const onMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      const pullDistance = posRef.current.y - restPos.y;

      // 只要下拉超过 24px，或者点击（拉动极小小于 6px），均视作有效触发开/关！
      if (pullDistance > 24 || pullDistance < 6) {
        toggleLamp();
        // 赋予松手时向上的高弹回缩初速度，让绳子向上猛跳再晃动
        velRef.current.vy = -Math.max(16, pullDistance * 0.6);
        velRef.current.vx = (posRef.current.x - anchor.x) * -0.3;
      } else {
        // 轻微拉扯后回弹
        velRef.current.vy = -pullDistance * 0.4;
      }

      startSpringAnimation();
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // 进入主页
  const handleEnterPortfolio = () => {
    try {
      sessionStorage.setItem("ciooool_lamp_intro_done", "true");
    } catch {
      // Ignore
    }
    onClose();
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  if (!isOpen) return null;

  // 沿着贝塞尔曲线动态生成 9 颗圆珠坐标 (Bead distribution along Bezier Curve)
  const beads = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((t) => {
    // 二阶贝塞尔公式: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
    const bx = (1 - t) * (1 - t) * anchor.x + 2 * (1 - t) * t * curveMid.x + t * t * handlePos.x;
    const by = (1 - t) * (1 - t) * anchor.y + 2 * (1 - t) * t * curveMid.y + t * t * handlePos.y;
    return { bx, by };
  });

  const pullThresholdReached = handlePos.y - restPos.y > 24;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center select-none overflow-hidden transition-colors duration-700"
      style={{
        backgroundColor: "#05070F",
        background: isLit
          ? "radial-gradient(ellipse 85% 65% at 50% 25%, #0B192E 0%, #05070F 85%)"
          : "radial-gradient(ellipse 55% 45% at 50% 20%, #080D1E 0%, #05070F 75%)",
      }}
    >
      {/* 顶部工具栏 */}
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
          onClick={handleEnterPortfolio}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#1F2A4D] bg-[#0A0E1A]/80 text-xs font-mono text-[#9FB0D0] hover:text-white hover:border-[#5CF2C4]/50 transition-all backdrop-blur-md"
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

          {/* 点亮时的霓虹高斯光晕 */}
          <radialGradient id="lampBloom" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#5CF2C4" stopOpacity={0.4 * flickerLevel} />
            <stop offset="40%" stopColor="#5CF2C4" stopOpacity={0.15 * flickerLevel} />
            <stop offset="75%" stopColor="#8B7BFF" stopOpacity={0.07 * flickerLevel} />
            <stop offset="100%" stopColor="#8B7BFF" stopOpacity="0" />
          </radialGradient>

          {/* 外层大光锥 */}
          <linearGradient id="beamGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CFFFF0" stopOpacity={0.35 * flickerLevel} />
            <stop offset="30%" stopColor="#5CF2C4" stopOpacity={0.16 * flickerLevel} />
            <stop offset="75%" stopColor="#8B7BFF" stopOpacity={0.06 * flickerLevel} />
            <stop offset="100%" stopColor="#8B7BFF" stopOpacity="0" />
          </linearGradient>

          {/* 内层高亮核心光锥 */}
          <linearGradient id="beamCoreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.5 * flickerLevel} />
            <stop offset="35%" stopColor="#BFF9E7" stopOpacity={0.18 * flickerLevel} />
            <stop offset="100%" stopColor="#BFF9E7" stopOpacity="0" />
          </linearGradient>

          {/* 地面光斑 */}
          <radialGradient id="poolGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A8F7DF" stopOpacity={0.4 * flickerLevel} />
            <stop offset="55%" stopColor="#5CF2C4" stopOpacity={0.14 * flickerLevel} />
            <stop offset="100%" stopColor="#5CF2C4" stopOpacity="0" />
          </radialGradient>

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

        {/* 光束与地面光池 (只有 isLit 为 true 时渲染) */}
        {isLit && (
          <g className="transition-opacity duration-300">
            {/* 顶端全向辉光 */}
            <circle cx="500" cy="310" r="420" fill="url(#lampBloom)" />

            {/* 外层大光束 */}
            <path
              d="M 500 290 L 100 900 L 900 900 Z"
              fill="url(#beamGrad)"
              filter="url(#beamSoft)"
            />

            {/* 内层核心聚光束 */}
            <path
              d="M 500 290 L 280 900 L 720 900 Z"
              fill="url(#beamCoreGrad)"
              filter="url(#beamSoft)"
            />

            {/* 地面椭圆光斑 */}
            <ellipse cx="500" cy="850" rx="420" ry="55" fill="url(#poolGrad)" />

            {/* 浮尘光粒 */}
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

        {/* 工业喇叭灯罩与灯泡 */}
        <g id="lampBody">
          <rect x="492" y="150" width="16" height="20" rx="3" fill="url(#lampMetal)" />
          <path d="M 484 168 H 516 V 180 A 4 4 0 0 1 512 184 H 488 A 4 4 0 0 1 484 180 Z" fill="url(#lampMetal)" />

          <path
            d="M 482 184 C 440 186 398 234 394 286 L 606 286 C 602 234 560 186 518 184 Z"
            fill="url(#shadeBody)"
            stroke={isLit ? "#5CF2C4" : "#2A3654"}
            strokeWidth="1.5"
            strokeOpacity={isLit ? "0.85" : "0.5"}
          />
          <path
            d="M 440 200 C 420 220 405 255 400 280"
            fill="none"
            stroke="#C8D4F5"
            strokeOpacity="0.22"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          <ellipse cx="500" cy="286" rx="106" ry="14" fill={isLit ? "#051A18" : "#04070F"} stroke="#3A4668" strokeWidth="1.5" />
          {isLit && (
            <ellipse cx="500" cy="286" rx="104" ry="13" fill="#5CF2C4" fillOpacity="0.25" filter="url(#softGlow)" />
          )}

          {/* 灯泡与灯丝 */}
          <circle
            cx="500"
            cy="296"
            r="24"
            fill={isLit ? "#FFFFFF" : "#1B2338"}
            stroke={isLit ? "#5CF2C4" : "#445070"}
            strokeWidth="2"
            filter={isLit ? "url(#softGlow)" : undefined}
          />

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

          {isLit && (
            <circle cx="500" cy="298" r="48" fill="#5CF2C4" fillOpacity={0.45 * flickerLevel} filter="url(#softGlow)" />
          )}
        </g>

        {/* 物理可弯曲弹簧拉绳链条 (Pull Chain with Bezier Curvature) */}
        <g id="pullChain">
          {/* 弯曲金属线 */}
          <path
            d={`M ${anchor.x} ${anchor.y} Q ${curveMid.x} ${curveMid.y} ${handlePos.x} ${handlePos.y}`}
            fill="none"
            stroke="#637096"
            strokeWidth="2"
          />

          {/* 沿贝塞尔曲线摆动的金属圆珠 */}
          {beads.map((bead, idx) => (
            <circle
              key={idx}
              cx={bead.bx}
              cy={bead.by}
              r="3.2"
              fill="#9BA8C7"
              stroke="#2B344D"
              strokeWidth="0.8"
            />
          ))}

          {/* 金属拉绳手柄 */}
          <g transform={`translate(${handlePos.x}, ${handlePos.y})`}>
            <rect x="-3.5" y="-2" width="7" height="5" rx="1.5" fill="#8D96B3" />
            <rect
              x="-8.5"
              y="3"
              width="17"
              height="32"
              rx="8.5"
              fill="url(#handleBody)"
              stroke={pullThresholdReached ? "#5CF2C4" : isLit ? "#5CF2C4" : "#8B7BFF"}
              strokeWidth="1.8"
              filter={pullThresholdReached || isLit ? "url(#softGlow)" : undefined}
            />
            {/* 呼吸发光装饰槽 */}
            <rect
              x="-8.5"
              y="22"
              width="17"
              height="4.5"
              fill={isLit ? "#5CF2C4" : "#8B7BFF"}
              className="animate-pulse"
              filter="url(#softGlow)"
            />
            <ellipse cx="-3" cy="13" rx="1.5" ry="6" fill="#FFFFFF" opacity="0.35" />
          </g>
        </g>
      </svg>

      {/* 纯鼠标交互抓取手柄层 (Mouse Drag Hitbox) */}
      <div
        className="absolute z-30 cursor-grab active:cursor-grabbing flex flex-col items-center pointer-events-auto"
        style={{
          left: `${(handlePos.x / 1000) * 100}%`,
          top: `${(handlePos.y / 900) * 100}%`,
          transform: "translate(-50%, -15px)",
        }}
        onMouseDown={handleMouseDown}
      >
        {/* 宽大受力触控热区 */}
        <div className="w-24 h-24 flex items-center justify-center">
          <div
            className={`w-10 h-16 rounded-full border border-dashed transition-all duration-150 ${
              isDragging
                ? "border-[#5CF2C4] bg-[#5CF2C4]/25 scale-110 shadow-[0_0_20px_rgba(92,242,196,0.6)]"
                : "border-[#8B7BFF]/40 hover:border-[#5CF2C4] hover:bg-[#5CF2C4]/15"
            }`}
          />
        </div>

        {/* 动态拉力状态徽标 */}
        <div className="flex flex-col items-center mt-1 pointer-events-none transition-all">
          <span
            className={`text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full border transition-all ${
              pullThresholdReached
                ? "border-[#5CF2C4] text-[#5CF2C4] bg-[#5CF2C4]/25 scale-105 shadow-[0_0_15px_rgba(92,242,196,0.5)]"
                : "border-[#1F2A4D] text-[#8B7BFF] bg-[#0A0E1A]/90"
            }`}
          >
            {isDragging
              ? pullThresholdReached
                ? isLit
                  ? "RELEASE TO TURN OFF 🌙"
                  : "RELEASE TO TURN ON ⚡"
                : "KEEP PULLING DOWN..."
              : isLit
              ? "PULL TO TURN OFF"
              : "PULL TO TURN ON"}
          </span>
          <span className="text-[10px] font-mono text-[#7D88AA] mt-1 opacity-75">
            {isDragging ? "松开鼠标切换" : "按住鼠标下拉 / 单击拉绳"}
          </span>
        </div>
      </div>

      {/* 底部进入工坊与状态引导 (点亮后呈现) */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center justify-center text-center px-4">
        {isLit ? (
          <div className="flex flex-col items-center animate-fade-in">
            <p className="text-xs sm:text-sm font-mono text-[#5CF2C4] tracking-wider mb-3 drop-shadow-[0_0_10px_rgba(92,242,196,0.5)]">
              ATELIER ILLUMINATED · 工坊已点亮
            </p>
            <button
              onClick={handleEnterPortfolio}
              className="group flex items-center gap-2.5 px-7 py-3 rounded-xl bg-[#5CF2C4] text-[#05070F] font-mono text-xs font-bold tracking-wider hover:bg-[#7DF9D2] hover:shadow-[0_0_30px_rgba(92,242,196,0.6)] hover:scale-105 transition-all shadow-lg"
            >
              <span>步入 Ciooool Atelier 工坊</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="text-xl sm:text-2xl font-mono text-[#EAF0FF] tracking-wider mb-1.5">
              CIOOOUL ATELIER
            </h2>
            <p className="text-xs sm:text-sm font-mono text-[#7D88AA]">
              全屏暗室沉浸模式 · 用鼠标拉动链绳开灯
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
