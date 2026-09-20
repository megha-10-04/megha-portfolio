"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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

interface ProjectData {
  id: string;
  slug: string;
  number: string;
  title: string;
  category: string;
  tag: string;
  description: string;
  preferredSide: "left" | "right";
}

const PROJECTS: ProjectData[] = [
  {
    id: "proj-01",
    slug: "ai-student-coach",
    number: "01",
    title: "AI Student Coach",
    category: "AI / Mobile / Productivity",
    tag: "Adaptive Intelligence",
    description:
      "[Intelligent adaptive mentorship system paired with real-time cognitive feedback and personalized retention curves]",
    preferredSide: "left",
  },
  {
    id: "proj-02",
    slug: "drishti",
    number: "02",
    title: "Drishti",
    category: "AI / ML / SIH",
    tag: "Computer Vision & Accessibility",
    description:
      "[Intelligent visual assistance system recognized nationally at Smart India Hackathon for empowering the visually impaired]",
    preferredSide: "right",
  },
  {
    id: "proj-03",
    slug: "ai-photobooth",
    number: "03",
    title: "AI Photobooth",
    category: "Computer Vision / Python",
    tag: "Generative Synthesis",
    description:
      "[High-throughput computer vision pipeline integrating real-time neural segmentation with generative latent styling]",
    preferredSide: "left",
  },
  {
    id: "proj-04",
    slug: "whatsapp-automation",
    number: "04",
    title: "WhatsApp Automation",
    category: "Python / Automation",
    tag: "Multi-Agent Orchestration",
    description:
      "[Event-driven architecture routing parallel communications and multi-step agent dispatch with resilient state logs]",
    preferredSide: "right",
  },
];

