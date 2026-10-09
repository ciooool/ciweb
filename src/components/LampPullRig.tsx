"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { soundManager } from "@/utils/audio";
import { Volume2, VolumeX, ArrowUp } from "lucide-react";

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

  // 核心幕布显隐状态:
  // 当 isOpen 为 true 时淡入展现; 点亮吊灯后平滑淡出消失
  const [curtainVisible, setCurtainVisible] = useState(isOpen);

  const svgRef = useRef<SVGSVGElement>(null);

  // 物理坐标系统 (SVG 1000x900 空间)
  // 吊灯下边缘位于 y=236，拉绳从右侧内部微孔引出 (x=546, y=242)
  const anchor = { x: 546, y: 242 };
  const restPos = { x: 546, y: 440 };

  const [handlePos, setHandlePos] = useState({ x: 546, y: 440 });
  const [curveMid, setCurveMid] = useState({ x: 546, y: 341 });

  const posRef = useRef({ x: 546, y: 440 });
  const velRef = useRef({ vx: 0, vy: 0 });
  const animFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const isLitRef = useRef(false);

  useEffect(() => {
    isLitRef.current = isLit;
  }, [isLit]);

  // 阻尼回弹弹簧振荡物理模拟
  const startSpringAnimation = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const k = 0.35;
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
        anchor.x + (posRef.current.x - anchor.x) * 0.46 + velRef.current.vx * 1.5;
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

  // 触发幕布缓慢平滑淡出 (Fade Out，整整 1200ms 电影级渐进溶解，肉眼清晰可辨)
  const triggerCurtainFadeOut = useCallback(() => {
    setCurtainVisible(false);
    soundManager.playClick();
    // 严格等待 1200ms 完整淡化完成后，再通知父级切换为已进入状态
    setTimeout(() => {
      onClose();
    }, 1200);
  }, [onClose]);

  // 点亮吊灯：经 240ms 微电弧暖机后，平滑启动 1200ms 缓慢淡化退场
  const toggleLamp = useCallback(() => {
    const nextLit = !isLitRef.current;
    setIsLit(nextLit);
    soundManager.playLampSwitch();
    if (onToggleLight) onToggleLight(nextLit);

    if (nextLit) {
      setFlickerLevel(1.2);
      setTimeout(() => setFlickerLevel(0.4), 50);
      setTimeout(() => setFlickerLevel(1.1), 110);
      setTimeout(() => setFlickerLevel(0.85), 170);
      setTimeout(() => setFlickerLevel(1.0), 240);

      // 点亮稳定 320ms 后，全屏暗幕柔和缓慢淡出 (1200ms 匀称缓动)
      setTimeout(() => {
        triggerCurtainFadeOut();
      }, 320);
    } else {
      setFlickerLevel(0);
    }
  }, [onToggleLight, triggerCurtainFadeOut]);

  // 监听外部 isOpen 变化（例如点击右上角微型吊灯关灯降幕）
  useEffect(() => {
    if (isOpen) {
      // 幕布缓慢平滑淡入 (Fade In，1200ms 电影级缓慢显现)
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
          velRef.current.vy = 28;
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
    if (!svgRef.current) return { x: 546, y: 440 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svgRef.current.getScreenCTM();
    if (ctm) {
      return pt.matrixTransform(ctm.inverse());
    }
    return { x: 546, y: 440 };
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

      const targetX = current.x + startOffset.x;
      const targetY = current.y + startOffset.y;

      const maxRadius = 130;
      const maxDy = 120;

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

      if (pullDistance >= 20 || pullDistance <= 6) {
        toggleLamp();
        velRef.current.vy = -Math.max(20, pullDistance * 0.85);
        velRef.current.vx = (posRef.current.x - anchor.x) * -0.35;
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

  // 精致微型金属珠链 (22 颗微小珠链节，顺滑质感)
  const beadCount = 22;
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

  const pullThresholdReached = handlePos.y - restPos.y >= 20;

  return (
    <div
      id="ciooool-curtain-stage"
      className="fixed inset-0 z-50 flex items-center justify-center select-none overflow-hidden"
      style={{
        backgroundColor: "#04060C",
        background: isLit
          ? "radial-gradient(ellipse 95% 75% at 50% 25%, #0B1C2A 0%, #04060C 85%)"
          : "radial-gradient(ellipse 70% 60% at 50% 22%, #070B16 0%, #04060C 85%)",
        opacity: curtainVisible ? 1 : 0,
        visibility: curtainVisible ? "visible" : "hidden",
        pointerEvents: curtainVisible ? "auto" : "none",
        // 关键核心：W3C 规范级 1200ms 对称缓动淡入淡出，肉眼时刻感受渐进流动，绝无突兀跳变
        transition: curtainVisible
          ? "opacity 1200ms cubic-bezier(0.42, 0, 0.58, 1), visibility 0s linear 0s, background 800ms ease"
          : "opacity 1200ms cubic-bezier(0.42, 0, 0.58, 1), visibility 0s linear 1200ms, background 800ms ease",
        willChange: "opacity, background",
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
          className="p-2.5 rounded-full border border-[#1A253D] bg-[#0A0E1A]/80 text-[#8B9BB8] hover:text-[#5CF2C4] hover:border-[#5CF2C4]/40 transition-all backdrop-blur-md cursor-pointer shadow-sm"
          title={isMuted ? "开启音效" : "静音"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={triggerCurtainFadeOut}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#1A253D] bg-[#0A0E1A]/80 text-[#8B9BB8] hover:text-[#5CF2C4] hover:border-[#5CF2C4]/40 text-xs font-mono transition-all backdrop-blur-md cursor-pointer shadow-sm"
          title="跳过并进入工坊"
        >
          <span>进入工坊</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 高级物理包豪斯弧面吊灯与真实光学系统 SVG 画布 */}
      <svg
        ref={svgRef}
        viewBox="0 0 1000 900"
        className="w-full h-full max-w-5xl max-h-[92vh] pointer-events-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* 1. 核心纯白发光核渐变 (Hotspot) */}
          <radialGradient id="lensCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={1.0 * flickerLevel} />
            <stop offset="35%" stopColor="#E2FFF7" stopOpacity={0.92 * flickerLevel} />
            <stop offset="70%" stopColor="#5CF2C4" stopOpacity={0.65 * flickerLevel} />
            <stop offset="100%" stopColor="#5CF2C4" stopOpacity={0} />
          </radialGradient>

          {/* 2. 真实光学锥形体积光束渐变 (Tyndall Beam) */}
          <linearGradient id="opticalConeFade" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.85 * flickerLevel} />
            <stop offset="14%" stopColor="#7DF9D2" stopOpacity={0.52 * flickerLevel} />
            <stop offset="36%" stopColor="#34D399" stopOpacity={0.24 * flickerLevel} />
            <stop offset="70%" stopColor="#064E3B" stopOpacity={0.06 * flickerLevel} />
            <stop offset="100%" stopColor="#04060C" stopOpacity={0} />
          </linearGradient>

          {/* 3. 地面漫反射环境光池渐变 */}
          <radialGradient id="groundBounceLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5CF2C4" stopOpacity={0.35 * flickerLevel} />
            <stop offset="45%" stopColor="#1EA886" stopOpacity={0.12 * flickerLevel} />
            <stop offset="85%" stopColor="#04060C" stopOpacity={0.02 * flickerLevel} />
            <stop offset="100%" stopColor="#04060C" stopOpacity={0} />
          </radialGradient>

          {/* 4. 包豪斯弧面黑曜石金属渐变 (Sleek Bauhaus Dome Metallic Sheen) */}
          <linearGradient id="matteObsidianGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0A0E17" />
            <stop offset="18%" stopColor="#1E283D" />
            <stop offset="48%" stopColor="#304163" />
            <stop offset="72%" stopColor="#1C263A" />
            <stop offset="100%" stopColor="#080C14" />
          </linearGradient>

          {/* 5. 灯罩内壁受光反射渐变 */}
          <linearGradient id="innerRimReflection" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B111D" />
            <stop offset="100%" stopColor={isLit ? "#1D4A41" : "#141D2C"} />
          </linearGradient>

          {/* 6. 香槟黄铜领圈金属渐变 */}
          <linearGradient id="champagneBrassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5DC96" />
            <stop offset="40%" stopColor="#C9A043" />
            <stop offset="75%" stopColor="#DFBC66" />
            <stop offset="100%" stopColor="#7E5F1E" />
          </linearGradient>

          {/* 7. 精密拉坠车削钛金属切面渐变 */}
          <linearGradient id="machinedTitaniumGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#131B2A" />
            <stop offset="35%" stopColor="#35476B" />
            <stop offset="65%" stopColor="#5E78A8" />
            <stop offset="90%" stopColor="#223048" />
            <stop offset="100%" stopColor="#0E1420" />
          </linearGradient>

          {/* 8. 金属珠微球高光渐变 */}
          <radialGradient id="microBeadShine" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#C2D3EF" />
            <stop offset="100%" stopColor="#1A253A" />
          </radialGradient>

          {/* 9. 超柔纯高斯羽化滤镜 (userSpaceOnUse 全域画布计算，彻底杜绝局部图元裁剪边框) */}
          <filter id="pureTyndallDiffusion" filterUnits="userSpaceOnUse" x="0" y="0" width="1000" height="900">
            <feGaussianBlur stdDeviation="32" result="blur1" />
            <feGaussianBlur stdDeviation="64" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
            </feMerge>
          </filter>
        </defs>

        {/* --- [A] 真实光学纯净羽化体积光束系统 --- */}
        {isLit && (
          <g className="transition-opacity duration-500 ease-out">
            {/* 自然柔和下沉锥形光束 (无硬边，完全柔化扩散) */}
            <polygon
              points="450,238 550,238 840,900 160,900"
              fill="url(#opticalConeFade)"
              filter="url(#pureTyndallDiffusion)"
              opacity={flickerLevel}
            />

            {/* 地面漫反射超柔光斑 */}
            <ellipse
              cx="500"
              cy="855"
              rx="380"
              ry="55"
              fill="url(#groundBounceLight)"
              filter="url(#pureTyndallDiffusion)"
            />
          </g>
        )}

        {/* --- [B] 天花板悬挂支架与纤细金属电线 --- */}
        <g id="ceilingMount">
          {/* 天花板黑色微吸顶盘 */}
          <ellipse cx="500" cy="0" rx="32" ry="8" fill="#111726" stroke="#25324D" strokeWidth="1" />
          {/* 极简深黑微细缆线 (宽 2.4px) */}
          <line
            x1="500"
            y1="0"
            x2="500"
            y2="128"
            stroke="#080C14"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <line
            x1="499.4"
            y1="0"
            x2="499.4"
            y2="128"
            stroke="#212C45"
            strokeWidth="0.6"
          />
        </g>

        {/* --- [C] 现代包豪斯弧面黑曜石吊灯结构 --- */}
        <g id="sleekLampshade">
          {/* 顶部微型拉丝黄铜领圈 */}
          <rect x="493" y="126" width="14" height="18" rx="2" fill="url(#champagneBrassGrad)" stroke="#4E3B10" strokeWidth="0.6" />
          <line x1="493" y1="131" x2="507" y2="131" stroke="#3D2D0B" strokeWidth="0.6" />
          <line x1="493" y1="137" x2="507" y2="137" stroke="#3D2D0B" strokeWidth="0.6" />

          {/* 包豪斯优雅弧面钟形灯罩主体 (Smooth Bell Dome) */}
          <path
            d="M 493,144 C 455,152 416,188 414,236 C 414,244 586,244 586,236 C 584,188 545,152 507,144 Z"
            fill="url(#matteObsidianGrad)"
            stroke="#263554"
            strokeWidth="1"
          />

          {/* 灯罩左侧弧形微高光切线 */}
          <path
            d="M 493,145 C 460,154 425,188 423,234"
            fill="none"
            stroke="#3C4F75"
            strokeWidth="0.9"
            opacity="0.6"
          />

          {/* 灯罩底部精致车削金属下唇口 (Flared Rim) */}
          <ellipse
            cx="500"
            cy="236"
            rx="86"
            ry="12"
            fill="url(#innerRimReflection)"
            stroke={isLit ? "#5CF2C4" : "#24324D"}
            strokeWidth={isLit ? "1.5" : "0.8"}
            strokeOpacity={isLit ? 0.95 : 0.45}
          />

          {/* 点亮时的广域透镜柔光晕 */}
          {isLit && (
            <ellipse
              cx="500"
              cy="242"
              rx="40"
              ry="20"
              fill="url(#lensCoreGlow)"
              filter="url(#pureTyndallDiffusion)"
            />
          )}

          {/* 内嵌古典爱迪生复古灯泡 (Vintage Glass Envelope) */}
          <ellipse
            cx="500"
            cy="242"
            rx="18"
            ry="18"
            fill={isLit ? "url(#lensCoreGlow)" : "#0E1524"}
            stroke={isLit ? "#5CF2C4" : "#1A253A"}
            strokeWidth="0.8"
          />

          {/* 复古灯丝细节 (Filament Loops) */}
          <path
            d="M 494,244 L 497,232 L 500,238 L 503,232 L 506,244"
            fill="none"
            stroke={isLit ? "#FFFFFF" : "#C9A043"}
            strokeWidth={isLit ? "1.4" : "0.7"}
            opacity={isLit ? 0.95 : 0.45}
          />

          {/* 点亮时的纯白晶体核心耀斑 */}
          {isLit && (
            <ellipse
              cx="500"
              cy="242"
              rx="14"
              ry="4"
              fill="#FFFFFF"
              fillOpacity={0.98 * flickerLevel}
            />
          )}

          {/* 纯铜穿线微吊耳 (Anchor) - 位于灯罩右侧内缘 */}
          <circle cx="546" cy="242" r="2.8" fill="url(#champagneBrassGrad)" stroke="#4A380E" strokeWidth="0.6" />
          <circle cx="546" cy="242" r="1.1" fill="#0A0E17" />
        </g>

        {/* --- [D] 极简高质感微金属珠链与精密胶囊拉坠 --- */}
        <g id="precisionPullChainRig">
          {/* 底层极细导向线 */}
          <path
            d={`M ${anchor.x} ${anchor.y} Q ${curveMid.x} ${curveMid.y} ${handlePos.x} ${handlePos.y}`}
            fill="none"
            stroke={isLit ? "#5CF2C4" : "#445575"}
            strokeWidth="0.8"
            strokeOpacity={isLit ? 0.6 : 0.25}
          />

          {/* 22 颗微小精密金属珠 (Jewelry Ball Chain, 直径 2.6px) */}
          {beads.map((b, i) => (
            <g key={i}>
              <circle
                cx={b.bx}
                cy={b.by}
                r={1.4}
                fill="url(#microBeadShine)"
                stroke="#121B2B"
                strokeWidth="0.4"
              />
              <circle
                cx={b.bx - 0.4}
                cy={b.by - 0.4}
                r={0.42}
                fill="#FFFFFF"
                opacity={0.88}
              />
            </g>
          ))}

          {/* --- 末端精密车削金属胶囊拉坠 (Precision Capsule Pendant) --- */}
          <g
            transform={`translate(${handlePos.x}, ${handlePos.y})`}
            className="cursor-grab active:cursor-grabbing pointer-events-auto"
            onPointerDown={handlePointerDown}
            onMouseEnter={() => setIsHoveringBead(true)}
            onMouseLeave={() => setIsHoveringBead(false)}
          >
            {/* 触摸操作热区 (扩大至 44px 舒适热区) */}
            <circle
              cx="0"
              cy="8"
              r="22"
              fill="transparent"
              className="cursor-grab active:cursor-grabbing"
            />

            {/* 达到拉动阈值时的环形脉冲微光环 */}
            {pullThresholdReached && (
              <circle
                cx="0"
                cy="8"
                r="16"
                fill="none"
                stroke="#5CF2C4"
                strokeWidth="1.2"
                strokeDasharray="3 2"
                className="animate-spin"
                style={{ animationDuration: "2s" }}
              />
            )}

            {/* 顶部黄铜连接扣微环 */}
            <circle cx="0" cy="-1.5" r="1.8" fill="url(#champagneBrassGrad)" stroke="#4A380E" strokeWidth="0.5" />

            {/* 精密圆柱钛金属胶囊主体 (宽 7.2px, 高 17px) */}
            <rect
              x="-3.6"
              y="0"
              width="7.2"
              height="17"
              rx="3.6"
              fill="url(#machinedTitaniumGrad)"
              stroke={isHoveringBead || pullThresholdReached ? "#5CF2C4" : "#24334F"}
              strokeWidth="0.8"
              className="transition-colors duration-200"
              style={{
                filter: isHoveringBead
                  ? "drop-shadow(0 0 5px rgba(92,242,196,0.55))"
                  : "none",
              }}
            />

            {/* 胶囊中间纯铜环形嵌带 */}
            <line x1="-3.2" y1="8.5" x2="3.2" y2="8.5" stroke="url(#champagneBrassGrad)" strokeWidth="0.6" />

            {/* 胶囊左侧微金属反光切线 */}
            <line x1="-1.6" y1="2" x2="-1.6" y2="14" stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.5" />

            {/* 底部微型黄铜圆珠 */}
            <circle cx="0" cy="17" r="1.2" fill="url(#champagneBrassGrad)" />

            {/* 拖拽交互时的状态标签 */}
            {isDragging ? (
              <g className="transition-opacity duration-150">
                <rect
                  x="-55"
                  y="-24"
                  width="110"
                  height="20"
                  rx="10"
                  fill="#0A0E1A"
                  fillOpacity="0.94"
                  stroke={pullThresholdReached ? "#5CF2C4" : "#22304C"}
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="-10"
                  textAnchor="middle"
                  fill={pullThresholdReached ? "#5CF2C4" : "#8697B8"}
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {pullThresholdReached ? "松手点亮 · IGNITE" : "继续向下拉动..."}
                </text>
              </g>
            ) : null}
          </g>

          {/* 常驻极简 PULL ↓ 引导标签 (对标参考案例：置于拉坠右侧，干净克制，点亮后自动消失) */}
          {!isLit && !isDragging && (
            <g
              transform={`translate(${handlePos.x + 16}, ${handlePos.y + 2})`}
              className="pointer-events-none animate-pulse"
              style={{ animationDuration: "2.4s" }}
            >
              <rect
                x="0"
                y="-9"
                width="56"
                height="18"
                rx="9"
                fill="#0A0E1A"
                fillOpacity="0.9"
                stroke="#1D2A42"
                strokeWidth="0.8"
              />
              <text
                x="28"
                y="3.5"
                textAnchor="middle"
                fill="#5CF2C4"
                fontSize="8.5"
                fontFamily="monospace"
                fontWeight="bold"
                letterSpacing="0.06em"
              >
                PULL ↓
              </text>
            </g>
          )}
        </g>
      </svg>

      {/* 底部引导文案 (纯粹、极简、高级) */}
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
              下拉微金属链点亮工坊 · 支持 Enter / 空格键
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
