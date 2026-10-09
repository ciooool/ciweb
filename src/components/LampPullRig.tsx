"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { soundManager } from "@/utils/audio";
import { Volume2, VolumeX, X, ArrowUp } from "lucide-react";

interface LampPullRigProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleLight?: (isLit: boolean) => void;
}

export default function LampPullRig({
  isOpen,
  onClose,
  onToggleLight,
}: LampPullRigProps) {
  const [isLit, setIsLit] = useState(false);
  const [flickerLevel, setFlickerLevel] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // 核心幕布位置: 'down' (全屏遮罩) | 'up' (升起到天花板上方)
  const [curtainPos, setCurtainPos] = useState<'down' | 'up'>(isOpen ? 'down' : 'up');

  const svgRef = useRef<SVGSVGElement>(null);

  // 物理坐标系统 (SVG 1000x900 空间)
  const anchor = { x: 536, y: 286 };
  const restPos = { x: 536, y: 440 };

  const [handlePos, setHandlePos] = useState({ x: 536, y: 440 });
  const [curveMid, setCurveMid] = useState({ x: 536, y: 363 });

  const posRef = useRef({ x: 536, y: 440 });
  const velRef = useRef({ vx: 0, vy: 0 });
  const animFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const isLitRef = useRef(false);

  useEffect(() => {
    isLitRef.current = isLit;
  }, [isLit]);

  // 阻尼回弹振荡
  const startSpringAnimation = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const k = 0.28;
    const damping = 0.85;

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

      const midX =
        anchor.x + (posRef.current.x - anchor.x) * 0.48 + velRef.current.vx * 1.5;
      const midY = anchor.y + (posRef.current.y - anchor.y) * 0.52;

      setHandlePos({ x: posRef.current.x, y: posRef.current.y });
      setCurveMid({ x: midX, y: midY });

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

  // 帷幕向上卷起升起，自动进入
  const triggerCurtainLift = useCallback(() => {
    setCurtainPos('up');
    soundManager.playClick();
    setTimeout(() => {
      onClose();
    }, 950);
  }, [onClose]);

  // 点亮 / 熄灭吊灯并在点亮后自动升起帷幕
  const toggleLamp = useCallback(() => {
    const nextLit = !isLitRef.current;
    setIsLit(nextLit);
    soundManager.playLampSwitch();
    if (onToggleLight) onToggleLight(nextLit);

    if (nextLit) {
      // 3段高频电弧爆闪
      setFlickerLevel(1.2);
      setTimeout(() => setFlickerLevel(0.25), 45);
      setTimeout(() => setFlickerLevel(1.15), 90);
      setTimeout(() => setFlickerLevel(0.65), 140);
      setTimeout(() => setFlickerLevel(1.0), 200);

      // 点亮约 380ms 稳定后，自动如大剧场幕布般向上优雅拉起，自动进入！
      setTimeout(() => {
        triggerCurtainLift();
      }, 380);
    } else {
      setFlickerLevel(0);
    }
  }, [onToggleLight, triggerCurtainLift]);

  // 监听外部 isOpen 变化（例如从右上角常驻吊灯拉动关灯降幕）
  useEffect(() => {
    if (isOpen) {
      // 帷幕平滑自上方滑落覆盖全屏
      setCurtainPos('down');
      setIsLit(false);
      setFlickerLevel(0);
    } else {
      setCurtainPos('up');
    }
  }, [isOpen]);

  // 键盘快捷键监听
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerCurtainLift();
      } else if (e.key === "Enter" || e.key === " ") {
        if (!isLitRef.current) {
          toggleLamp();
          startSpringAnimation();
        } else {
          triggerCurtainLift();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, triggerCurtainLift, toggleLamp, startSpringAnimation]);

  const getSvgPoint = (clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 536, y: 440 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svgRef.current.getScreenCTM();
    if (ctm) {
      return pt.matrixTransform(ctm.inverse());
    }
    return { x: 536, y: 440 };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    setIsDragging(true);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const initial = getSvgPoint(e.clientX, e.clientY);
    const startOffset = {
      x: posRef.current.x - initial.x,
      y: posRef.current.y - initial.y,
    };

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const current = getSvgPoint(moveEvent.clientX, moveEvent.clientY);

      let targetX = current.x + startOffset.x;
      let targetY = current.y + startOffset.y;

      const maxRadius = 140;
      const maxDy = 120;

      const dx = targetX - restPos.x;
      const dy = Math.max(0, Math.min(maxDy, targetY - restPos.y));

      const clampedX = restPos.x + Math.max(-maxRadius, Math.min(maxRadius, dx * 0.7));
      const clampedY = restPos.y + dy;

      posRef.current.x = clampedX;
      posRef.current.y = clampedY;

      const midX = anchor.x + (clampedX - anchor.x) * 0.5 + (clampedX - restPos.x) * 0.15;
      const midY = anchor.y + (clampedY - anchor.y) * 0.5;

      setHandlePos({ x: clampedX, y: clampedY });
      setCurveMid({ x: midX, y: midY });
    };

    const onPointerUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);

      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);

      const pullDistance = posRef.current.y - restPos.y;

      if (pullDistance >= 22 || pullDistance <= 6) {
        toggleLamp();
        velRef.current.vy = -Math.max(22, pullDistance * 0.8);
        velRef.current.vx = (posRef.current.x - anchor.x) * -0.4;
      } else {
        velRef.current.vy = -pullDistance * 0.5;
      }

      startSpringAnimation();
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const beads = [0.1, 0.19, 0.28, 0.37, 0.46, 0.55, 0.64, 0.73, 0.82, 0.91].map(
    (t) => {
      const bx =
        (1 - t) * (1 - t) * anchor.x +
        2 * (1 - t) * t * curveMid.x +
        t * t * handlePos.x;
      const by =
        (1 - t) * (1 - t) * anchor.y +
        2 * (1 - t) * t * curveMid.y +
        t * t * handlePos.y;
      return { bx, by };
    }
  );

  const pullThresholdReached = handlePos.y - restPos.y >= 22;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center select-none overflow-hidden transition-transform duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        curtainPos === 'up' ? "-translate-y-full pointer-events-none" : "translate-y-0 pointer-events-auto"
      }`}
      style={{
        backgroundColor: "#05070F",
        background: isLit
          ? "radial-gradient(ellipse 95% 75% at 50% 25%, #0A162B 0%, #05070F 85%)"
          : "radial-gradient(ellipse 65% 55% at 50% 20%, #070B17 0%, #05070F 80%)",
        boxShadow: "0 40px 100px rgba(0,0,0,0.95), 0 15px 35px rgba(92,242,196,0.18)",
        willChange: "transform",
      }}
    >
      {/* 顶部工具栏 (静音与跳过按键) */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <button
          onClick={() => {
            const next = !isMuted;
            setIsMuted(next);
            soundManager.setMuted(next);
          }}
          className="p-2.5 rounded-full border border-[#1F2A4D] bg-[#0A0E1A]/80 text-[#9FB0D0] hover:text-[#5CF2C4] hover:border-[#5CF2C4]/60 transition-all backdrop-blur-sm cursor-pointer"
          title={isMuted ? "开启音效" : "静音"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={triggerCurtainLift}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#1F2A4D] bg-[#0A0E1A]/80 text-[#9FB0D0] hover:text-[#5CF2C4] hover:border-[#5CF2C4]/60 text-xs font-mono transition-all backdrop-blur-sm cursor-pointer"
          title="跳过并升起帷幕"
        >
          <span>进入工坊</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 物理吊灯主 SVG 画布 */}
      <svg
        ref={svgRef}
        viewBox="0 0 1000 900"
        className="w-full h-full max-w-5xl max-h-[90vh] pointer-events-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* 大范围发光径向滤镜 */}
          <radialGradient
            id="lampGlowBeam"
            cx="50%"
            cy="30%"
            r="60%"
            fx="50%"
            fy="25%"
          >
            <stop offset="0%" stopColor="#5CF2C4" stopOpacity={0.85 * flickerLevel} />
            <stop offset="25%" stopColor="#2AE2B1" stopOpacity={0.45 * flickerLevel} />
            <stop offset="55%" stopColor="#7E57C2" stopOpacity={0.25 * flickerLevel} />
            <stop offset="85%" stopColor="#0B1226" stopOpacity={0.08 * flickerLevel} />
            <stop offset="100%" stopColor="#05070F" stopOpacity="0" />
          </radialGradient>

          {/* 聚光圆锥光束 */}
          <linearGradient id="coneBeam" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#5CF2C4" stopOpacity={0.55 * flickerLevel} />
            <stop offset="60%" stopColor="#5CF2C4" stopOpacity={0.15 * flickerLevel} />
            <stop offset="100%" stopColor="#5CF2C4" stopOpacity="0" />
          </linearGradient>

          {/* 灯罩金属渐变 */}
          <linearGradient id="shadeMetal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#121828" />
            <stop offset="35%" stopColor="#253554" />
            <stop offset="50%" stopColor="#3C527D" />
            <stop offset="65%" stopColor="#253554" />
            <stop offset="100%" stopColor="#0E1320" />
          </linearGradient>

          {/* 铜黄金属高光渐变 */}
          <linearGradient id="brassGlint" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5D061" />
            <stop offset="50%" stopColor="#E5B233" />
            <stop offset="100%" stopColor="#8A6310" />
          </linearGradient>

          {/* 拉线拉坠渐变 */}
          <radialGradient id="acornShine" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#5CF2C4" />
            <stop offset="100%" stopColor="#1B8065" />
          </radialGradient>

          {/* 漫反射光晕滤镜 */}
          <filter id="bloomSoft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="28" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. 广域背景环境辉光池 */}
        {isLit && (
          <g className="transition-opacity duration-300">
            <ellipse
              cx="500"
              cy="340"
              rx="460"
              ry="380"
              fill="url(#lampGlowBeam)"
              filter="url(#bloomSoft)"
            />
            <polygon
              points="450,260 550,260 820,880 180,880"
              fill="url(#coneBeam)"
            />
          </g>
        )}

        {/* 2. 顶部天花板基座与悬垂电缆 */}
        <g id="ceilingFixture">
          <ellipse cx="500" cy="0" rx="42" ry="12" fill="#1C273E" stroke="#3A4D73" strokeWidth="1" />
          <line
            x1="500"
            y1="0"
            x2="500"
            y2="170"
            stroke="#121826"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line
            x1="499"
            y1="0"
            x2="499"
            y2="170"
            stroke="#2B3C5E"
            strokeWidth="1"
          />
        </g>

        {/* 3. 吊灯金属主体结构 (复古工业工坊吊灯) */}
        <g id="lampStructure">
          <rect x="492" y="165" width="16" height="22" rx="3" fill="url(#brassGlint)" />
          <polygon
            points="500,185 410,250 590,250"
            fill="url(#shadeMetal)"
            stroke="#3C527D"
            strokeWidth="1.5"
          />
          <ellipse
            cx="500"
            cy="250"
            rx="90"
            ry="18"
            fill="#121828"
            stroke="#5CF2C4"
            strokeWidth={isLit ? "2" : "0.5"}
            strokeOpacity={isLit ? "0.9" : "0.3"}
          />
          <ellipse
            cx="500"
            cy="254"
            rx="82"
            ry="12"
            fill={isLit ? "#5CF2C4" : "#0A0F1D"}
            fillOpacity={isLit ? 0.9 * flickerLevel : 0.6}
            filter={isLit ? "url(#bloomSoft)" : undefined}
          />
          <path
            d="M486 250 C486 270 492 284 500 284 C508 284 514 270 514 250 Z"
            fill={isLit ? "#FFFFFF" : "#1B2438"}
            fillOpacity={isLit ? 0.95 * flickerLevel : 0.7}
            stroke={isLit ? "#5CF2C4" : "#303F5E"}
            strokeWidth="1"
          />
          {isLit && (
            <path
              d="M495 260 Q500 252 505 260"
              stroke="#FFF"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              filter="url(#bloomSoft)"
            />
          )}
          <circle cx="536" cy="286" r="4.5" fill="url(#brassGlint)" stroke="#4A3405" strokeWidth="1" />
        </g>

        {/* 4. 物理交互拉绳体系 */}
        <g id="pullCordSystem">
          <path
            d={`M ${anchor.x} ${anchor.y} Q ${curveMid.x} ${curveMid.y} ${handlePos.x} ${handlePos.y}`}
            fill="none"
            stroke={isLit ? "#7DF9D2" : "#9FB0D0"}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="4 2"
          />
          {beads.map((b, i) => (
            <circle
              key={i}
              cx={b.bx}
              cy={b.by}
              r={1.8}
              fill={isLit ? "#5CF2C4" : "#6E80A4"}
              opacity="0.85"
            />
          ))}
          <g
            transform={`translate(${handlePos.x}, ${handlePos.y})`}
            className="cursor-grab active:cursor-grabbing pointer-events-auto"
            onPointerDown={handlePointerDown}
          >
            <circle
              cx="0"
              cy="0"
              r="34"
              fill="transparent"
              className="cursor-grab active:cursor-grabbing"
            />
            {pullThresholdReached && (
              <circle
                cx="0"
                cy="0"
                r="18"
                fill="none"
                stroke="#5CF2C4"
                strokeWidth="1.5"
                strokeDasharray="3 2"
                className="animate-spin"
                style={{ animationDuration: "3s" }}
              />
            )}
            <ellipse
              cx="0"
              cy="0"
              rx="6"
              ry="11"
              fill="url(#acornShine)"
              stroke="#135242"
              strokeWidth="1"
            />
            <ellipse cx="-1.5" cy="-3" rx="1.5" ry="3.5" fill="#FFFFFF" opacity="0.75" />
            <circle cx="0" cy="11" r="2.2" fill="url(#brassGlint)" />

            {/* 拉拽状态文字提示 */}
            {isDragging ? (
              <g className="transition-opacity duration-150">
                <rect
                  x="-75"
                  y="-26"
                  width="150"
                  height="22"
                  rx="11"
                  fill="#0A0E1A"
                  fillOpacity="0.9"
                  stroke={pullThresholdReached ? "#5CF2C4" : "#2E3F66"}
                  strokeWidth="1.2"
                />
                <text
                  x="0"
                  y="-11"
                  textAnchor="middle"
                  fill={pullThresholdReached ? "#5CF2C4" : "#8A9CBF"}
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {pullThresholdReached ? "松手点亮 ⚡" : "继续向下拉动..."}
                </text>
              </g>
            ) : (
              <g className="animate-bounce" style={{ animationDuration: "2s" }}>
                <rect
                  x="-8"
                  y="-14"
                  width="110"
                  height="26"
                  rx="13"
                  fill="#0A0E1A"
                  fillOpacity="0.85"
                  stroke="#1F2A4D"
                  strokeWidth="1"
                />
                <text
                  x="6"
                  y="4"
                  fill="#5CF2C4"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                  letterSpacing="0.1em"
                >
                  {isLit ? "PULL TO OFF ↓" : "PULL TO ON ↓"}
                </text>
              </g>
            )}
          </g>
        </g>
      </svg>

      {/* 底部引导文案 */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        {curtainPos === 'up' ? (
          <div className="flex flex-col items-center animate-pulse">
            <p className="text-xs font-mono text-[#5CF2C4] tracking-widest uppercase">
              ✦ 帷幕升起 · 自动步入工坊 ✦
            </p>
          </div>
        ) : isLit ? (
          <div className="flex flex-col items-center">
            <p className="text-xs font-mono text-[#5CF2C4] tracking-widest uppercase">
              ✦ Atelier Illuminated · 正在为你揭幕 ✦
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="text-xl sm:text-2xl font-mono text-[#EAF0FF] tracking-wider mb-1.5 font-bold">
              CIOOOUL ATELIER
            </h2>
            <p className="text-xs font-mono text-[#7D88AA]">
              按住鼠标下拉拉绳点亮 · 松手自动升起帷幕
            </p>
          </div>
        )}
      </div>

      {/* 帷幕底部金属质感饰边条 (提升卷起时的物理重量感) */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#5CF2C4]/40 to-transparent border-b-2 border-[#5CF2C4]/60 pointer-events-none" />
    </div>
  );
}
