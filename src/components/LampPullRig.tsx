"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { soundManager } from "@/utils/audio";
import { Volume2, VolumeX, X, ArrowRight } from "lucide-react";

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
  const [isExiting, setIsExiting] = useState(false);

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
  const dragStartYRef = useRef(440);

  useEffect(() => {
    isLitRef.current = isLit;
  }, [isLit]);

  // 退出过渡
  const handleExit = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    soundManager.playClick();
    setTimeout(() => {
      onClose();
      setIsExiting(false);
    }, 550);
  }, [isExiting, onClose]);

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

  const toggleLamp = useCallback(() => {
    const nextLit = !isLitRef.current;
    setIsLit(nextLit);
    soundManager.playLampSwitch();
    if (onToggleLight) onToggleLight(nextLit);

    if (nextLit) {
      setFlickerLevel(1.2);
      setTimeout(() => setFlickerLevel(0.25), 45);
      setTimeout(() => setFlickerLevel(1.15), 90);
      setTimeout(() => setFlickerLevel(0.65), 140);
      setTimeout(() => setFlickerLevel(1.0), 200);
    } else {
      setFlickerLevel(0);
    }
  }, [onToggleLight]);

  // 键盘快捷
  useEffect(() => {
    if (!isOpen) return;
    setIsExiting(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleExit();
      } else if (e.key === "Enter" || e.key === " ") {
        if (!isLitRef.current) {
          toggleLamp();
          startSpringAnimation();
        } else {
          handleExit();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleExit, toggleLamp, startSpringAnimation]);

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

    const svgPt = getSvgPoint(e.clientX, e.clientY);
    dragStartYRef.current = svgPt.y;

    soundManager.playCordTension();

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const currentSvgPt = getSvgPoint(moveEvent.clientX, moveEvent.clientY);
      const deltaY = currentSvgPt.y - dragStartYRef.current;
      const deltaX = currentSvgPt.x - anchor.x;

      const targetY = Math.max(
        restPos.y - 12,
        Math.min(restPos.y + 110, restPos.y + deltaY * 0.85)
      );
      const targetX = Math.max(
        anchor.x - 55,
        Math.min(anchor.x + 55, restPos.x + deltaX * 0.7)
      );

      posRef.current.x = targetX;
      posRef.current.y = targetY;

      const bow = (targetX - anchor.x) * 0.45;
      const midX = anchor.x + (targetX - anchor.x) * 0.5 + bow;
      const midY = anchor.y + (targetY - anchor.y) * 0.52;

      setHandlePos({ x: targetX, y: targetY });
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

  if (!isOpen) return null;

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
      className={`fixed inset-0 z-50 flex items-center justify-center select-none overflow-hidden transition-all duration-600 ease-out ${
        isExiting ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        backgroundColor: "#05070F",
        background: isLit
          ? "radial-gradient(ellipse 95% 75% at 50% 25%, #0A162B 0%, #05070F 85%)"
          : "radial-gradient(ellipse 65% 55% at 50% 20%, #070B17 0%, #05070F 80%)",
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
          className="p-2.5 rounded-full border border-[#1F2A4D] bg-[#0A0E1A]/80 text-[#9FB0D0] hover:text-[#5CF2C4] hover:border-[#5CF2C4]/60 transition-all backdrop-blur-sm cursor-pointer"
          title={isMuted ? "开启音效" : "静音"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={handleExit}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#1F2A4D] bg-[#0A0E1A]/80 text-[#9FB0D0] hover:text-[#5CF2C4] hover:border-[#5CF2C4]/60 text-xs font-mono transition-all backdrop-blur-sm cursor-pointer"
        >
          <span>进入工坊</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SVG 吊灯与拉绳核心画布 */}
      <svg
        ref={svgRef}
        viewBox="0 0 1000 900"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-visible"
      >
        <defs>
          <linearGradient id="lampMetal2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#121625" />
            <stop offset="40%" stopColor="#4B5577" />
            <stop offset="60%" stopColor="#2A3149" />
            <stop offset="100%" stopColor="#0D101B" />
          </linearGradient>

          <linearGradient id="shadeBody2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#080B15" />
            <stop offset="25%" stopColor="#1B2238" />
            <stop offset="45%" stopColor="#36415F" />
            <stop offset="75%" stopColor="#121729" />
            <stop offset="100%" stopColor="#070910" />
          </linearGradient>

          <radialGradient id="lampBloom2" cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#5CF2C4" stopOpacity={0.28 * flickerLevel} />
            <stop offset="40%" stopColor="#5CF2C4" stopOpacity={0.08 * flickerLevel} />
            <stop offset="75%" stopColor="#8B7BFF" stopOpacity={0.04 * flickerLevel} />
            <stop offset="100%" stopColor="#8B7BFF" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="beamGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#CFFFF0" stopOpacity={0.3 * flickerLevel} />
            <stop offset="35%" stopColor="#5CF2C4" stopOpacity={0.12 * flickerLevel} />
            <stop offset="75%" stopColor="#8B7BFF" stopOpacity={0.04 * flickerLevel} />
            <stop offset="100%" stopColor="#8B7BFF" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="poolGrad2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A8F7DF" stopOpacity={0.35 * flickerLevel} />
            <stop offset="60%" stopColor="#5CF2C4" stopOpacity={0.09 * flickerLevel} />
            <stop offset="100%" stopColor="#5CF2C4" stopOpacity="0" />
          </radialGradient>

          <filter id="softGlow2" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="beamSoft2" x="-30%" y="-10%" width="160%" height="120%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>

        {/* 光束与地面光斑 */}
        {isLit && (
          <g className="transition-opacity duration-300">
            <circle cx="500" cy="310" r="420" fill="url(#lampBloom2)" />
            <path
              d="M 500 290 L 100 900 L 900 900 Z"
              fill="url(#beamGrad2)"
              filter="url(#beamSoft2)"
            />
            <ellipse cx="500" cy="850" rx="420" ry="55" fill="url(#poolGrad2)" />
          </g>
        )}

        {/* 吊索 */}
        <line x1="500" y1="0" x2="500" y2="160" stroke="#1E263D" strokeWidth="3" />

        {/* 灯罩主体 */}
        <g id="lampBody">
          <rect x="494" y="160" width="12" height="18" rx="2.5" fill="url(#lampMetal2)" />
          <path
            d="M 487 178 H 513 V 190 A 4 4 0 0 1 509 194 H 491 A 4 4 0 0 1 487 190 Z"
            fill="url(#lampMetal2)"
          />
          <path
            d="M 485 192 C 440 195 390 230 380 286 L 620 286 C 610 230 560 195 515 192 Z"
            fill="url(#shadeBody2)"
            stroke={isLit ? "#5CF2C4" : "#1F2A4D"}
            strokeWidth="1.2"
          />
          <ellipse
            cx="500"
            cy="286"
            rx="120"
            ry="16"
            fill={isLit ? "#0E1A29" : "#060912"}
            stroke={isLit ? "#5CF2C4" : "#2A3655"}
            strokeWidth="1.5"
          />

          {/* 灯泡 */}
          <circle
            cx="500"
            cy="295"
            r="30"
            fill={isLit ? "#5CF2C4" : "#1A2238"}
            filter={isLit ? "url(#softGlow2)" : undefined}
          />
          {isLit && (
            <circle cx="500" cy="295" r="16" fill="#FFFFFF" filter="url(#softGlow2)" />
          )}
        </g>

        {/* 柔性拉绳与滚珠 */}
        <path
          d={`M ${anchor.x} ${anchor.y} Q ${curveMid.x} ${curveMid.y} ${handlePos.x} ${handlePos.y}`}
          fill="none"
          stroke={isLit ? "#5CF2C4" : "#596282"}
          strokeWidth="1.6"
          strokeOpacity={isLit ? 0.75 : 0.6}
        />

        {beads.map((b, i) => (
          <circle
            key={i}
            cx={b.bx}
            cy={b.by}
            r="2.2"
            fill={isLit ? "#A7F3D0" : "#8D96B3"}
          />
        ))}

        {/* 拉绳末端金属手柄 */}
        <g
          transform={`translate(${handlePos.x}, ${handlePos.y})`}
          className="cursor-pointer pointer-events-auto"
          onPointerDown={handlePointerDown}
        >
          <circle cx="0" cy="18" r="32" fill="transparent" />
          <rect
            x="-7"
            y="4"
            width="14"
            height="28"
            rx="7"
            fill={isLit ? "#112632" : "#10162A"}
            stroke={isLit ? "#5CF2C4" : "#8B7BFF"}
            strokeWidth="1.4"
          />
          <rect
            x="-6"
            y="20"
            width="12"
            height="3.5"
            rx="1"
            fill={isLit ? "#5CF2C4" : "#8B7BFF"}
            filter="url(#softGlow2)"
          />

          {/* 交互提示气泡 */}
          <g transform="translate(18, 14)">
            {isDragging ? (
              <g>
                <rect
                  x="-6"
                  y="-14"
                  width="135"
                  height="26"
                  rx="13"
                  fill="#0A0E1A"
                  fillOpacity="0.9"
                  stroke={pullThresholdReached ? "#5CF2C4" : "#8B7BFF"}
                  strokeWidth="1.2"
                />
                <text
                  x="8"
                  y="4"
                  fill={pullThresholdReached ? "#5CF2C4" : "#8B7BFF"}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {pullThresholdReached
                    ? isLit
                      ? "RELEASE TO TURN OFF 🌙"
                      : "RELEASE TO TURN ON ⚡"
                    : "KEEP PULLING DOWN..."}
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
      <div className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-auto">
        {isLit ? (
          <div className="flex flex-col items-center">
            <p className="text-xs font-mono text-[#5CF2C4] tracking-widest mb-3 uppercase">
              ✦ Atelier Illuminated · 工坊已点亮 ✦
            </p>
            <button
              onClick={handleExit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5CF2C4] text-[#05070F] font-mono text-xs font-bold tracking-wider hover:bg-[#7DF9D2] hover:shadow-[0_0_25px_rgba(92,242,196,0.5)] transition-all cursor-pointer"
            >
              <span>步入工坊</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <p className="text-[11px] font-mono text-[#7D88AA] mt-2">
              可继续下拉拉绳关灯，或按 Enter 键直接进入
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="text-xl sm:text-2xl font-mono text-[#EAF0FF] tracking-wider mb-1.5 font-bold">
              CIOOOUL ATELIER
            </h2>
            <p className="text-xs font-mono text-[#7D88AA]">
              按住鼠标下拉拉绳开灯 · 松手点亮 (支持 Enter 键)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
