"use client";

import React, { useEffect, useRef } from "react";

interface Car {
  lane: number; // 0 或 1
  y: number;
  speed: number;
  dir: 1 | -1; // 1 = 向下行驶, -1 = 向上行驶
  length: number;
  width: number;
  color: string;
  headlightColor: string;
}

export default function SideTrafficCanvas() {
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const leftCanvas = leftCanvasRef.current;
    const rightCanvas = rightCanvasRef.current;
    if (!leftCanvas || !rightCanvas) return;

    const leftCtx = leftCanvas.getContext("2d");
    const rightCtx = rightCanvas.getContext("2d");
    if (!leftCtx || !rightCtx) return;

    let animId: number;
    let width = 64;
    let height = window.innerHeight;

    leftCanvas.width = rightCanvas.width = width;
    leftCanvas.height = rightCanvas.height = height;

    const carColors = [
      "#5CF2C4", // Mint Phosphor
      "#8B7BFF", // Electric Violet
      "#38BDF8", // Cyan
      "#F43F5E", // Rose Pink
      "#FBBF24", // Amber
      "#E2E8F0", // Silver White
    ];

    const createCars = (count: number): Car[] => {
      const cars: Car[] = [];
      for (let i = 0; i < count; i++) {
        const lane = Math.random() < 0.5 ? 0 : 1;
        const dir = lane === 0 ? 1 : -1; // Lane 0 向下, Lane 1 向上
        cars.push({
          lane,
          y: Math.random() * height,
          speed: Math.random() * 1.6 + 1.2,
          dir,
          length: Math.random() * 4 + 14,
          width: 5.5,
          color: carColors[Math.floor(Math.random() * carColors.length)],
          headlightColor: Math.random() < 0.7 ? "#FFFFFF" : "#5CF2C4",
        });
      }
      return cars;
    };

    const leftCars = createCars(7);
    const rightCars = createCars(7);

    const laneX = [20, 44]; // 两条车道 X 坐标

    const drawRoadAndCars = (ctx: CanvasRenderingContext2D, cars: Car[]) => {
      ctx.clearRect(0, 0, width, height);

      // 1. 绘制纵向道路线与微弱虚线标线
      ctx.strokeStyle = "rgba(31, 42, 77, 0.45)";
      ctx.lineWidth = 1;

      // 道路外侧边线
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(8, height);
      ctx.moveTo(56, 0);
      ctx.lineTo(56, height);
      ctx.stroke();

      // 中央虚线
      ctx.strokeStyle = "rgba(92, 242, 196, 0.12)";
      ctx.setLineDash([8, 12]);
      ctx.beginPath();
      ctx.moveTo(32, 0);
      ctx.lineTo(32, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. 绘制流动车辆
      for (let i = 0; i < cars.length; i++) {
        const car = cars[i];

        // 沿方向移动
        car.y += car.speed * car.dir;

        // 越界回环
        if (car.dir === 1 && car.y > height + 40) {
          car.y = -40;
          car.color = carColors[Math.floor(Math.random() * carColors.length)];
        } else if (car.dir === -1 && car.y < -40) {
          car.y = height + 40;
          car.color = carColors[Math.floor(Math.random() * carColors.length)];
        }

        const cx = laneX[car.lane];
        const cy = car.y;

        // 车身主体 (微型发光胶囊)
        ctx.fillStyle = car.color;
        ctx.shadowBlur = 4;
        ctx.shadowColor = car.color;

        ctx.beginPath();
        ctx.roundRect(cx - car.width / 2, cy - car.length / 2, car.width, car.length, 2);
        ctx.fill();

        // 车顶深色舷窗
        ctx.fillStyle = "#05070F";
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.roundRect(cx - car.width / 2 + 1, cy - car.length / 4, car.width - 2, car.length / 2, 1);
        ctx.fill();

        // 车灯：车头前大灯 (白/绿前射微光) & 车尾尾灯 (红点)
        if (car.dir === 1) {
          // 向下开：底部为车头，顶部为车尾
          // 前大灯
          ctx.fillStyle = car.headlightColor;
          ctx.shadowBlur = 8;
          ctx.shadowColor = car.headlightColor;
          ctx.fillRect(cx - car.width / 2, cy + car.length / 2 - 1, 1.8, 2);
          ctx.fillRect(cx + car.width / 2 - 1.8, cy + car.length / 2 - 1, 1.8, 2);

          // 前大灯微弱前向漫射光锥
          ctx.fillStyle = "rgba(92, 242, 196, 0.08)";
          ctx.beginPath();
          ctx.moveTo(cx - 2, cy + car.length / 2);
          ctx.lineTo(cx - 8, cy + car.length / 2 + 18);
          ctx.lineTo(cx + 8, cy + car.length / 2 + 18);
          ctx.lineTo(cx + 2, cy + car.length / 2);
          ctx.fill();

          // 尾灯 (红)
          ctx.fillStyle = "#EF4444";
          ctx.shadowBlur = 6;
          ctx.shadowColor = "#EF4444";
          ctx.fillRect(cx - car.width / 2, cy - car.length / 2 - 1, 1.6, 1.5);
          ctx.fillRect(cx + car.width / 2 - 1.6, cy - car.length / 2 - 1, 1.6, 1.5);
        } else {
          // 向上开：顶部为车头，底部为车尾
          // 前大灯
          ctx.fillStyle = car.headlightColor;
          ctx.shadowBlur = 8;
          ctx.shadowColor = car.headlightColor;
          ctx.fillRect(cx - car.width / 2, cy - car.length / 2 - 1, 1.8, 2);
          ctx.fillRect(cx + car.width / 2 - 1.8, cy - car.length / 2 - 1, 1.8, 2);

          // 前大灯微弱前向漫射光锥
          ctx.fillStyle = "rgba(92, 242, 196, 0.08)";
          ctx.beginPath();
          ctx.moveTo(cx - 2, cy - car.length / 2);
          ctx.lineTo(cx - 8, cy - car.length / 2 - 18);
          ctx.lineTo(cx + 8, cy - car.length / 2 - 18);
          ctx.lineTo(cx + 2, cy - car.length / 2);
          ctx.fill();

          // 尾灯 (红)
          ctx.fillStyle = "#EF4444";
          ctx.shadowBlur = 6;
          ctx.shadowColor = "#EF4444";
          ctx.fillRect(cx - car.width / 2, cy + car.length / 2, 1.6, 1.5);
          ctx.fillRect(cx + car.width / 2 - 1.6, cy + car.length / 2, 1.6, 1.5);
        }

        ctx.shadowBlur = 0;
      }
    };

    const render = () => {
      drawRoadAndCars(leftCtx, leftCars);
      drawRoadAndCars(rightCtx, rightCars);
      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      height = window.innerHeight;
      leftCanvas.height = rightCanvas.height = height;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* 屏幕左边缘流动车流 */}
      <div className="fixed left-0 top-0 bottom-0 w-12 sm:w-14 pointer-events-none z-10 hidden md:block opacity-75">
        <canvas ref={leftCanvasRef} className="w-full h-full" />
      </div>

      {/* 屏幕右边缘流动车流 */}
      <div className="fixed right-0 top-0 bottom-0 w-12 sm:w-14 pointer-events-none z-10 hidden md:block opacity-75">
        <canvas ref={rightCanvasRef} className="w-full h-full" />
      </div>
    </>
  );
}
