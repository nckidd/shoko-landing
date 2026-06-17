/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";
 
export const Wave = ({
  children,
  className,
  containerClassName,
  //colors,
  waveWidth,
  //backgroundFill,
  blur = 7, //changed blur from 10 -> to improve performance
  speed = "fast",
  //waveOpacity = 0.5,
  ...props
}: {
  children?: any;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}) => {
  const noise = createNoise3D();
  let w: number,
    h: number,
    nt: number,
    i: number,
    x: number,
    ctx: any,
    canvas: any;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };
 
  const init = () => {
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");

    //reduce load by half
    const dpr = Math.min(window.devicePixelRatio, 1.5); //cap pixel density
    w = ctx.canvas.width = window.innerWidth * dpr;
    h = ctx.canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    // w = ctx.canvas.width = window.innerWidth;
    // h = ctx.canvas.height = window.innerHeight;

    ctx.filter = `blur(${blur}px)`;
    nt = 0;
    // window.onresize = function () {
    //   w = ctx.canvas.width = window.innerWidth;
    //   h = ctx.canvas.height = window.innerHeight;
    //   ctx.filter = `blur(${blur}px)`;
    // };

    //fix resize handler to avoid leaks
    const handleResize = () => {
      w = ctx.canvas.width = window.innerWidth;
      h = ctx.canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize); 
    render();
  };
 
  // const waveColors = colors ?? [
  //   "#38bdf8",
  //   "#818cf8",
  //   "#c084fc",
  //   "#e879f9",
  //   "#22d3ee",
  // ];
  const drawWave = (n: number) => {
    nt += getSpeed();
    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 50;
      //ctx.strokeStyle = waveColors[i % waveColors.length];
      ctx.globalAlpha = 0.3 + i * 0.15;

      //add gradient strokes
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, "#00c6ff"); //ocean blue
      gradient.addColorStop(0.3, "#38f9d7"); //deep blue
      gradient.addColorStop(0.6, "#43e97b"); //aqua
      gradient.addColorStop(1, "#ff7e5f"); //sunset coral
      ctx.strokeStyle = gradient;

      //reduced point density from x+=5 to 15
      for (x = 0; x < w; x += 15) {
        const y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx.lineTo(x, y + h * 0.5); // adjust for height, currently at 50% of the container
      }
      ctx.stroke();
      ctx.closePath();
    }
  };
 
  let animationId: number;
  // const render = () => {
  //   ctx.fillStyle = backgroundFill || "black";
  //   ctx.globalAlpha = waveOpacity || 0.5;
  //   ctx.fillRect(0, 0, w, h);
  //   //reduced wave complexity from 5 -> 2
  //   drawWave(2);
  //   animationId = requestAnimationFrame(render);
  // };
  
  // improve throttle animation
  let lastTime = 0;

  const render = (time = 0) => {
    if (time - lastTime < 30) {
      
      animationId = requestAnimationFrame(render);
      return;
    }
    lastTime = time;

    // ctx.fillStyle = backgroundFill || "black";
    // ctx.globalAlpha = waveOpacity || 0.5;
    // ctx.fillRect(0, 0, w, h);
    //transparent background
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = 0.2;
    drawWave(2); //reduced wave complexity from 5 -> 2

    animationId = requestAnimationFrame(render);
  }
 
  useEffect(() => {
    init();
    return () => {
      cancelAnimationFrame(animationId);
      //window.removeEventListener("resize", handleResize);
    };
  }, []);
 
  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    //support on safari
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);
 
  return (
    <div
      className={cn(
        "w-min h-min",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};