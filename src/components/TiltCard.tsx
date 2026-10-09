"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  glare?: boolean;
  perspective?: number;
}

export default function TiltCard({
  children,
  className = "",
  maxTilt = 7,
  scale = 1.018,
  glare = true,
  perspective = 1000,
  style,
  ...rest
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [transformStyle, setTransformStyle] = useState("");
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("ontouchstart" in window || window.matchMedia("(pointer: coarse)").matches)
    ) {
      setIsTouch(true);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouch || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const xPercent = mouseX / rect.width;
      const yPercent = mouseY / rect.height;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const tiltX = (yPercent - 0.5) * -maxTilt * 2;
        const tiltY = (xPercent - 0.5) * maxTilt * 2;

        setTransformStyle(
          `perspective(${perspective}px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
        );

        if (glare) {
          setGlarePos({
            x: Math.round(xPercent * 100),
            y: Math.round(yPercent * 100),
            opacity: 0.16,
          });
        }
      });
    },
    [isTouch, maxTilt, scale, perspective, glare]
  );

  const handleMouseEnter = () => {
    if (isTouch) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isTouch) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setIsHovered(false);
    setTransformStyle(
      `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    );
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  if (isTouch) {
    return (
      <div className={className} style={style} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative will-change-transform ${className}`}
      style={{
        transform: transformStyle,
        transition: isHovered
          ? "transform 0.08s ease-out"
          : "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.55s ease",
        transformStyle: "preserve-3d",
        ...style,
      }}
      {...rest}
    >
      {children}

      {/* 边缘与表面动态微光扫光 (Specular Glint) */}
      {glare && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] overflow-hidden transition-opacity duration-300"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle 360px at ${glarePos.x}% ${glarePos.y}%, var(--phosphor) 0%, var(--violet) 40%, transparent 80%)`,
            mixBlendMode: "screen",
          }}
        />
      )}
    </div>
  );
}
