"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * ParticleNetwork — a subtle constellation-style background.
 *
 * White dots drift slowly across the canvas. When two dots get
 * close to each other, a faint line connects them (opacity fades
 * with distance). Each dot also "blinks" on its own random cycle
 * (opacity oscillates with a per-particle phase + period) so the
 * field feels alive without being distracting.
 *
 * Designed as a drop-in backdrop for the CTA card. Uses canvas
 * for performance (many particles), respects prefers-reduced-motion,
 * and cleans up its RAF + resize listeners on unmount.
 *
 * Colors use CSS-variable-aware foreground so it adapts to the
 * active theme (bright in dark theme, dimmer in light theme).
 */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseR: number; // base radius
  // Blink cycle — per-particle so they don't all pulse in sync.
  blinkPhase: number; // 0..2π
  blinkSpeed: number; // radians per second
}

interface ParticleNetworkProps {
  className?: string;
  /** Target particle density (particles per 10,000 px²). Default ~0.6. */
  density?: number;
  /** Max distance (px) at which two particles get a connecting line. */
  linkDistance?: number;
}

export function ParticleNetwork({
  className,
  density = 1.5,
  linkDistance = 130,
}: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  // Holds the latest DPR + size between effect re-runs.
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // ---- Resolve foreground color from the --fg CSS variable.
    //      Re-read on each frame so theme toggles take effect
    //      immediately. Handles hex (#rgb / #rrggbb), rgb()/rgba(),
    //      and space- or comma-separated channel triples.
    const readFg = (): string => {
      const raw = getComputedStyle(canvas)
        .getPropertyValue("--fg")
        .trim();
      if (!raw) return "255, 255, 255";

      // #rrggbb or #rgb
      const hexMatch = raw.match(
        /^#([0-9a-f]{3}|[0-9a-f]{6})$/i,
      );
      if (hexMatch) {
        let h = hexMatch[1];
        if (h.length === 3) {
          h = h
            .split("")
            .map((c) => c + c)
            .join("");
        }
        const r = parseInt(h.slice(0, 2), 16);
        const g = parseInt(h.slice(2, 4), 16);
        const b = parseInt(h.slice(4, 6), 16);
        return `${r}, ${g}, ${b}`;
      }

      // rgb(r, g, b) / rgba(r, g, b, a)
      const rgbMatch = raw.match(
        /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i,
      );
      if (rgbMatch) {
        return `${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}`;
      }

      // "r g b" or "r, g, b" channel triple
      const tripleMatch = raw.match(
        /^([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)$/,
      );
      if (tripleMatch) {
        return `${tripleMatch[1]}, ${tripleMatch[2]}, ${tripleMatch[3]}`;
      }

      return "255, 255, 255";
    };

    // ---- Build / rebuild particle field on resize.
    let particles: Particle[] = [];
    const buildField = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      sizeRef.current = { w, h, dpr };

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Particle count scales with area but stays modest.
      const count = Math.min(
        240,
        Math.max(60, Math.floor((w * h) / 10000) * density),
      );

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18, // slow drift
        vy: (Math.random() - 0.5) * 0.18,
        baseR: 1.1 + Math.random() * 1.5,
        blinkPhase: Math.random() * Math.PI * 2,
        blinkSpeed: 0.6 + Math.random() * 1.6, // each dot blinks at its own pace
      }));
    };

    buildField();
    const ro = new ResizeObserver(buildField);
    ro.observe(canvas);

    // ---- Animation loop.
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); // clamp for tab-switch jumps
      last = now;
      const { w, h } = sizeRef.current;
      const fg = readFg();

      ctx.clearRect(0, 0, w, h);

      // ---- Update + draw particles.
      for (const p of particles) {
        if (!reduced) {
          p.x += p.vx * dt * 60;
          p.y += p.vy * dt * 60;
          // Wrap around edges so the field never empties out.
          if (p.x < -10) p.x = w + 10;
          else if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          else if (p.y > h + 10) p.y = -10;
          p.blinkPhase += p.blinkSpeed * dt;
        }

        // Blink = sinusoidal opacity around a baseline so dots
        // never fully disappear — they "twinkle".
        const blink =
          0.55 + 0.45 * Math.sin(p.blinkPhase); // 0.10..1.0 range

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.baseR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${fg}, ${blink.toFixed(3)})`;
        ctx.fill();
      }

      // ---- Draw connection lines (faint, fade with distance).
      //      O(n²) is fine here because count is capped (~140) and
      //      we short-circuit on dx/dy bounds.
      const linkD2 = linkDistance * linkDistance;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          if (dx > linkDistance || dx < -linkDistance) continue;
          const dy = a.y - b.y;
          if (dy > linkDistance || dy < -linkDistance) continue;
          const d2 = dx * dx + dy * dy;
          if (d2 > linkD2) continue;

          // Line opacity fades from ~0.22 (touching) to 0 (at linkDistance).
          // Modulated by the dimmer of the two endpoints' blink values
          // so a twinkle on one end softens the line too.
          const dist = Math.sqrt(d2);
          const lineAlpha =
            (1 - dist / linkDistance) * 0.22 *
            (0.6 + 0.4 * Math.min(
              Math.sin(a.blinkPhase),
              Math.sin(b.blinkPhase),
            ));
          if (lineAlpha < 0.01) continue;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${fg}, ${lineAlpha.toFixed(3)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    // ---- Cleanup.
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [density, linkDistance]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("block h-full w-full", className)}
      aria-hidden="true"
    />
  );
}
