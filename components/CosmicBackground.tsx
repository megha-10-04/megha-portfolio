"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface Particle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  speedY: number;
  speedX: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Generate faint stardust particles
    const particleCount = Math.min(65, Math.floor((width * height) / 25000));
    const particles: Particle[] = [];

    const colors = [
      "rgba(210, 240, 255, ", // icy cyan/white
      "rgba(180, 220, 255, ", // soft cosmic blue
      "rgba(255, 235, 210, ", // faint warm stardust
      "rgba(255, 255, 255, ", // pure white pinpoint
    ];

    for (let i = 0; i < particleCount; i++) {
      const isWarm = Math.random() < 0.25;
      const color = isWarm ? colors[2] : colors[Math.floor(Math.random() * colors.length)];
      const baseAlpha = 0.15 + Math.random() * 0.45;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.6 + Math.random() * 1.2,
        alpha: baseAlpha,
        baseAlpha,
        speedY: (Math.random() - 0.5) * 0.12,
        speedX: (Math.random() - 0.5) * 0.08,
        twinkleSpeed: 0.008 + Math.random() * 0.02,
        twinklePhase: Math.random() * Math.PI * 2,
        color,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.twinklePhase += p.twinkleSpeed;
        const currentAlpha =
          p.baseAlpha + Math.sin(p.twinklePhase) * (p.baseAlpha * 0.5);

        p.x += p.speedX * dt * 60;
        p.y += p.speedY * dt * 60;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0.05, Math.min(1, currentAlpha))})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#020306]">
      {/* Cinematic Cosmic Image */}
      <div className="absolute inset-0 select-none">
        <Image
          src="/images/cosmic-bg.jpg"
          alt="Cosmic Environment"
          fill
          priority
          quality={95}
          className="object-cover object-center scale-105 transition-transform duration-1000 opacity-80 mix-blend-screen"
          sizes="100vw"
        />
      </div>

      {/* Atmospheric Vertical Energy Axis Line */}
      <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[1px] cosmic-beam pointer-events-none">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-cyan-300/35 to-transparent" />
        <div className="absolute inset-0 blur-[2px] bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent" />
      </div>

      {/* Horizontal Subtle Atmospheric Horizon Glow */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[1px] pointer-events-none">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-amber-400/20 to-transparent blur-[1px]" />
      </div>

      {/* Vignette & Contrast Control Overlay so Typography remains the primary subject */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/75" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(2,3,6,0.75)_85%)]" />

      {/* Micro-particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen pointer-events-none"
      />
    </div>
  );
}