export default function ProjectUniverse() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const axisNodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const axisLineRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Smooth scroll inertia tracking
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  // 1. Dynamic Canvas Stardust Particles Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const particleCount = Math.min(70, Math.floor((width * height) / 25000));
    const particles: Particle[] = [];

    const colors = [
      "rgba(210, 240, 255, ", // icy cyan/white
      "rgba(180, 220, 255, ", // soft cosmic blue
      "rgba(255, 235, 210, ", // warm stellar stardust
      "rgba(255, 255, 255, ", // white pinprick
    ];

    for (let i = 0; i < particleCount; i++) {
      const isWarm = Math.random() < 0.25;
      const color = isWarm ? colors[2] : colors[Math.floor(Math.random() * colors.length)];
      const baseAlpha = 0.12 + Math.random() * 0.45;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.6 + Math.random() * 1.1,
        alpha: baseAlpha,
        baseAlpha,
        speedY: (Math.random() - 0.5) * 0.08,
        speedX: (Math.random() - 0.5) * 0.05,
        twinkleSpeed: 0.007 + Math.random() * 0.015,
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
          p.baseAlpha + Math.sin(p.twinklePhase) * (p.baseAlpha * 0.5);

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

  // 2. Continuous Scroll Tracker & Damped Inertia Physics Loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      // Progress goes 0.0 -> 1.0 throughout the container's scroll range
      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
      targetProgressRef.current = progress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    let animationFrameId: number;
    let lastActiveIdx = -1;

    const updatePhysics = () => {
      // Damped smooth inertia
      const diff = targetProgressRef.current - currentProgressRef.current;
      currentProgressRef.current += diff * 0.085;

      const p = currentProgressRef.current;
      const s = p * (PROJECTS.length - 1); // 0.0 to 3.0
      const currentActive = Math.round(s);

      if (currentActive !== lastActiveIdx) {
        lastActiveIdx = currentActive;
        setActiveProjectIndex(currentActive);
      }

      const viewportWidth = window.innerWidth;
      const isMobile = viewportWidth < 768;
      const radiusX = isMobile ? viewportWidth * 0.22 : Math.min(380, viewportWidth * 0.28);

      // Transform each project portal along the 3D spiral curve
      PROJECTS.forEach((proj, idx) => {
        const delta = idx - s; // Distance from current focus plane
        const el = cardRefs.current[idx];
        const nodeEl = axisNodeRefs.current[idx];
        const lineEl = axisLineRefs.current[idx];
        if (!el) return;

        // Spiral angle: alternates sides of the vertical beam with continuous curvature
        const sideSign = proj.preferredSide === "left" ? -1 : 1;
        const spiralAngle = delta * 1.35 + sideSign * 0.45;

        // X Coordinate: sinusoidal orbit around central beam
        const x = Math.sin(spiralAngle) * radiusX + (sideSign * (isMobile ? 18 : 36));

        // Y Coordinate: traveling vertically along the current
        const y = delta * (isMobile ? 190 : 250);

        // Z Depth: parabolic falloff into the galaxy
        const z = -Math.abs(delta) * 160 - (delta > 0 ? delta * 140 : 0);

        // Scale: closer in focus, smaller in deep space
        const scale = Math.max(0.6, 1 / (1 + Math.abs(delta) * 0.28));

        // 3D Perspective Rotation along orbit tangent
        const rotY = Math.cos(spiralAngle) * (sideSign * 8) - delta * 4;

        // Opacity: focused portal is bright, distant portals fade smoothly into nebula
        const absDelta = Math.abs(delta);
        const opacity = Math.max(0, Math.min(1, 1 - absDelta * 0.42));

        // Apply GPU transform directly to avoid React state re-render latency
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) scale(${scale.toFixed(3)}) rotateY(${rotY.toFixed(1)}deg)`;
        el.style.opacity = opacity.toFixed(3);
        el.style.filter = absDelta > 1.2 ? `blur(${Math.min(4, (absDelta - 1.2) * 2.5).toFixed(1)}px)` : "none";
        el.style.pointerEvents = absDelta < 0.65 ? "auto" : "none";
        el.style.zIndex = `${Math.round(50 - absDelta * 10)}`;

        // Update central axis orbital node position and connector line
        if (nodeEl) {
          nodeEl.style.transform = `translateY(${y.toFixed(1)}px)`;
          nodeEl.style.opacity = Math.max(0.15, 1 - absDelta * 0.5).toFixed(3);
          nodeEl.style.zIndex = `${Math.round(51 - absDelta * 10)}`;
        }

        if (lineEl) {
          lineEl.style.transform = `translateY(${y.toFixed(1)}px)`;
          lineEl.style.opacity = Math.max(0, 0.7 - absDelta * 0.5).toFixed(3);
          lineEl.style.zIndex = `${Math.round(49 - absDelta * 10)}`;
        }
      });

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      id="project-universe"
      ref={containerRef}
      className="relative w-full h-[360vh] bg-[#020306] text-[#f2f4f8] select-none"
    >
      {/* STICKY VIEWPORT CONTAINER: Locks screen while user scrolls through the spiral track */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-8 sm:py-10 px-6 sm:px-12 md:px-16 lg:px-24">
        {/* 1. GALAXY SPIRAL ENVIRONMENT & CENTRAL COSMIC AXIS */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
          {/* Galaxy spiral background asset */}
          <div className="absolute inset-0 opacity-50 mix-blend-screen">
            <Image
              src="/images/cosmic-spiral.jpg"
              alt="Galaxy spiral streams around vertical axis"
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover object-center scale-105"
            />
          </div>

          {/* Seamless blend gradient masks: top fades from Who Is Megha, bottom fades into cosmos */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020306] via-transparent to-[#020306] opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(4,10,24,0.35)_0%,#020306_80%)]" />

          {/* Dynamic canvas stardust particles matching Hero/Section density */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* FIXED CENTRAL VERTICAL COSMIC AXIS SPINE */}
          {/* Unwavering central anchor connecting Hero, Who Is Megha & Project Universe */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 pointer-events-none z-0">
            {/* Core Hairline Beam */}
            <div className="w-[1px] h-full bg-gradient-to-b from-cyan-300/60 via-cyan-200/40 to-cyan-300/60" />
            {/* Focused Inner Glow */}
            <div className="absolute inset-0 -left-[1.5px] w-[4px] blur-[3px] bg-gradient-to-b from-cyan-400/45 via-cyan-300/25 to-cyan-400/40" />
            {/* Deep Diffuse Halo */}
            <div className="absolute inset-0 -left-[20px] w-[40px] blur-[22px] bg-gradient-to-b from-cyan-500/20 via-blue-500/10 to-cyan-500/18" />
          </div>
        </div>

        {/* 2. SECTION HEADER & EDITORIAL TITLE */}
        <header className="relative z-30 w-full max-w-7xl mx-auto flex flex-col pointer-events-none">
          {/* Indexer & Category */}
          <div className="flex items-center justify-between font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-white/40 pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-cyan-400/90 font-mono font-medium">02</span>
              <span className="text-white/20">/</span>
              <span>PROJECT UNIVERSE</span>
            </div>
            <div className="flex items-center gap-2 text-white/30 tracking-[0.25em]">
              <span>ACTIVE CURRENT</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/70 animate-pulse" />
            </div>
          </div>

          {/* Large Architectural Heading — Matching Hero Font Weight & Proportions */}
          <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h2
              style={{ fontWeight: 100 }}
              className="font-display uppercase text-[clamp(2.8rem,6vw,5.2rem)] leading-[0.9] tracking-[0.16em] sm:tracking-[0.2em] text-white/95"
            >
              Project Universe
            </h2>
            <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.28em] text-white/40 uppercase font-light">
              Spiral Orbit &bull; 04 Worlds in Motion
            </p>
          </div>
        </header>

        {/* 3. 3D SPATIAL STAGE: PORTALS TRAVELLING ALONG THE SPIRAL CURRENT */}
        <div
          style={{
            perspective: "1200px",
            perspectiveOrigin: "50% 50%",
          }}
          className="relative z-20 flex-1 w-full max-w-5xl mx-auto flex items-center justify-center pointer-events-none"
        >
          {/* Center Vertical Axis Connector Line Layer */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {PROJECTS.map((proj, idx) => {
              const isLeft = proj.preferredSide === "left";
              return (
                <div key={`axis-${proj.id}`}>
                  {/* Axis Orbital Node Dot */}
                  <div
                    ref={(el) => {
                      axisNodeRefs.current[idx] = el;
                    }}
                    className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#22d3ee] border border-cyan-400 transition-opacity duration-300 pointer-events-none"
                  />

                  {/* Horizontal Hairline Tick Connecting Axis to Portal */}
                  <div
                    ref={(el) => {
                      axisLineRefs.current[idx] = el;
                    }}
                    className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-[1px] ${
                      isLeft
                        ? "right-1/2 w-28 lg:w-36 bg-gradient-to-l from-cyan-400/40 via-cyan-400/10 to-transparent"
                        : "left-1/2 w-28 lg:w-36 bg-gradient-to-r from-cyan-400/40 via-cyan-400/10 to-transparent"
                    } pointer-events-none`}
                  />
                </div>
              );
            })}
          </div>

          {/* 4 Portals Distributed Along the Spiral Current */}
          {PROJECTS.map((proj, idx) => {
            const isFocused = activeProjectIndex === idx;

            return (
              <div
                key={proj.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity, filter",
                }}
                className="absolute w-[86%] sm:w-[420px] md:w-[460px] max-w-lg transition-all duration-300"
              >
                <Link
                  href={`/project/${proj.slug}`}
                  className={`group block relative rounded-xs border backdrop-blur-md p-6 sm:p-8 md:p-9 transition-all duration-500 overflow-hidden cursor-pointer ${
                    isFocused
                      ? "border-cyan-400/45 bg-[#07132a]/70 shadow-[0_20px_45px_rgba(0,0,0,0.7)]"
                      : "border-white/12 bg-[#050b18]/45 hover:border-cyan-400/35 hover:bg-[#07132a]/60"
                  }`}
                >
                  {/* Corner Crosshairs */}
                  <span className="absolute top-2.5 left-2.5 font-mono text-[9px] text-white/25 group-hover:text-cyan-400/60 transition-colors">
                    +
                  </span>
                  <span className="absolute top-2.5 right-2.5 font-mono text-[9px] text-white/25 group-hover:text-cyan-400/60 transition-colors">
                    +
                  </span>
                  <span className="absolute bottom-2.5 left-2.5 font-mono text-[9px] text-white/25 group-hover:text-cyan-400/60 transition-colors">
                    +
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 font-mono text-[9px] text-white/25 group-hover:text-cyan-400/60 transition-colors">
                    +
                  </span>

                  {/* Ambient top edge specular sheen */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-cyan-300/50 transition-colors duration-500" />

                  {/* Portal Header: Project Number & Category */}
                  <div className="flex items-center justify-between font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.26em] text-white/45 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-medium">
                        {proj.number}
                      </span>
                      <span className="text-white/20">/</span>
                      <span className="text-white/60">{proj.category}</span>
                    </div>

                    <span
                      className={`text-[8px] tracking-[0.2em] px-2 py-0.5 rounded-2xs border transition-colors ${
                        isFocused
                          ? "text-cyan-300 border-cyan-400/40 bg-cyan-950/20"
                          : "text-white/30 border-white/10"
                      }`}
                    >
                      {proj.tag}
                    </span>
                  </div>

                  {/* Project Title — Tall Architectural Typography */}
                  <div className="mb-3">
                    <h3
                      style={{ fontWeight: 150 }}
                      className={`font-display uppercase text-2xl sm:text-3xl md:text-[2.65rem] leading-[0.94] tracking-[0.08em] transition-colors duration-500 ${
                        isFocused
                          ? "text-cyan-100"
                          : "text-white/90 group-hover:text-cyan-200"
                      }`}
                    >
                      {proj.title}
                    </h3>
                  </div>

                  {/* Short Evocative Description */}
                  <p className="text-xs sm:text-[13px] leading-relaxed text-white/45 font-light tracking-wide mb-6 border-t border-white/5 pt-3">
                    {proj.description}
                  </p>

                  {/* Action Footer */}
                  <div className="flex items-center justify-between font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.24em] text-white/35 group-hover:text-cyan-300 transition-colors pt-3 border-t border-white/10">
                    <span>Explore World</span>
                    <span className="inline-block transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                      &rarr;
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* 4. FOOTER STATUS BAR & SPIRAL ORBIT PROGRESS TRACKER */}
        <footer className="relative z-30 w-full max-w-7xl mx-auto flex items-center justify-between pt-4 border-t border-white/10 font-mono text-[9px] sm:text-[10px] tracking-[0.26em] uppercase text-white/40 pointer-events-none">
          {/* Active World Indicator */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            <span>
              World 0{activeProjectIndex + 1} / 04 &bull;{" "}
              <span className="text-white/70">
                {PROJECTS[activeProjectIndex]?.title}
              </span>
            </span>
          </div>

          {/* Spiral Orbit Progress Nodes */}
          <div className="flex items-center gap-3 pointer-events-auto">
            {PROJECTS.map((p, idx) => (
              <div
                key={`dot-${p.id}`}
                className={`transition-all duration-500 ${
                  activeProjectIndex === idx
                    ? "w-5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                    : "w-1.5 h-1.5 rounded-full bg-white/25 hover:bg-white/50"
                }`}
                title={p.title}
              />
            ))}
          </div>

          <div className="hidden sm:block text-right text-white/30">
            Scroll to Navigate Current
          </div>
        </footer>
      </div>
    </section>
  );
}
