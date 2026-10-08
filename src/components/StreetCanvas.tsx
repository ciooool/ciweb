'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { soundManager } from '@/utils/audio';

// --- 固定种子伪随机数生成器 (Mulberry32 PRNG) ---
// 保证天际线建筑形状、高度与窗格布局在刷新和缩放时绝对恒定，绝不抽搐跳动
function createPRNG(seed: number) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface WindowData {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  isLit: boolean;
  phase: number;
  pulseSpeed: number;
}

interface BuildingData {
  x: number;
  y: number;
  w: number;
  h: number;
  depth: number; // 0 = 远景, 1 = 近景
  color: string;
  hasSpire: boolean;
  spireHeight: number;
  windows: WindowData[];
}

interface LampData {
  x: number;
  y: number;
  h: number;
  lightColor: string;
}

interface WalkerData {
  x: number;
  y: number;
  dir: number;
  speed: number;
  color: string;
  phase: number;
}

interface CarData {
  id: number;
  lane: number; // 0: 上车道向左行驶 (dir = -1), 1: 下车道向右行驶 (dir = 1)
  dir: number;
  x: number;
  y: number;
  speed: number;
  type: 0 | 1 | 2 | 3; // 0: 轿车, 1: 跑车, 2: 厢货, 3: 皮卡
  length: number;
  height: number;
  bodyColor: string;
  cabinColor: string;
  honkUntil: number;
  honkText?: string;
}

