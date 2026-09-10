"use client";

import { useEffect, useRef, useState } from "react";

interface LetterPhysics {
  intensity: number;   // Current continuous influence [0..1]
  velocity: number;    // Spring velocity for buttery smooth interpolation
}

interface SlotGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
}

const LETTERS = ["M", "E", "G", "H", "A"];

// Calibrated slot widths tailored to individual letter glyph proportions:
// - M is widest: ~160px
// - E is compact/narrow: ~112px
// - G is medium-wide: ~142px
// - H is medium: ~132px
// - A is medium-wide: ~142px
//
// Results in a uniform visual gap of ~25px between letter stems at rest.
// MEGHA reads cohesively as ONE continuous word while guaranteeing that
// when any letter expands horizontally (scaleX: 1.38x), it never collides
// or overlaps unnaturally with neighboring letters.
const SLOT_CLASSES = [
  "w-[clamp(78px,11.8vw,162px)]", // M
  "w-[clamp(56px,8.5vw,112px)]",  // E
  "w-[clamp(72px,10.5vw,142px)]", // G
  "w-[clamp(66px,9.8vw,132px)]",  // H
  "w-[clamp(72px,10.5vw,142px)]", // A
];

export default function HeroTypography() {
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mainRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const nearDepthRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const farDepthRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const mouseRef = useRef({ x: -9999, y: -9999, active: false, isTouch: false });
  const slotGeometriesRef = useRef<SlotGeometry[]>([]);
  const avgSpacingRef = useRef<number>(135);
  const isEnteringRef = useRef(true);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Staggered entrance sequence
    const entranceTimer = setTimeout(() => {
      isEnteringRef.current = false;
      setEntered(true);
    }, 700);

    // Measure fixed slot container positions
    // The slot wrapper divs NEVER transform, guaranteeing 100% stable anchors
    const updateSlots = () => {
      const geometries: SlotGeometry[] = [];
      for (let i = 0; i < LETTERS.length; i++) {
        const el = slotRefs.current[i];
        if (!el) {
          geometries.push({ x: 0, y: 0, width: 0, height: 0 });
          continue;
        }
        const rect = el.getBoundingClientRect();
        geometries.push({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height,
        });
      }
      slotGeometriesRef.current = geometries;

      if (geometries.length >= 5 && geometries[0].width > 0 && geometries[4].width > 0) {
        // Center-to-center spacing between adjacent letters
        avgSpacingRef.current = Math.max(60, (geometries[4].x - geometries[0].x) / 4);
      }
    };

    updateSlots();
    window.addEventListener("resize", updateSlots, { passive: true });

    // Remeasure once web fonts are fully rendered to avoid initial layout shifts
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(updateSlots);
    }

    // Pointer event listeners
    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
      mouseRef.current.isTouch = e.pointerType === "touch";
      if (slotGeometriesRef.current.length === 0 || slotGeometriesRef.current[0].width === 0) {
        updateSlots();
      }
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
        mouseRef.current.active = true;
        mouseRef.current.isTouch = true;
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    window.addEventListener("mouseleave", handlePointerLeave, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    // Symmetric physics state for ALL five letters (M, E, G, H, A)
    const states: LetterPhysics[] = LETTERS.map(() => ({
      intensity: 0,
      velocity: 0,
    }));

    // Critically damped spring physics: fast, fluid, buttery smooth
    const stiffness = 0.17;
    const damping = 0.78;
    let animationFrameId: number;

    const loop = (timestamp: number) => {
      if (isEnteringRef.current || prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(loop);
        return;
      }

      const mouse = mouseRef.current;
      const slots = slotGeometriesRef.current;
      const spacing = avgSpacingRef.current;

      // Vertical threshold: typography height is ~240-340px, threshold is ~280px
      const verticalThreshold = 280;

      for (let i = 0; i < LETTERS.length; i++) {
        const state = states[i];
        const slot = slots[i];
        if (!slot || slot.width === 0) continue;

        let targetInfluence = 0;

        if (mouse.active) {
          const dx = Math.abs(mouse.x - slot.x);
          const dy = Math.abs(mouse.y - slot.y);

          // Vertical falloff: cosine curve reaching 0 at verticalThreshold
          const vFactor = dy < verticalThreshold
            ? Math.pow(Math.cos((dy / verticalThreshold) * (Math.PI / 2)), 2)
            : 0;

          // Normalized horizontal distance relative to letter spacing S
          const delta = dx / spacing;

          // Continuous wave influence:
          // delta = 0 (closest letter): influence = 1.0 (STRONGEST)
          // delta = 1 (immediate neighbor): influence ~= 0.35 (MEDIUM)
          // delta = 2 (2nd neighbor): influence ~= 0.04 (SUBTLE)
          // delta >= 2.5 (far letters): influence = 0 (THIN)
          let hFactor = 0;
          if (delta < 2.5) {
            hFactor = Math.pow(Math.cos((delta / 2.5) * (Math.PI / 2)), 5);
          }

          targetInfluence = hFactor * vFactor;
        } else if (mouse.isTouch) {
          // Subtle touch ambient wave traveling across letters when idle
          const cycle = ((Math.sin(timestamp * 0.0012) + 1) / 2) * 4; // 0 to 4
          const distFromCycle = Math.abs(i - cycle);
          if (distFromCycle < 1.6) {
            targetInfluence = Math.pow(Math.cos((distFromCycle / 1.6) * (Math.PI / 2)), 3) * 0.28;
          }
        }

        // Spring integration: responsive, fluid, zero lag
        state.velocity = (state.velocity + (targetInfluence - state.intensity) * stiffness) * damping;
        state.intensity += state.velocity;

        // Snap to rest when settled
        if (
          Math.abs(targetInfluence - state.intensity) < 0.0003 &&
          Math.abs(state.velocity) < 0.0003
        ) {
          state.intensity = targetInfluence;
          state.velocity = 0;
        }

        const I = Math.max(0, Math.min(1, state.intensity));

        // 1. DYNAMIC FONT WEIGHT: continuous interpolation from thin 100 to bold 850
        const currentWeight = Math.round(100 + I * 750);

        // 2. EXPANSION: strictly horizontal stretch with subtle vertical breath, anchored to center
        // scaleX: 1.0 -> 1.38 (active letter), scaleY: 1.0 -> 1.04
        const scaleX = 1 + I * 0.38;
        const scaleY = 1 + I * 0.04;

        // 3. PHYSICAL TEXT STROKE: adds genuine physical stroke thickness matching reference
        const strokeWidth = (I * 2.2).toFixed(2);

        // Perspective horizontal drift away from central axis + cursor parallax
        const perspectiveOffset = (i - 2) * 2.5 * I;
        const cursorOffset = mouse.active && slot ? (slot.x - mouse.x) * 0.03 * I : 0;

        // 4. LAYER 3: FAR SHADOW (Letter-shaped copy: translucent, broad blur, casting onto background)
        const farDepthEl = farDepthRefs.current[i];
        if (farDepthEl) {
          const farY = 8 + I * 16;
          const farX = perspectiveOffset * 1.8 + cursorOffset * 1.5;
          farDepthEl.style.transform = `translate3d(${farX.toFixed(1)}px, ${farY.toFixed(1)}px, 0) scale(${(scaleX * 1.05).toFixed(4)}, ${(scaleY * 1.02).toFixed(4)})`;
          farDepthEl.style.opacity = (I * 0.88).toFixed(3);
          farDepthEl.style.filter = `blur(${(12 + I * 22).toFixed(1)}px)`;
          farDepthEl.style.fontWeight = `${currentWeight}`;
          farDepthEl.style.fontVariationSettings = `'wght' ${currentWeight}`;
          farDepthEl.style.webkitTextStroke = I > 0.02 ? `${(I * 2.5).toFixed(1)}px #000000` : "0px";
        }

        // 5. LAYER 2: NEAR SHADOW (Letter-shaped copy: darker silhouette, closer, moderately blurred)
        const nearDepthEl = nearDepthRefs.current[i];
        if (nearDepthEl) {
          const nearY = 3 + I * 6;
          const nearX = perspectiveOffset + cursorOffset;
          nearDepthEl.style.transform = `translate3d(${nearX.toFixed(1)}px, ${nearY.toFixed(1)}px, 0) scale(${(scaleX * 1.018).toFixed(4)}, ${(scaleY * 1.008).toFixed(4)})`;
          nearDepthEl.style.opacity = (I * 0.82).toFixed(3);
          nearDepthEl.style.filter = `blur(${(3.0 + I * 5.0).toFixed(1)}px)`;
          nearDepthEl.style.fontWeight = `${currentWeight}`;
          nearDepthEl.style.fontVariationSettings = `'wght' ${currentWeight}`;
          nearDepthEl.style.webkitTextStroke = I > 0.02 ? `${(I * 1.6).toFixed(1)}px rgba(6, 10, 20, 0.96)` : "0px";
        }

        // 6. LAYER 1: MAIN LETTER FACE (Sharp, bright, thick, strictly anchored baseline & center)
        const mainEl = mainRefs.current[i];
        if (mainEl) {
          mainEl.style.transform = `scale(${scaleX.toFixed(4)}, ${scaleY.toFixed(4)})`;
          mainEl.style.fontWeight = `${currentWeight}`;
          mainEl.style.fontVariationSettings = `'wght' ${currentWeight}`;
          mainEl.style.webkitTextStroke = I > 0.02 ? `${strokeWidth}px rgba(245, 248, 255, 0.98)` : "0px";
          mainEl.style.opacity = (0.80 + I * 0.20).toFixed(3);

          const brightness = 1 + I * 0.24;
          mainEl.style.filter = I > 0.02
            ? `brightness(${brightness.toFixed(2)}) drop-shadow(0 0 ${(6 + I * 10).toFixed(1)}px rgba(215, 235, 255, ${(I * 0.22).toFixed(2)}))`
            : "none";
        }

        // 7. SLOT ELEVATION: active letter floats gracefully over depth shadows
        const slotEl = slotRefs.current[i];
        if (slotEl) {
          slotEl.style.zIndex = I > 0.6 ? "30" : I > 0.2 ? "20" : "10";
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(entranceTimer);
      window.removeEventListener("resize", updateSlots);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-10 flex items-center justify-center select-none cursor-default w-full"
      aria-label="MEGHA"
      role="heading"
      aria-level={1}
    >
      {/*
        Unified typographic composition:
        - Scaled to dominate the viewport using responsive clamp sizing
        - Noticeably reduced letter spacing so the word reads as ONE connected composition
        - Anchors are completely fixed with zero translation or baseline shifting
      */}
      <div className="flex items-center justify-center text-[#f4f7fb] tracking-normal">
        {LETTERS.map((letter, idx) => {
          const entranceDelay = `${120 + idx * 75}ms`;
          const slotClass = SLOT_CLASSES[idx];

          return (
            <div
              key={idx}
              ref={(el) => {
                slotRefs.current[idx] = el;
              }}
              className={`relative ${slotClass} h-[52vh] max-h-[520px] flex items-center justify-center select-none`}
              style={{ zIndex: 10 }}
            >
              {/* LAYER 3: FAR SHADOW (Broad letter-shaped copy casting onto cosmic background) */}
              <span
                ref={(el) => {
                  farDepthRefs.current[idx] = el;
                }}
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center font-display text-[clamp(7.5rem,22vw,19rem)] leading-[0.78] select-none pointer-events-none origin-center text-black"
                style={{ opacity: 0 }}
              >
                {letter}
              </span>

              {/* LAYER 2: NEAR SHADOW (Dark translucent letter-shaped silhouette copy directly behind main face) */}
              <span
                ref={(el) => {
                  nearDepthRefs.current[idx] = el;
                }}
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center font-display text-[clamp(7.5rem,22vw,19rem)] leading-[0.78] select-none pointer-events-none origin-center text-[#080d1a]"
                style={{ opacity: 0 }}
              >
                {letter}
              </span>

              {/* LAYER 1: MAIN LETTER FACE (Sharp, bright, thick, anchored) */}
              <span
                ref={(el) => {
                  mainRefs.current[idx] = el;
                }}
                aria-hidden="true"
                style={{
                  transition: !entered
                    ? `opacity 850ms cubic-bezier(0.16, 1, 0.3, 1) ${entranceDelay}`
                    : "none",
                  opacity: entered ? 0.80 : 0,
                  transform: "scale(1, 1)",
                  transformOrigin: "center center",
                  fontWeight: 100,
                  fontVariationSettings: "'wght' 100",
                }}
                className="relative z-10 inline-block font-display text-[clamp(7.5rem,22vw,19rem)] leading-[0.78] select-none will-change-transform text-center origin-center tracking-normal text-[#f4f7fb]"
              >
                {letter}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
