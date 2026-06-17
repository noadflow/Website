"use client";

import { useEffect, useState } from "react";

/**
 * Subtle fixed background: a faint grid + soft floating orbs that drift
 * on scroll at different speeds for parallax depth.
 */
export function ParallaxBackground() {
  const [y, setY] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Grid layer (slowest) */}
      <div
        className="bg-grid absolute -inset-[10%] opacity-[0.35]"
        style={{ transform: `translate3d(0, ${y * 0.12}px, 0)` }}
      />

      {/* Floating orbs (parallax + idle float via nested elements) */}
      <div
        className="absolute -left-24 -top-24"
        style={{ transform: `translate3d(0, ${y * 0.08}px, 0)` }}
      >
        <div
          className="nf-float-slow h-[420px] w-[420px] rounded-full opacity-[0.20] blur-3xl"
          style={{ background: "var(--svg-fill)" }}
        />
      </div>

      <div
        className="absolute -right-40 top-1/4"
        style={{ transform: `translate3d(0, ${y * -0.05}px, 0)` }}
      >
        <div
          className="nf-float h-[520px] w-[520px] rounded-full opacity-[0.14] blur-3xl"
          style={{ background: "var(--svg-glow)" }}
        />
      </div>

      <div
        className="absolute bottom-0 left-1/3"
        style={{ transform: `translate3d(0, ${y * 0.14}px, 0)` }}
      >
        <div
          className="nf-float-slow h-[360px] w-[360px] rounded-full opacity-[0.12] blur-3xl"
          style={{ background: "var(--svg-fill)" }}
        />
      </div>
    </div>
  );
}
