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
  const [isExiting, setIsExiting] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);

  // 物理坐标系 (SVG 1000x900 空间)
  const anchor = { x: 536, y: 286 }; // 吊灯边缘出绳孔
  const restPos = { x: 536, y: 440 }; // 静止手柄位置

  const [handlePos, setHandlePos] = useState({ x: 536, y: 440 });
  const [curveMid, setCurveMid] = useState({ x: 536, y: 363 });

  // 物理仿真状态
  const posRef = useRef({ x: 536, y: 440 });
  const velRef = useRef({ vx: 0, vy: 0 });
  const animFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const isLitRef = useRef(false);
  const dragStartYRef = useRef(440);

  useEffect(() => {
    isLitRef.current = isLit;
  }, [isLit]);

  // 进入工坊 (平滑仪式感过渡)
  const handleEnterPortfolio = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    soundManager.playClick();
    try {
      sessionStorage.setItem("ciooool_lamp_intro_done", "true");
    } catch {
      // Ignore
    }
    setTimeout(() => {
      onClose();
      setIsExiting(false);
    }, 600);
  }, [isExiting, onClose]);

  // 键盘快捷支持 (Enter/Space拉灯开灯，ESC跳过进入)
  useEffect(() => {
    if (!isOpen) return;
    setIsExiting(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleEnterPortfolio();
      } else if (e.key === "Enter" || e.key === " ") {
        if (!isLitRef.current) {
          toggleLamp();
          startSpringAnimation();
        } else {
          handleEnterPortfolio();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleEnterPortfolio]);

  // 阻尼弹簧跳动回弹动画 (2D Damped Harmonic Spring Simulation)
  const startSpringAnimation = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const k = 0.28; // 弹簧劲度系数
    const damping = 0.85; // 空气阻尼系数

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

      // 绳索在振荡时的柔性贝塞尔弯曲弧度
      const midX = anchor.x + (posRef.current.x - anchor.x) * 0.48 + velRef.current.vx * 1.5;
      const midY = anchor.y + (posRef.current.y - anchor.y) * 0.52;

      setHandlePos({ x: posRef.current.x, y: posRef.current.y });
      setCurveMid({ x: midX, y: midY });

      // 当振幅与速度极小时稳定静止
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

  // 触发通电开关双向切换 (Toggle On / Off)
  const toggleLamp = useCallback(() => {
    const nextLit = !isLitRef.current;
    setIsLit(nextLit);
    soundManager.playLampSwitch();

    if (nextLit) {
      setFlickerLevel(1.2);
      setTimeout(() => setFlickerLevel(0.2), 45);
      setTimeout(() => setFlickerLevel(1.15), 90);
      setTimeout(() => setFlickerLevel(0.6), 140);
      setTimeout(() => setFlickerLevel(1.0), 200);
    } else {
      setFlickerLevel(0);
    }
  }, []);

  // 将屏幕坐标精准转换为 SVG 内部坐标 (100% 解决不同屏幕比例变形与错位)
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

  // 纯鼠标拉绳交互 (Pointer Events)
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

      // 弹性物理阻尼：向下最大拉动 105px，左右侧摆 55px
      const targetY = Math.max(restPos.y - 12, Math.min(restPos.y + 105, restPos.y + deltaY * 0.85));
      const targetX = Math.max(anchor.x - 55, Math.min(anchor.x + 55, restPos.x + deltaX * 0.7));

      posRef.current.x = targetX;
      posRef.current.y = targetY;

      // 自然弓形贝塞尔曲线控制点
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

      // 达到阈值 (>= 22px) 或单击轻点 (<= 6px) 触发切换
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

  // 贝塞尔曲线上均匀分布 10 颗高质感圆珠
  const beads = [0.1, 0.19, 0.28, 0.37, 0.46, 0.55, 0.64, 0.73, 0.82, 0.91].map((t) => {
    const bx = (1 - t) * (1 - t) * anchor.x + 2 * (1 - t) * t * curveMid.x + t * t * handlePos.x;
    const by = (1 - t) * (1 - t) * anchor.y + 2 * (1 - t) * t * curveMid.y + t * t * handlePos.y;
    return { bx, by };
  });

  const pullThresholdReached = handlePos.y - restPos.y >= 22;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center select-none overflow-hidden transition-all duration-700 ease-out ${
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
          className="p-2.5 rounded-full border border-[#1F2A4D] bg-[#0A0E1A]/80 text-[#9FB0D0] hover:text-[#5CF2C4] hover:border-[#5CF2C4]/60 transition-all backdrop-blur-sm"
          title={isMuted ? "开启音效" : "静音"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={handleEnterPortfolio}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#1F2A4D] bg-[#0A0E1A]/80 text-[#9FB0D0] hover:text-[#5CF2C4] hover:border-[#5CF2C4]/60 text-xs font-mono transition-all backdrop-blur-sm"
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
          <linearGradient id="lampMetal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#121625" />
            <stop offset="40%" stopColor="#4B5577" />
            <stop offset="60%" stopColor="#2A3149" />
            <stop offset="100%" stopColor="#0D101B" />
          </linearGradient>

          <linearGradient id="shadeBody" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#080B15" />
            <stop offset="25%" stopColor="#1B2238" />
            <stop offset="45%" stopColor="#36415F" />
            <stop offset="75%" stopColor="#121729" />
            <stop offset="100%" stopColor="#070910" />
          </linearGradient>

          <radialGradient id="lampBloom" cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#5CF2C4" stopOpacity={0.28 * flickerLevel} />
            <stop offset="40%" stopColor="#5CF2C4" stopOpacity={0.08 * flickerLevel} />
            <stop offset="75%" stopColor="#8B7BFF" stopOpacity={0.04 * flickerLevel} />
            <stop offset="100%" stopColor="#8B7BFF" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="beamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#CFFFF0" stopOpacity={0.3 * flickerLevel} />
            <stop offset="35%" stopColor="#5CF2C4" stopOpacity={0.12 * flickerLevel} />
            <stop offset="75%" stopColor="#8B7BFF" stopOpacity={0.04 * flickerLevel} />
            <stop offset="100%" stopColor="#8B7BFF" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="beamCoreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.28 * flickerLevel} />
            <stop offset="40%" stopColor="#BFF9E7" stopOpacity={0.08 * flickerLevel} />
            <stop offset="100%" stopColor="#BFF9E7" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="poolGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A8F7DF" stopOpacity={0.35 * flickerLevel} />
            <stop offset="60%" stopColor="#5CF2C4" stopOpacity={0.09 * flickerLevel} />
            <stop offset="100%" stopColor="#5CF2C4" stopOpacity="0" />
          </radialGradient>

          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="beamSoft" x="-30%" y="-10%" width="160%" height="120%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>

        {/* 光束与地面光池 (只有 isLit 为 true 时渲染) */}
        {isLit && (
          <g className="transition-opacity duration-300">
            <circle cx="500" cy="310" r="420" fill="url(#lampBloom)" />

            <path
              d="M 500 290 L 100 900 L 900 900 Z"
              fill="url(#beamGrad)"
              filter="url(#beamSoft)"
            />

            <path
              d="M 500 290 L 280 900 L 720 900 Z"
              fill="url(#beamCoreGrad)"
              filter="url(#beamSoft)"
            />

            <ellipse cx="500" cy="850" rx="420" ry="55" fill="url(#poolGrad)" />

            {/* 浮尘漂浮光粒 */}
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

          {/* 灯泡 */}
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

        {/* 物理可弯曲弹簧拉绳链条 (全域感应热区，支持点击拉绳任意位置拉动) */}
        <g
          id="pullChain"
          className="cursor-grab active:cursor-grabbing pointer-events-auto"
          onPointerDown={handlePointerDown}
        >
          {/* 超宽隐形热区路径 */}
          <path
            d={`M ${anchor.x} ${anchor.y} Q ${curveMid.x} ${curveMid.y} ${handlePos.x} ${handlePos.y}`}
            fill="none"
            stroke="transparent"
            strokeWidth="48"
          />

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
            {/* 宽大隐形感应热区 */}
            <circle cx="0" cy="18" r="44" fill="transparent" />

            <rect x="-3.5" y="-2" width="7" height="5" rx="1.5" fill="#8D96B3" />
            <rect
              x="-8.5"
              y="3"
              width="17"
              height="30"
              rx="8.5"
              fill="url(#lampMetal)"
              stroke={isDragging ? "#5CF2C4" : "#8B7BFF"}
              strokeWidth="1.2"
              strokeOpacity={isDragging ? "0.9" : "0.5"}
            />
            <rect
              x="-8"
              y="23"
              width="16"
              height="3.5"
              fill={isLit ? "#5CF2C4" : "#8B7BFF"}
              opacity={isDragging ? "0.9" : "0.4"}
              filter="url(#softGlow)"
            />
            <ellipse cx="-3" cy="13" rx="1.5" ry="6" fill="#FFFFFF" opacity="0.35" />

            {/* 拖动时的微光指示圈 */}
            {isDragging && (
              <circle
                cx="0"
                cy="18"
                r="32"
                fill="none"
                stroke="#5CF2C4"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="animate-spin"
              />
            )}
          </g>

          {/* 手柄右侧悬浮状态提示徽标 */}
          <g
            transform={`translate(${handlePos.x + 36}, ${handlePos.y + 12})`}
            className="pointer-events-none select-none"
          >
            {isDragging ? (
              <g>
                <rect
                  x="-8"
                  y="-14"
                  width={pullThresholdReached ? 170 : 140}
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
                  letterSpacing="0.08em"
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

      {/* 底部引导文案与状态展示 */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-auto">
        {isLit ? (
          <div className="flex flex-col items-center animate-fade-in">
            <p className="text-xs font-mono text-[#5CF2C4] tracking-widest mb-3 uppercase">
              ✦ Atelier Illuminated · 工坊已点亮 ✦
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleEnterPortfolio}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5CF2C4] text-[#05070F] font-mono text-xs font-bold tracking-wider hover:bg-[#7DF9D2] hover:shadow-[0_0_25px_rgba(92,242,196,0.5)] transition-all"
              >
                <span>步入工坊</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
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
