"use client";

import { useEffect, useState } from "react";
import CosmicBackground from "@/components/CosmicBackground";
import HeroTypography from "@/components/HeroTypography";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Stage supporting text to fade in elegantly after letters begin settling
    const timer = setTimeout(() => {
      setMounted(true);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#020306] text-[#f2f4f8] flex flex-col justify-between select-none">
      {/* Cinematic Cosmic Environment & Vertical Energy Axis */}
      <CosmicBackground />

      {/* Top Editorial Status Bar (fades in gracefully after letters settle) */}
      <header
        style={{
          transition: "opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1)",
          opacity: mounted ? 1 : 0,
        }}
        className="relative z-20 w-full px-6 sm:px-10 md:px-14 pt-7 sm:pt-9 md:pt-11 flex items-center justify-between pointer-events-none"
      >
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ff3333] shadow-[0_0_8px_#ff3333]" />
          <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.28em] text-white/50 uppercase font-light">
            Shipping Ideas Into Reality
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4 font-mono text-[9px] sm:text-[10px] tracking-[0.3em] text-white/35 uppercase font-light">
          <span>Portfolio / 2026</span>
        </div>
      </header>

      {/* Main Hero Viewport — Centered MEGHA */}
      <section className="relative z-10 w-full flex-1 flex items-center justify-center px-4 sm:px-8">
        <HeroTypography />
      </section>

      {/* Bottom Editorial Information Bar (fades in gracefully after letters settle) */}
      <footer
        style={{
          transition: "opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1)",
          opacity: mounted ? 1 : 0,
        }}
        className="relative z-20 w-full px-6 sm:px-10 md:px-14 pb-7 sm:pb-9 md:pb-11 flex items-end justify-between pointer-events-none"
      >
        {/* Bottom Left: Role Description */}
        <div className="text-left">
          <p className="font-mono text-[9px] sm:text-[10px] uppercase leading-relaxed tracking-[0.26em] text-white/50 font-light">
            Creative Technologist
          </p>
        </div>

        {/* Bottom Center: Scroll Indicator Aligned with the Cosmic Axis */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-7 sm:bottom-9 md:bottom-11 flex flex-col items-center gap-2.5">
          <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.38em] text-white/40 font-light">
            Scroll
          </span>
          <div className="w-[1px] h-8 sm:h-10 bg-white/15 relative overflow-hidden">
            <div className="w-full h-full bg-cyan-300/80 scroll-line-tick" />
          </div>
        </div>

        {/* Bottom Right: Discipline Description */}
        <div className="text-right">
          <p className="font-mono text-[9px] sm:text-[10px] uppercase leading-relaxed tracking-[0.26em] text-white/50 font-light">
            Developer / Designer
          </p>
        </div>
      </footer>
    </main>
  );
}