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
  const [isHoveringBead, setIsHoveringBead] = useState(false);

  // 幕布可见性与平滑淡入淡出状态:
  // 当 isOpen 为 true 时初始呈现(淡入), 当点灯完成后缓慢淡化消失(淡出)
  const [curtainVisible, setCurtainVisible] = useState(isOpen);

  const svgRef = useRef<SVGSVGElement>(null);

  // 物理坐标系统 (SVG 1000x900 空间)
  const anchor = { x: 538, y: 284 };
  const restPos = { x: 538, y: 440 };

  const [handlePos, setHandlePos] = useState({ x: 538, y: 440 });
  const [curveMid, setCurveMid] = useState({ x: 538, y: 362 });

  const posRef = useRef({ x: 538, y: 440 });
  const velRef = useRef({ vx: 0, vy: 0 });
  const animFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const isLitRef = useRef(false);

  useEffect(() => {
    isLitRef.current = isLit;
  }, [isLit]);

  // 阻尼回弹弹簧振荡算法
  const startSpringAnimation = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const k = 0.32;
    const damping = 0.82;

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
        anchor.x + (posRef.current.x - anchor.x) * 0.46 + velRef.current.vx * 1.6;
      const midY = anchor.y + (posRef.current.y - anchor.y) * 0.52;

      setHandlePos({ x: posRef.current.x, y: posRef.current.y });
      setCurveMid({ x: midX, y: midY });

      if (
        Math.abs(dx) < 0.15 &&
        Math.abs(dy) < 0.15 &&
        Math.abs(velRef.current.vx) < 0.15 &&
        Math.abs(velRef.current.vy) < 0.15
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

  // 触发幕布平滑淡化退出 (Fade Out)
  const triggerCurtainFadeOut = useCallback(() => {
    setCurtainVisible(false);
    soundManager.playClick();
    setTimeout(() => {
      onClose();
    }, 750);
  }, [onClose]);

  // 点亮吊灯，经历通电微闪后柔和平滑淡化退场
  const toggleLamp = useCallback(() => {
    const nextLit = !isLitRef.current;
    setIsLit(nextLit);
    soundManager.playLampSwitch();
    if (onToggleLight) onToggleLight(nextLit);

    if (nextLit) {
      // 自然电弧微闪
      setFlickerLevel(1.15);
      setTimeout(() => setFlickerLevel(0.3), 50);
      setTimeout(() => setFlickerLevel(1.1), 100);
      setTimeout(() => setFlickerLevel(0.7), 150);
      setTimeout(() => setFlickerLevel(1.0), 220);

      // 点亮稳定 360ms 后，全场以柔和透明度淡化消失，自然进入主页
      setTimeout(() => {
        triggerCurtainFadeOut();
      }, 360);
    } else {
      setFlickerLevel(0);
    }
  }, [onToggleLight, triggerCurtainFadeOut]);

  // 监听外部 isOpen 变化（例如从右上角微型吊灯关灯降幕）
  useEffect(() => {
    if (isOpen) {
      // 幕布平滑淡入显现 (Fade In)
      setCurtainVisible(true);
      setIsLit(false);
      setFlickerLevel(0);
    } else {
      setCurtainVisible(false);
    }
  }, [isOpen]);

  // 键盘快捷监听
  useEffect(() => {
    if (!curtainVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerCurtainFadeOut();
      } else if (e.key === "Enter" || e.key === " ") {
        if (!isLitRef.current) {
          toggleLamp();
          startSpringAnimation();
        } else {
          triggerCurtainFadeOut();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [curtainVisible, triggerCurtainFadeOut, toggleLamp, startSpringAnimation]);

  const getSvgPoint = (clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 538, y: 440 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svgRef.current.getScreenCTM();
    if (ctm) {
      return pt.matrixTransform(ctm.inverse());
    }
    return { x: 538, y: 440 };
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
      const maxDy = 130;

      const dx = targetX - restPos.x;
      const dy = Math.max(0, Math.min(maxDy, targetY - restPos.y));

      const clampedX = restPos.x + Math.max(-maxRadius, Math.min(maxRadius, dx * 0.7));
      const clampedY = restPos.y + dy;

      posRef.current.x = clampedX;
      posRef.current.y = clampedY;

      const midX = anchor.x + (clampedX - anchor.x) * 0.48 + (clampedX - restPos.x) * 0.15;
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
        velRef.current.vy = -Math.max(22, pullDistance * 0.85);
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

  // 18颗紧密精致金属微圆珠链 (Jewelry Ball Chain)
  const beadCount = 18;
  const beads = Array.from({ length: beadCount }).map((_, idx) => {
    const t = (idx + 1) / (beadCount + 1);
    const bx =
      (1 - t) * (1 - t) * anchor.x +
      2 * (1 - t) * t * curveMid.x +
      t * t * handlePos.x;
    const by =
      (1 - t) * (1 - t) * anchor.y +
      2 * (1 - t) * t * curveMid.y +
      t * t * handlePos.y;
    return { bx, by };
  });

  const pullThresholdReached = handlePos.y - restPos.y >= 22;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center select-none overflow-hidden transition-all duration-750 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        curtainVisible
          ? "opacity-100 scale-100 pointer-events-auto backdrop-blur-none"
          : "opacity-0 scale-[1.03] pointer-events-none invisible"
      }`}
      style={{
        backgroundColor: "#05070F",
        background: isLit
          ? "radial-gradient(ellipse 95% 75% at 50% 28%, #0B162B 0%, #05070F 85%)"
          : "radial-gradient(ellipse 70% 60% at 50% 24%, #070B16 0%, #05070F 80%)",
        willChange: "opacity, transform",
      }}
    >
      {/* 顶部工具栏 (静音与跳过按键) */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-30 flex items-center gap-3">
        <button
          onClick={() => {
            const next = !isMuted;
            setIsMuted(next);
            soundManager.setMuted(next);
          }}
          className="p-2.5 rounded-full border border-[#1E2945] bg-[#0A0F1D]/80 text-[#8E9EB8] hover:text-[#5CF2C4] hover:border-[#5CF2C4]/50 transition-all backdrop-blur-md cursor-pointer shadow-sm"
          title={isMuted ? "开启音效" : "静音"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={triggerCurtainFadeOut}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#1E2945] bg-[#0A0F1D]/80 text-[#8E9EB8] hover:text-[#5CF2C4] hover:border-[#5CF2C4]/50 text-xs font-mono transition-all backdrop-blur-md cursor-pointer shadow-sm"
          title="跳过并步入工坊"
        >
          <span>进入工坊</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 高级物理吊灯与光学系统 SVG 画布 */}
      <svg
        ref={svgRef}
        viewBox="0 0 1000 900"
        className="w-full h-full max-w-5xl max-h-[92vh] pointer-events-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* 1. 核心高光热点渐变 (Pure White to Phosphor) */}
          <radialGradient
            id="coreHotspot"
            cx="50%"
            cy="32%"
            r="50%"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.98 * flickerLevel} />
            <stop offset="35%" stopColor="#7DF9D2" stopOpacity={0.9 * flickerLevel} />
            <stop offset="70%" stopColor="#5CF2C4" stopOpacity={0.45 * flickerLevel} />
            <stop offset="100%" stopColor="#5CF2C4" stopOpacity="0" />
          </radialGradient>

          {/* 2. 空间丁达尔体积羽化光锥 (Soft Atmospheric Cone Beam) */}
          <radialGradient
            id="volumetricAtmosphere"
            cx="50%"
            cy="15%"
            r="85%"
            fx="50%"
            fy="25%"
          >
            <stop offset="0%" stopColor="#5CF2C4" stopOpacity={0.75 * flickerLevel} />
            <stop offset="20%" stopColor="#3BDDB0" stopOpacity={0.42 * flickerLevel} />
            <stop offset="50%" stopColor="#19333F" stopOpacity={0.18 * flickerLevel} />
            <stop offset="80%" stopColor="#0B1324" stopOpacity={0.06 * flickerLevel} />
            <stop offset="100%" stopColor="#05070F" stopOpacity="0" />
          </radialGradient>

          {/* 3. 地面空间柔和漫反射光斑 (Floor Ambient Bounce Field) */}
          <radialGradient
            id="floorBounceGlow"
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor="#5CF2C4" stopOpacity={0.25 * flickerLevel} />
            <stop offset="45%" stopColor="#2AE2B1" stopOpacity={0.1 * flickerLevel} />
            <stop offset="80%" stopColor="#05070F" stopOpacity={0.02 * flickerLevel} />
            <stop offset="100%" stopColor="#05070F" stopOpacity="0" />
          </radialGradient>

          {/* 4. 灯罩黑曜石哑光微金属质感 (Obsidian Matte Dome) */}
          <linearGradient id="obsidianMetal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0D111A" />
            <stop offset="25%" stopColor="#1E283C" />
            <stop offset="50%" stopColor="#314264" />
            <stop offset="75%" stopColor="#1E283C" />
            <stop offset="100%" stopColor="#0A0E17" />
          </linearGradient>

          {/* 5. 精密拉丝黄铜领圈 (Brushed Brass Collar) */}
          <linearGradient id="brushedBrass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E6C875" />
            <stop offset="35%" stopColor="#C9A043" />
            <stop offset="70%" stopColor="#F5DF98" />
            <stop offset="100%" stopColor="#7E5F1E" />
          </linearGradient>

          {/* 6. 拉坠圆柱钛金属高光 (Machined Titanium Capsule) */}
          <linearGradient id="machinedCapsule" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E273A" />
            <stop offset="40%" stopColor="#4A5F8A" />
            <stop offset="60%" stopColor="#7B92C2" />
            <stop offset="85%" stopColor="#304163" />
            <stop offset="100%" stopColor="#141B28" />
          </linearGradient>

          {/* 7. 金属球链单珠高光 (Chrome Bead Shine) */}
          <radialGradient id="chromeBead" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#9FB4D9" />
            <stop offset="100%" stopColor="#25324D" />
          </radialGradient>

          {/* 漫反射光学柔光滤镜 */}
          <filter id="softDiffusion" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="36" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* --- [A] 空间光学漫射与光柱系统 (零生硬边缘，平滑柔边) --- */}
        {isLit && (
          <g className="transition-opacity duration-500 ease-out">
            {/* 广域空气光池 */}
            <ellipse
              cx="500"
              cy="340"
              rx="480"
              ry="390"
              fill="url(#volumetricAtmosphere)"
              filter="url(#softDiffusion)"
            />

            {/* 空间发散柔光束 (采用平滑贝塞尔曲线边界，杜绝三角形切角) */}
            <path
              d="M440,250 C440,250 220,860 160,880 C260,895 740,895 840,880 C780,860 560,250 560,250 Z"
              fill="url(#volumetricAtmosphere)"
              filter="url(#softDiffusion)"
              opacity={0.85 * flickerLevel}
            />

            {/* 地面漫反射光池 */}
            <ellipse
              cx="500"
              cy="840"
              rx="360"
              ry="65"
              fill="url(#floorBounceGlow)"
              filter="url(#softDiffusion)"
            />
          </g>
        )}

        {/* --- [B] 天花板悬吊基座与电缆 --- */}
        <g id="ceilingFixture">
          {/* 天花板磨砂基座 */}
          <ellipse cx="500" cy="0" rx="36" ry="10" fill="#141B2B" stroke="#2D3B57" strokeWidth="1.2" />
          {/* 哑光精密电缆 */}
          <line
            x1="500"
            y1="0"
            x2="500"
            y2="175"
            stroke="#0A0D14"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <line
            x1="499.2"
            y1="0"
            x2="499.2"
            y2="175"
            stroke="#26344F"
            strokeWidth="0.8"
          />
        </g>

        {/* --- [C] 极简包豪斯工业工坊吊灯主体 --- */}
        <g id="atelierLampshade">
          {/* 纯铜滚花固定套筒 */}
          <rect x="493" y="168" width="14" height="20" rx="2.5" fill="url(#brushedBrass)" stroke="#523F11" strokeWidth="0.8" />
          <line x1="493" y1="174" x2="507" y2="174" stroke="#4A380E" strokeWidth="0.8" />
          <line x1="493" y1="180" x2="507" y2="180" stroke="#4A380E" strokeWidth="0.8" />

          {/* 锥台黑曜石流线灯罩 */}
          <polygon
            points="500,186 415,250 585,250"
            fill="url(#obsidianMetal)"
            stroke="#2C3D5C"
            strokeWidth="1.2"
          />

          {/* 灯罩底部精密微金属边框 */}
          <ellipse
            cx="500"
            cy="250"
            rx="85"
            ry="16"
            fill="#101522"
            stroke={isLit ? "#5CF2C4" : "#2E3F61"}
            strokeWidth={isLit ? "1.6" : "0.8"}
            strokeOpacity={isLit ? 0.9 : 0.4}
          />

          {/* 底部内嵌磨砂发光透镜 (Frosted Lens) */}
          <ellipse
            cx="500"
            cy="252"
            rx="78"
            ry="11"
            fill={isLit ? "url(#coreHotspot)" : "#0B0E17"}
            filter={isLit ? "url(#softDiffusion)" : undefined}
          />

          {/* 点亮时的纯白晶体核心热点 (Ultra Hotspot) */}
          {isLit && (
            <ellipse
              cx="500"
              cy="252"
              rx="24"
              ry="5.5"
              fill="#FFFFFF"
              fillOpacity={0.96 * flickerLevel}
              filter="url(#softDiffusion)"
            />
          )}

          {/* 拉绳悬挂点微型黄铜小吊耳 (Brass Anchor Eyelet) */}
          <circle cx="538" cy="284" r="3.6" fill="url(#brushedBrass)" stroke="#4A380E" strokeWidth="0.8" />
          <circle cx="538" cy="284" r="1.4" fill="#0A0E17" />
        </g>

        {/* --- [D] 高精度微型金属圆珠链与精密胶囊拉坠 --- */}
        <g id="precisionCordRig">
          {/* 珠链底层导向纤细柔光线 */}
          <path
            d={`M ${anchor.x} ${anchor.y} Q ${curveMid.x} ${curveMid.y} ${handlePos.x} ${handlePos.y}`}
            fill="none"
            stroke={isLit ? "#5CF2C4" : "#4A5D80"}
            strokeWidth="0.8"
            strokeOpacity={isLit ? 0.7 : 0.3}
            strokeDasharray="2 1"
          />

          {/* 18 颗微型精密金属球 (Jewelry Ball Chain) */}
          {beads.map((b, i) => (
            <g key={i}>
              <circle
                cx={b.bx}
                cy={b.by}
                r={1.8}
                fill="url(#chromeBead)"
                stroke="#1B2438"
                strokeWidth="0.5"
              />
              {/* 微金属高光点 */}
              <circle
                cx={b.bx - 0.5}
                cy={b.by - 0.5}
                r={0.6}
                fill="#FFFFFF"
                opacity={0.8}
              />
            </g>
          ))}

          {/* --- 末端精密金属胶囊拉坠 (Precision Capsule Pendant) --- */}
          <g
            transform={`translate(${handlePos.x}, ${handlePos.y})`}
            className="cursor-grab active:cursor-grabbing pointer-events-auto"
            onPointerDown={handlePointerDown}
            onMouseEnter={() => setIsHoveringBead(true)}
            onMouseLeave={() => setIsHoveringBead(false)}
          >
            {/* 扩大手势触摸热区 (48px 圆形热区) */}
            <circle
              cx="0"
              cy="8"
              r="24"
              fill="transparent"
              className="cursor-grab active:cursor-grabbing"
            />

            {/* 达到拉动阈值时的环形发光指示环 */}
            {pullThresholdReached && (
              <circle
                cx="0"
                cy="8"
                r="18"
                fill="none"
                stroke="#5CF2C4"
                strokeWidth="1.2"
                strokeDasharray="4 2"
                className="animate-spin"
                style={{ animationDuration: "2.5s" }}
              />
            )}

            {/* 顶部纯铜微连接环 */}
            <circle cx="0" cy="-2" r="2.2" fill="url(#brushedBrass)" stroke="#4A380E" strokeWidth="0.6" />

            {/* 圆柱金属胶囊外壳 */}
            <rect
              x="-4.2"
              y="0"
              width="8.4"
              height="18"
              rx="4.2"
              fill="url(#machinedCapsule)"
              stroke={isHoveringBead || pullThresholdReached ? "#5CF2C4" : "#2B3C5E"}
              strokeWidth="0.9"
              className="transition-colors duration-200"
              style={{
                filter: isHoveringBead
                  ? "drop-shadow(0 0 6px rgba(92,242,196,0.6))"
                  : "none",
              }}
            />

            {/* 胶囊中间精密拉丝环带 */}
            <line x1="-3.8" y1="9" x2="3.8" y2="9" stroke="#101524" strokeWidth="0.8" />
            <line x1="-3.8" y1="10" x2="3.8" y2="10" stroke="url(#brushedBrass)" strokeWidth="0.6" />

            {/* 胶囊左上侧微高光切线 */}
            <line x1="-2" y1="2" x2="-2" y2="15" stroke="#FFFFFF" strokeWidth="0.6" strokeOpacity="0.6" />

            {/* 底部微小金属圆珠 */}
            <circle cx="0" cy="18" r="1.6" fill="url(#brushedBrass)" stroke="#4A380E" strokeWidth="0.5" />

            {/* 拖拽交互状态文字指示标签 */}
            {isDragging ? (
              <g className="transition-opacity duration-150">
                <rect
                  x="-68"
                  y="-26"
                  width="136"
                  height="22"
                  rx="11"
                  fill="#0A0E1A"
                  fillOpacity="0.92"
                  stroke={pullThresholdReached ? "#5CF2C4" : "#273656"}
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
                  {pullThresholdReached ? "松手点亮 · IGNITE" : "继续下拉拉绳..."}
                </text>
              </g>
            ) : (
              <g className="animate-bounce" style={{ animationDuration: "2.2s" }}>
                <rect
                  x="-42"
                  y="28"
                  width="84"
                  height="20"
                  rx="10"
                  fill="#0A0E1A"
                  fillOpacity="0.88"
                  stroke="#1E2A48"
                  strokeWidth="0.9"
                />
                <text
                  x="0"
                  y="41"
                  textAnchor="middle"
                  fill="#5CF2C4"
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                  letterSpacing="0.08em"
                >
                  PULL DOWN ↓
                </text>
              </g>
            )}
          </g>
        </g>
      </svg>

      {/* 底部引导文案 (极度克制高级) */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        {isLit ? (
          <div className="flex flex-col items-center animate-pulse">
            <p className="text-xs font-mono text-[#5CF2C4] tracking-widest uppercase">
              ✦ ATELIER ILLUMINATED · 正在步入工坊 ✦
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="text-xl sm:text-2xl font-mono text-[#EAF0FF] tracking-wider mb-1.5 font-bold">
              CIOOOUL ATELIER
            </h2>
            <p className="text-xs font-mono text-[#7D88AA]">
              下拉金属珠链点亮工坊 · 支持 Enter / 空格键
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
