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

export default function WhoIsMegha() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Subtle stardust particle simulation matching Hero density and twinkle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight * 2);

    const particleCount = Math.min(75, Math.floor((width * height) / 28000));
    const particles: Particle[] = [];

    const colors = [
      "rgba(210, 240, 255, ", // icy cyan/white
      "rgba(180, 220, 255, ", // soft cosmic blue
      "rgba(255, 235, 210, ", // faint warm stardust
      "rgba(255, 255, 255, ", // pure white pinpoint
    ];

    for (let i = 0; i < particleCount; i++) {
      const isWarm = Math.random() < 0.2;
      const color = isWarm ? colors[2] : colors[Math.floor(Math.random() * colors.length)];
      const baseAlpha = 0.15 + Math.random() * 0.45;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.6 + Math.random() * 1.1,
        alpha: baseAlpha,
        baseAlpha,
        speedY: (Math.random() - 0.5) * 0.08,
        speedX: (Math.random() - 0.5) * 0.05,
        twinkleSpeed: 0.008 + Math.random() * 0.018,
        twinklePhase: Math.random() * Math.PI * 2,
        color,
      });
    }

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
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
          p.baseAlpha + Math.sin(p.twinklePhase) * (p.baseAlpha * 0.55);

        p.x += p.speedX * dt * 60;
        p.y += p.speedY * dt * 60;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0.04, Math.min(0.9, currentAlpha))})`;
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

  const journeyMilestones = [
    {
      step: "01",
      label: "CURIOUS",
      side: "left",
      status: "Origin",
      headline: "[THE GENESIS]",
      description:
        "Unraveling how digital systems, visual interfaces, and machine interactions behave beneath the surface.",
    },
    {
      step: "02",
      label: "BUILDER",
      side: "right",
      status: "Craft",
      headline: "[CODE & ARCHITECTURE]",
      description:
        "Translating curiosity into resilient systems, shipping full-stack products, and mastering software craft.",
    },
    {
      step: "03",
      label: "EXPLORER",
      side: "left",
      status: "Frontier",
      headline: "[AI & NEW PARADIGMS]",
      description:
        "Venturing across multimodal intelligence, computer vision, and experimental interaction models.",
    },
    {
      step: "04",
      label: "NOW",
      side: "right",
      status: "Current",
      headline: "[CREATIVE TECHNOLOGIST]",
      description:
        "Operating at the intersection of engineering and design — building quiet, intelligent, human-centric software.",
    },
    {
      step: "05",
      label: "NEXT",
      side: "left",
      status: "Horizon",
      headline: "[UNCHARTED TERRITORY]",
      description:
        "Pioneering autonomous agent workflows, spatial computing, and expanding what people can create with machines.",
    },
  ];

  return (
    <section
      id="who-is-megha"
      className="relative w-full bg-[#020306] text-[#f2f4f8] py-28 md:py-36 px-6 sm:px-10 md:px-16 lg:px-24 overflow-hidden select-none"
    >
      {/* 1. CONTINUOUS COSMIC ENVIRONMENT & VERTICAL ENERGY SPINE */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        {/* Deep space starfield layer with enhanced visibility */}
        <div className="absolute inset-0 opacity-40 mix-blend-screen">
          <Image
            src="/images/deep-space.png"
            alt="Deep space nebula and starfield"
            fill
            quality={90}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Ambient atmospheric haze to blend seamlessly with hero */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020306] via-transparent to-[#020306] opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,32,64,0.25)_0%,transparent_70%)]" />

        {/* Dynamic canvas stardust matching Hero density */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* CONTINUOUS VERTICAL ENERGY BEAM SPINE */}
        {/* Travels straight through the entire section, anchoring the composition & journey timeline */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 pointer-events-none z-0">
          {/* Core Hairline Beam */}
          <div className="w-[1px] h-full bg-gradient-to-b from-cyan-300/50 via-cyan-400/20 to-cyan-300/40" />
          {/* Soft Glow */}
          <div className="absolute inset-0 -left-[1px] w-[3px] blur-[3px] bg-gradient-to-b from-cyan-400/35 via-cyan-400/15 to-cyan-400/25" />
          {/* Diffuse Atmospheric Halo */}
          <div className="absolute inset-0 -left-[16px] w-[32px] blur-[18px] bg-gradient-to-b from-cyan-500/15 via-blue-500/08 to-cyan-500/12" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col">
        {/* 2. SECTION HEADER & ASYMMETRICAL EDITORIAL HEADING */}
        <div className="w-full flex flex-col mb-20 md:mb-28">
          {/* Section Indexer */}
          <div className="flex items-center justify-between font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-white/40 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-cyan-400/90 font-mono">01</span>
              <span className="text-white/20">/</span>
              <span>IDENTITY & PHILOSOPHY</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-white/25 tracking-[0.25em]">
              <span>ORIGIN ARCHIVE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-pulse" />
            </div>
          </div>

          {/* Large Architectural Heading — Matching Hero Font Weight & Proportions */}
          <div className="mt-10 sm:mt-12 pl-0 sm:pl-4 lg:pl-8">
            <h2
              style={{ fontWeight: 100 }}
              className="font-display uppercase text-[clamp(4.2rem,10vw,8.5rem)] leading-[0.88] tracking-[0.18em] sm:tracking-[0.22em] text-white/95"
            >
              Who Is Megha
            </h2>
            <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.32em] text-white/40 uppercase mt-4 font-light">
              Creative Technologist &bull; Developer &bull; Explorer
            </p>
          </div>
        </div>

        {/* 3. ASYMMETRICAL 2-COLUMN ARCHITECTURAL CORE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Genuine Photograph / Visual Frame (Breaks Grid with Asymmetry) */}
          <div className="lg:col-span-5 flex flex-col lg:-translate-x-3 lg:translate-y-2">
            <div className="relative aspect-[3/4] w-full rounded-xs border border-white/20 bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-sm overflow-hidden flex flex-col justify-between p-6 sm:p-8 group hover:border-cyan-400/40 transition-colors duration-700 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
              {/* Corner crosshairs/tick marks */}
              <span className="absolute top-2.5 left-2.5 font-mono text-[9px] text-white/30">+</span>
              <span className="absolute top-2.5 right-2.5 font-mono text-[9px] text-white/30">+</span>
              <span className="absolute bottom-2.5 left-2.5 font-mono text-[9px] text-white/30">+</span>
              <span className="absolute bottom-2.5 right-2.5 font-mono text-[9px] text-white/30">+</span>

              {/* Minimal top tag inside frame */}
              <div className="flex items-center justify-between text-[9px] font-mono tracking-[0.28em] text-white/30 uppercase">
                <span>PORTRAIT FRAME</span>
                <span>ASPECT 3:4</span>
              </div>

              {/* Central genuine placeholder container — High-contrast bright focal point */}
              <div className="flex flex-col items-center justify-center text-center px-4 my-auto">
                <div className="w-16 h-16 rounded-full border border-white/25 flex items-center justify-center mb-5 relative group-hover:border-cyan-400/60 transition-colors duration-500">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400/80 animate-ping" />
                  <div className="w-2 h-2 rounded-full bg-cyan-300 absolute shadow-[0_0_8px_#22d3ee]" />
                </div>

                <p className="font-mono text-xs sm:text-sm tracking-[0.22em] text-white/95 uppercase font-medium">
                  [GENUINE PHOTOGRAPH PLACEHOLDER]
                </p>
                <p className="text-[11px] text-white/40 tracking-wide mt-2.5 max-w-xs leading-relaxed font-light">
                  A high-resolution, genuine editorial portrait or creative visual of Megha will be placed here.
                </p>
              </div>

              {/* Bottom metadata inside frame */}
              <div className="flex items-center justify-between text-[9px] font-mono tracking-[0.22em] text-white/30 uppercase pt-4 border-t border-white/10">
                <span>FIG. 01</span>
                <span>[PHOTOGRAPH ASSET PENDING]</span>
              </div>
            </div>

            {/* Single quiet one-line human caption beneath portrait (Replaces rigid metadata grid) */}
            <p className="mt-4 font-mono text-[10px] text-white/35 uppercase tracking-[0.24em] text-center">
              FIG. 01 &mdash; MEGHA &bull; CREATIVE TECHNOLOGIST &bull; [LOCATION PENDING]
            </p>
          </div>

          {/* Right Column: High-Contrast Philosophy & Organic Story Text (No Container Boxes) */}
          <div className="lg:col-span-7 flex flex-col justify-between lg:pl-4">
            {/* Opening Philosophy Statement — Noticeably Bright Focal Point */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-cyan-400/60 lg:ml-4">
              <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-cyan-400/90 block mb-3">
                Core Philosophy
              </span>
              <p className="text-xl sm:text-2xl md:text-[1.85rem] font-light text-white/95 leading-snug tracking-tight">
                &ldquo;[PERSONAL STATEMENT / PHILOSOPHY PLACEHOLDER &mdash; e.g. Building at the intersection of creative intuition and computational depth. Crafting software and spatial experiences that feel quiet, deliberate, and deeply human.]&rdquo;
              </p>
            </div>

            {/* Story Paragraphs — Sitting directly on the cosmic background with generous space (No Boxes) */}
            <div className="mt-12 sm:mt-16 space-y-9 text-sm sm:text-[15px] leading-relaxed text-white/50 font-sans font-light tracking-wide max-w-xl lg:ml-12">
              <div>
                <span className="font-mono text-[9px] tracking-[0.28em] text-white/30 uppercase block mb-3">
                  [STORY 01 &bull; ORIGIN & INTRODUCTION]
                </span>
                <p className="leading-relaxed">
                  [CONTENT PLACEHOLDER: Megha will provide the opening personal story here detailing early sparks of curiosity, background, and the path that led to building interactive systems and creative technology.]
                </p>
              </div>

              <div>
                <span className="font-mono text-[9px] tracking-[0.28em] text-white/30 uppercase block mb-3">
                  [STORY 02 &bull; PERSPECTIVE & CRAFT]
                </span>
                <p className="leading-relaxed">
                  [CONTENT PLACEHOLDER: Megha will describe personal working principles here — combining artistic restraint with technical rigor, tackling complex problems, and exploring modern frontiers like generative intelligence.]
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. REWORKED NON-LINEAR JOURNEY PATH ALONG THE COSMIC BEAM */}
        <div className="mt-32 md:mt-44 relative">
          {/* Track Header */}
          <div className="text-center max-w-xl mx-auto mb-16 md:mb-24">
            <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-cyan-400/80 block mb-2">
              Trajectory
            </span>
            <h3
              style={{ fontWeight: 200 }}
              className="font-display uppercase text-2xl sm:text-3xl tracking-[0.15em] text-white/90"
            >
              Visual Journey
            </h3>
            <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-white/30 uppercase mt-2">
              CURIOUS &rarr; BUILDER &rarr; EXPLORER &rarr; NOW &rarr; NEXT
            </p>
          </div>

          {/* Staggered Vertical Path Along the Central Cosmic Spine */}
          <div className="relative w-full max-w-4xl mx-auto flex flex-col gap-12 sm:gap-16 md:gap-20">
            {journeyMilestones.map((m, idx) => {
              const isCurrent = m.label === "NOW";
              const isLeft = m.side === "left";

              return (
                <div
                  key={m.label}
                  className={`relative flex items-center w-full ${
                    isLeft
                      ? "md:justify-start"
                      : "md:justify-end"
                  }`}
                >
                  {/* Center Node on the Cosmic Spine */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-20">
                    <div
                      className={`rounded-full transition-all duration-500 ${
                        isCurrent
                          ? "w-3.5 h-3.5 bg-cyan-300 shadow-[0_0_15px_#22d3ee] border-2 border-cyan-400"
                          : "w-2 h-2 bg-white/40 border border-white/20"
                      }`}
                    />
                    {/* Delicate connecting hairline from node to card */}
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 h-[1px] ${
                        isLeft
                          ? "right-full w-8 bg-gradient-to-l from-cyan-400/30 to-transparent"
                          : "left-full w-8 bg-gradient-to-r from-cyan-400/30 to-transparent"
                      }`}
                    />
                  </div>

                  {/* Staggered Milestone Card — Terse, evocative, floating */}
                  <div
                    className={`relative z-10 w-full md:w-[45%] p-5 sm:p-6 rounded-xs border transition-all duration-500 ${
                      isCurrent
                        ? "border-cyan-400/30 bg-cyan-950/[0.08] shadow-[0_0_30px_rgba(6,182,212,0.06)]"
                        : "border-white/10 bg-white/[0.015] hover:border-white/20"
                    } ${isLeft ? "md:mr-auto" : "md:ml-auto"}`}
                  >
                    {/* Header with step number and badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {/* Mobile node indicator */}
                        <div
                          className={`md:hidden rounded-full ${
                            isCurrent
                              ? "w-2.5 h-2.5 bg-cyan-300 shadow-[0_0_8px_#22d3ee]"
                              : "w-1.5 h-1.5 bg-white/30"
                          }`}
                        />
                        <span className="font-mono text-[9px] tracking-[0.25em] text-white/35">
                          {m.step}
                        </span>
                      </div>

                      <span
                        className={`font-mono text-[8px] uppercase tracking-[0.25em] ${
                          isCurrent
                            ? "text-cyan-300 font-medium"
                            : "text-white/30"
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>

                    {/* Stage Name */}
                    <div className="mb-2">
                      <h4
                        className={`font-display text-xl sm:text-2xl uppercase tracking-[0.1em] ${
                          isCurrent ? "text-cyan-200 font-normal" : "text-white/85 font-light"
                        }`}
                      >
                        {m.label}
                      </h4>
                      <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.2em] text-white/35 uppercase block mt-0.5">
                        {m.headline}
                      </span>
                    </div>

                    {/* Short evocative one-line copy */}
                    <p className="text-xs leading-relaxed text-white/45 font-light mt-3 border-t border-white/5 pt-2.5">
                      {m.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. CLOSING STATEMENT MOMENT — Emotional handoff to Project Universe */}
        <div className="relative z-10 mt-36 md:mt-48 mb-16 md:mb-24 text-center max-w-3xl mx-auto px-4">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.34em] text-white/30 block mb-6">
            [PHILOSOPHICAL ANCHOR]
          </span>
          <p
            style={{ fontWeight: 200 }}
            className="font-display text-2xl sm:text-3xl md:text-[2.25rem] lg:text-[2.65rem] leading-[1.32] tracking-[0.06em] text-white/90"
          >
            &ldquo;I&rsquo;m not trying to have everything figured out yet. I&rsquo;m trying to see how far I can take an idea.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