export const StreetCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [isHoveringCar, setIsHoveringCar] = useState(false);

  // 动画状态引用
  const stateRef = useRef<{
    width: number;
    height: number;
    dpr: number;
    buildings: BuildingData[];
    lamps: LampData[];
    walkers: WalkerData[];
    cars: CarData[];
    animId: number | null;
    lastTime: number;
    isVisible: boolean;
    mouseX: number;
    mouseY: number;
    hoveredCarId: number | null;
  }>({
    width: 0,
    height: 0,
    dpr: 1,
    buildings: [],
    lamps: [],
    walkers: [],
    cars: [],
    animId: null,
    lastTime: 0,
    isVisible: true,
    mouseX: -100,
    mouseY: -100,
    hoveredCarId: null,
  });

  // 调色板定义（根据当前主题自适应）
  const isDark = theme === 'dark';

  const palette = React.useMemo(() => {
    if (isDark) {
      return {
        skyGrad: ['#05070f', '#070b18', '#04060c'],
        bgBuilding: '#0a0e1c',
        fgBuilding: '#10162a',
        buildingStroke: 'rgba(31, 42, 77, 0.45)',
        roadSurface: '#05070e',
        roadCurb: '#17203b',
        roadLine: 'rgba(92, 242, 196, 0.35)',
        sidewalk: '#0b1022',
        windowLit: ['#5cf2c4', '#8b7bff', '#ffb347', '#d6e2ff', '#38bdf8'],
        windowDark: 'rgba(255, 255, 255, 0.04)',
        lampLight: 'rgba(92, 242, 196, 0.22)',
        lampBulb: '#b9ffe9',
        headlight: 'rgba(235, 248, 255, 0.55)',
        headlightBeam: 'rgba(92, 242, 196, 0.24)',
        taillight: '#ff3366',
        taillightGlow: 'rgba(255, 51, 102, 0.4)',
        walkers: ['#5cf2c4', '#8b7bff', '#a5b4fc', '#67e8f9'],
        cars: [
          { body: '#1e293b', cabin: '#0f172a' },
          { body: '#312e81', cabin: '#1e1b4b' },
          { body: '#064e3b', cabin: '#022c22' },
          { body: '#4c1d95', cabin: '#2e1065' },
          { body: '#1e3a5f', cabin: '#0f172a' },
        ],
      };
    } else {
      return {
        skyGrad: ['#ebf0fa', '#e2e8f5', '#dbe3f1'],
        bgBuilding: '#cbd5e1',
        fgBuilding: '#94a3b8',
        buildingStroke: 'rgba(148, 163, 184, 0.4)',
        roadSurface: '#64748b',
        roadCurb: '#94a3b8',
        roadLine: 'rgba(255, 255, 255, 0.75)',
        sidewalk: '#e2e8f0',
        windowLit: ['#38bdf8', '#818cf8', '#fbbf24', '#ffffff'],
        windowDark: 'rgba(15, 23, 42, 0.12)',
        lampLight: 'rgba(251, 191, 36, 0.25)',
        lampBulb: '#fef08a',
        headlight: 'rgba(255, 255, 255, 0.65)',
        headlightBeam: 'rgba(254, 240, 138, 0.22)',
        taillight: '#ef4444',
        taillightGlow: 'rgba(239, 68, 68, 0.35)',
        walkers: ['#475569', '#334155', '#64748b'],
        cars: [
          { body: '#f8fafc', cabin: '#334155' },
          { body: '#38bdf8', cabin: '#0369a1' },
          { body: '#818cf8', cabin: '#3730a3' },
          { body: '#34d399', cabin: '#065f46' },
          { body: '#fbbf24', cabin: '#92400e' },
        ],
      };
    }
  }, [isDark]);

  // 初始化城市天际线与静态元素
  const generateCity = useCallback(
    (w: number, h: number) => {
      const prng = createPRNG(0x7e3); // 固定随机种子
      const roadHeight = Math.max(54, Math.min(84, h * 0.38));
      const groundY = h - roadHeight;

      const buildings: BuildingData[] = [];
      const lamps: LampData[] = [];
      const walkers: WalkerData[] = [];

      // 1. 远景楼宇 (Depth 0: 细高、冷灰暗色)
      let currentX = -20;
      while (currentX < w + 40) {
        const bw = 26 + prng() * 42;
        const bh = 55 + prng() * (groundY * 0.75);
        const by = groundY - bh;

        const winList: WindowData[] = [];
        const winCols = Math.max(2, Math.floor(bw / 9));
        const winRows = Math.max(3, Math.floor(bh / 11));
        for (let r = 0; r < winRows; r++) {
          for (let c = 0; c < winCols; c++) {
            const isLit = prng() < 0.32;
            winList.push({
              x: currentX + 4 + c * 8,
              y: by + 8 + r * 10,
              w: 3.5,
              h: 5,
              color: palette.windowLit[Math.floor(prng() * palette.windowLit.length)],
              isLit,
              phase: prng() * Math.PI * 2,
              pulseSpeed: 0.5 + prng() * 1.5,
            });
          }
        }

        buildings.push({
          x: currentX,
          y: by,
          w: bw,
          h: bh,
          depth: 0,
          color: palette.bgBuilding,
          hasSpire: prng() < 0.28,
          spireHeight: 12 + prng() * 20,
          windows: winList,
        });

        currentX += bw + (2 + prng() * 10);
      }

      // 2. 近景楼宇 (Depth 1: 层次丰富、屋顶装饰、高亮窗格)
      currentX = -10;
      while (currentX < w + 30) {
        const bw = 38 + prng() * 64;
        const bh = 35 + prng() * (groundY * 0.6);
        const by = groundY - bh;

        const winList: WindowData[] = [];
        const winCols = Math.max(3, Math.floor(bw / 10));
        const winRows = Math.max(2, Math.floor(bh / 12));
        for (let r = 0; r < winRows; r++) {
          for (let c = 0; c < winCols; c++) {
            const isLit = prng() < 0.45;
            winList.push({
              x: currentX + 5 + c * 9,
              y: by + 6 + r * 11,
              w: 4.5,
              h: 6,
              color: palette.windowLit[Math.floor(prng() * palette.windowLit.length)],
              isLit,
              phase: prng() * Math.PI * 2,
              pulseSpeed: 0.8 + prng() * 2,
            });
          }
        }

        buildings.push({
          x: currentX,
          y: by,
          w: bw,
          h: bh,
          depth: 1,
          color: palette.fgBuilding,
          hasSpire: prng() < 0.35,
          spireHeight: 8 + prng() * 16,
          windows: winList,
        });

        currentX += bw + (4 + prng() * 14);
      }

      // 3. 街灯生成 (间距 140~200px)
      const lampCount = Math.max(4, Math.floor(w / 160));
      const lampSpacing = w / lampCount;
      for (let i = 0; i <= lampCount; i++) {
        lamps.push({
          x: i * lampSpacing + (prng() * 20 - 10),
          y: groundY - 24,
          h: 24,
          lightColor: palette.lampLight,
        });
      }

      // 4. 人行道行走市民 (4 ~ 6 个)
      const walkerCount = Math.max(3, Math.min(8, Math.floor(w / 220)));
      for (let i = 0; i < walkerCount; i++) {
        walkers.push({
          x: prng() * w,
          y: groundY - 4,
          dir: prng() < 0.5 ? 1 : -1,
          speed: 12 + prng() * 14,
          color: palette.walkers[Math.floor(prng() * palette.walkers.length)],
          phase: prng() * Math.PI * 2,
        });
      }

      // 5. 初始化穿梭车流 (上车道向左，下车道向右)
      const carCount = Math.max(4, Math.min(10, Math.floor(w / 180)));
      const cars: CarData[] = [];
      const laneHeight = roadHeight / 2;

      for (let i = 0; i < carCount; i++) {
        const lane = i % 2; // 0: 上车道向左, 1: 下车道向右
        const dir = lane === 0 ? -1 : 1;
        const type = Math.floor(prng() * 4) as 0 | 1 | 2 | 3;
        const colorSet = palette.cars[Math.floor(prng() * palette.cars.length)];

        const carLengths = [34, 30, 42, 40];
        const carHeights = [13, 11, 17, 15];
        const cLen = carLengths[type];
        const cHgt = carHeights[type];

        const laneY = lane === 0 ? groundY + laneHeight * 0.45 : groundY + laneHeight * 1.35;

        cars.push({
          id: i,
          lane,
          dir,
          x: prng() * (w + 120) - 60,
          y: laneY,
          speed: (dir === 1 ? 55 : 48) + prng() * 35,
          type,
          length: cLen,
          height: cHgt,
          bodyColor: colorSet.body,
          cabinColor: colorSet.cabin,
          honkUntil: 0,
        });
      }

      stateRef.current.buildings = buildings;
      stateRef.current.lamps = lamps;
      stateRef.current.walkers = walkers;
      stateRef.current.cars = cars;
    },
    [palette]
  );

  // 渲染主循环
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = rect.width;
      const h = rect.height;

      stateRef.current.width = w;
      stateRef.current.height = h;
      stateRef.current.dpr = dpr;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      generateCity(w, h);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 视口可见性检测 (离开视口暂停 RAF 节能)
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        stateRef.current.isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    let lastTimestamp = performance.now();

    const render = (now: number) => {
      stateRef.current.animId = requestAnimationFrame(render);
      if (!stateRef.current.isVisible) return;

      const dt = Math.min(0.08, (now - lastTimestamp) / 1000);
      lastTimestamp = now;

      const { width: w, height: h, buildings, lamps, walkers, cars, mouseX, mouseY } = stateRef.current;
      if (w <= 0 || h <= 0) return;

      const roadHeight = Math.max(54, Math.min(84, h * 0.38));
      const groundY = h - roadHeight;

      ctx.clearRect(0, 0, w, h);

      // --- 1. 天空渐变 ---
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
      skyGrad.addColorStop(0, palette.skyGrad[0]);
      skyGrad.addColorStop(0.65, palette.skyGrad[1]);
      skyGrad.addColorStop(1, palette.skyGrad[2]);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, groundY);

      // --- 2. 远景楼宇 (Depth 0) ---
      for (const b of buildings) {
        if (b.depth !== 0) continue;
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.w, b.h);

        // 避雷针/天线
        if (b.hasSpire) {
          ctx.strokeStyle = palette.buildingStroke;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(b.x + b.w / 2, b.y);
          ctx.lineTo(b.x + b.w / 2, b.y - b.spireHeight);
          ctx.stroke();

          // 航空红色警告警示微光
          const blink = (Math.sin(now * 0.004 + b.x) + 1) * 0.5;
          ctx.fillStyle = `rgba(255, 60, 60, ${blink > 0.6 ? 0.9 : 0.15})`;
          ctx.beginPath();
          ctx.arc(b.x + b.w / 2, b.y - b.spireHeight, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // 远景窗格
        for (const win of b.windows) {
          if (!win.isLit) {
            ctx.fillStyle = palette.windowDark;
            ctx.fillRect(win.x, win.y, win.w, win.h);
          } else {
            const glow = (Math.sin(now * 0.001 * win.pulseSpeed + win.phase) + 1) * 0.5;
            ctx.fillStyle = win.color;
            ctx.globalAlpha = 0.25 + glow * 0.45;
            ctx.fillRect(win.x, win.y, win.w, win.h);
            ctx.globalAlpha = 1.0;
          }
        }
      }

      // --- 3. 近景楼宇 (Depth 1) ---
      for (const b of buildings) {
        if (b.depth !== 1) continue;
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = palette.buildingStroke;
        ctx.lineWidth = 1;
        ctx.strokeRect(b.x, b.y, b.w, b.h);

        // 窗格矩阵
        for (const win of b.windows) {
          if (!win.isLit) {
            ctx.fillStyle = palette.windowDark;
            ctx.fillRect(win.x, win.y, win.w, win.h);
          } else {
            const pulse = (Math.sin(now * 0.0015 * win.pulseSpeed + win.phase) + 1) * 0.5;
            ctx.fillStyle = win.color;
            ctx.globalAlpha = 0.5 + pulse * 0.5;
            ctx.fillRect(win.x, win.y, win.w, win.h);
            ctx.globalAlpha = 1.0;
          }
        }
      }

      // --- 4. 人行道与路面基底 ---
      // 人行道基座
      ctx.fillStyle = palette.sidewalk;
      ctx.fillRect(0, groundY - 5, w, 5);

      // 沥青主路面
      ctx.fillStyle = palette.roadSurface;
      ctx.fillRect(0, groundY, w, roadHeight);

      // 上路牙与下路牙线
      ctx.strokeStyle = palette.roadCurb;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(w, groundY);
      ctx.moveTo(0, h - 1);
      ctx.lineTo(w, h - 1);
      ctx.stroke();

      // 中央分道虚线
      const laneCenterY = groundY + roadHeight * 0.5;
      ctx.strokeStyle = palette.roadLine;
      ctx.lineWidth = 1.8;
      ctx.setLineDash([14, 18]);
      ctx.beginPath();
      ctx.moveTo(0, laneCenterY);
      ctx.lineTo(w, laneCenterY);
      ctx.stroke();
      ctx.setLineDash([]); // 还原实线

      // --- 5. 路灯与地面漫反射泛光光池 ---
      for (const lamp of lamps) {
        // 灯杆 (弧形复古杆身)
        ctx.strokeStyle = isDark ? '#334155' : '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lamp.x, groundY);
        ctx.lineTo(lamp.x, lamp.y);
        ctx.quadraticCurveTo(lamp.x, lamp.y - 7, lamp.x + 6, lamp.y - 7);
        ctx.stroke();

        // 灯头小灯泡
        ctx.fillStyle = palette.lampBulb;
        ctx.beginPath();
        ctx.arc(lamp.x + 6, lamp.y - 7, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // 投射到地面的放射状泛光光池 (Conical Light Pool)
        const poolX = lamp.x + 6;
        const poolY = groundY + 8;
        const poolGrad = ctx.createRadialGradient(poolX, poolY, 4, poolX, poolY, 48);
        poolGrad.addColorStop(0, palette.lampLight);
        poolGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = poolGrad;
        ctx.beginPath();
        ctx.ellipse(poolX, poolY, 48, 18, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- 6. 人行道行走市民 (Walkers) ---
      for (const wk of walkers) {
        wk.x += wk.speed * wk.dir * dt;
        if (wk.dir === 1 && wk.x > w + 20) wk.x = -20;
        if (wk.dir === -1 && wk.x < -20) wk.x = w + 20;

        const legSwing = Math.sin(now * 0.012 + wk.phase) * 3;
        const bob = Math.abs(Math.sin(now * 0.012 + wk.phase)) * 1.5;

        ctx.strokeStyle = wk.color;
        ctx.fillStyle = wk.color;
        ctx.lineWidth = 1.4;

        // 头部
        ctx.beginPath();
        ctx.arc(wk.x, wk.y - 10 - bob, 2, 0, Math.PI * 2);
        ctx.fill();

        // 躯干
        ctx.beginPath();
        ctx.moveTo(wk.x, wk.y - 8 - bob);
        ctx.lineTo(wk.x, wk.y - 3 - bob);
        ctx.stroke();

        // 双腿行走摆动
        ctx.beginPath();
        ctx.moveTo(wk.x, wk.y - 3 - bob);
        ctx.lineTo(wk.x - legSwing, wk.y);
        ctx.moveTo(wk.x, wk.y - 3 - bob);
        ctx.lineTo(wk.x + legSwing, wk.y);
        ctx.stroke();
      }

      // --- 7. 双向车流运动与大灯/尾灯渲染 ---
      let hoveredFound = false;

      // 车流按 Y 坐标排序，确保透视前后遮挡正确
      cars.sort((a, b) => a.y - b.y);

      for (const car of cars) {
        // 更新位置
        car.x += car.speed * car.dir * dt;

        // 出界循环回流
        if (car.dir === 1 && car.x > w + car.length + 80) {
          car.x = -car.length - 80;
        } else if (car.dir === -1 && car.x < -car.length - 80) {
          car.x = w + car.length + 80;
        }

        const isHonking = now < car.honkUntil;
        const cx = car.x;
        const cy = car.y;
        const cLen = car.length;
        const cHgt = car.height;

        // 检测鼠标是否悬停于车身
        const carBox = {
          left: car.dir === 1 ? cx : cx - cLen,
          right: car.dir === 1 ? cx + cLen : cx,
          top: cy - cHgt / 2 - 4,
          bottom: cy + cHgt / 2 + 4,
        };
        const isHovered = mouseX >= carBox.left && mouseX <= carBox.right && mouseY >= carBox.top && mouseY <= carBox.bottom;
        if (isHovered) {
          hoveredFound = true;
          stateRef.current.hoveredCarId = car.id;
        }

        // A. 前大灯光束 (Headlight Conical Beams)
        // 向行驶方向前方投射强穿透性梯形渐变光锥
        const beamLength = 70 + (car.speed / 70) * 20;
        const beamSpread = 16;
        const lightOriginX = car.dir === 1 ? cx + cLen - 2 : cx - cLen + 2;
        const lightEndX = car.dir === 1 ? lightOriginX + beamLength : lightOriginX - beamLength;

        const beamGrad = ctx.createLinearGradient(lightOriginX, cy, lightEndX, cy);
        beamGrad.addColorStop(0, palette.headlight);
        beamGrad.addColorStop(0.35, palette.headlightBeam);
        beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(lightOriginX, cy - 3);
        ctx.lineTo(lightEndX, cy - beamSpread);
        ctx.lineTo(lightEndX, cy + beamSpread);
        ctx.lineTo(lightOriginX, cy + 3);
        ctx.closePath();
        ctx.fill();

        // B. 绘制车身底盘
        ctx.save();
        ctx.translate(cx, cy);
        if (car.dir === -1) {
          ctx.scale(-1, 1); // 统一面向右侧建模，通过 scale(-1, 1) 反转
        }

        // 悬浮/震动微动效 (鸣笛时上下抖动)
        if (isHonking) {
          ctx.translate(0, (Math.sin(now * 0.05) * 1.5));
        }

        // 车身主体 (主底盘)
        ctx.fillStyle = isHonking ? '#38bdf8' : car.bodyColor;
        ctx.beginPath();
        // 简易圆角底盘
        ctx.roundRect(0, -cHgt / 2 + 2, cLen, cHgt * 0.55, 3);
        ctx.fill();

        // 驾驶舱 / 车窗
        ctx.fillStyle = car.cabinColor;
        ctx.beginPath();
        if (car.type === 2) {
          // 箱式货车方正座舱
          ctx.roundRect(2, -cHgt / 2 - 3, cLen - 4, cHgt * 0.65, 2);
        } else {
          // 轿车/跑车溜背流线座舱
          ctx.roundRect(cLen * 0.22, -cHgt / 2 - 2, cLen * 0.55, cHgt * 0.52, 3);
        }
        ctx.fill();

        // 车窗玻璃发光高光
        ctx.fillStyle = isDark ? 'rgba(92, 242, 196, 0.45)' : 'rgba(255, 255, 255, 0.65)';
        ctx.beginPath();
        ctx.rect(cLen * 0.35, -cHgt / 2 - 1, cLen * 0.35, cHgt * 0.32);
        ctx.fill();

        // 车轮 (前后双轮)
        const wheelY = cHgt * 0.35;
        const wheelR = Math.max(3.5, cHgt * 0.28);
        const frontWheelX = cLen * 0.8;
        const rearWheelX = cLen * 0.22;

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(rearWheelX, wheelY, wheelR, 0, Math.PI * 2);
        ctx.arc(frontWheelX, wheelY, wheelR, 0, Math.PI * 2);
        ctx.fill();

        // 轮毂银色微圈
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(rearWheelX, wheelY, wheelR * 0.5, 0, Math.PI * 2);
        ctx.arc(frontWheelX, wheelY, wheelR * 0.5, 0, Math.PI * 2);
        ctx.stroke();

        // 前大灯光源本体 (前端发光小圆)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cLen - 1.5, -cHgt * 0.1, 2, 0, Math.PI * 2);
        ctx.fill();

        // 后尾灯红光 (Taillight LED + 外光晕)
        ctx.fillStyle = palette.taillight;
        ctx.beginPath();
        ctx.arc(1.5, -cHgt * 0.1, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // 尾灯外晕
        const tailGlow = ctx.createRadialGradient(1.5, -cHgt * 0.1, 1, 1.5, -cHgt * 0.1, 7);
        tailGlow.addColorStop(0, palette.taillightGlow);
        tailGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = tailGlow;
        ctx.beginPath();
        ctx.arc(1.5, -cHgt * 0.1, 7, 0, Math.PI * 2);
        ctx.fill();

        // C. 鸣笛气泡 / 交互反馈
        if (isHonking) {
          ctx.fillStyle = '#5cf2c4';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(car.honkText || 'BEEP!', cLen * 0.3, -cHgt - 5);
        }

        ctx.restore();
      }

      setIsHoveringCar(hoveredFound);
    };

    stateRef.current.animId = requestAnimationFrame(render);

    return () => {
      if (stateRef.current.animId) {
        cancelAnimationFrame(stateRef.current.animId);
      }
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [palette, generateCity, isDark]);

  // 鼠标移动检测
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    stateRef.current.mouseX = e.clientX - rect.left;
    stateRef.current.mouseY = e.clientY - rect.top;
  };

  const handleMouseLeave = () => {
    stateRef.current.mouseX = -100;
    stateRef.current.mouseY = -100;
    setIsHoveringCar(false);
  };

  // 点击车辆触发趣味短鸣笛与灯光闪烁
  const handleClick = () => {
    const { hoveredCarId, cars } = stateRef.current;
    if (hoveredCarId === null) return;

    const car = cars.find((c) => c.id === hoveredCarId);
    if (!car) return;

    soundManager.playCarHonk();
    car.honkUntil = performance.now() + 850;
    const honkPhrases = ['BEEP!', '⚡ FAST', 'HONK!', 'CYBER 2026', 'CIOOOOL!'];
    car.honkText = honkPhrases[Math.floor(Math.random() * honkPhrases.length)];
  };

  return (
    <div
      id="street"
      ref={containerRef}
      className={`relative w-full h-44 sm:h-52 md:h-60 overflow-hidden select-none border-t border-[var(--border-line)] transition-colors duration-300 ${
        isHoveringCar ? 'cursor-pointer' : 'cursor-default'
      }`}
      aria-label="赛博都市天际线与车流穿梭街景"
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="w-full h-full block"
      />

      {/* 底部微小极客终端状态指示 */}
      <div className="absolute bottom-2 right-4 pointer-events-none text-[9px] font-mono tracking-widest text-[var(--text-muted)] opacity-60 hidden sm:block">
        NEON TRANSIT // 60FPS PROC-GEN CITY
      </div>
    </div>
  );
};

export default StreetCanvas;
