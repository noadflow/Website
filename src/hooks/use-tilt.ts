"use client";

import { useEffect, useRef } from "react";
import { useMouseParallax } from "@/hooks/use-mouse-parallax";

// ============================================================
// useTilt — a stable, non-glitchy mouse/touch tilt for SVGs.
// Returns { ref, tiltRef }. Attach `ref` to the wrapper div and
// `tiltRef` to the inner <g> you want to tilt. The rAF loop runs
// ONCE (empty deps) and reads the latest pointer from a ref that's
// updated by a separate lightweight effect — so the loop is never
// torn down/recreated on mouse move (no glitching).
//
// Usage:
//   const { ref, tiltRef } = useTilt<SVGGElement>(cx, cy)
//   <div ref={ref}><svg><g ref={tiltRef}>...</g></svg></div>
// ============================================================

interface TiltResult<T extends SVGGraphicsElement> {
  ref: React.RefObject<HTMLDivElement | null>;
  tiltRef: React.RefObject<T | null>;
}

export function useTilt<T extends SVGGraphicsElement = SVGGElement>(
  cx: number,
  cy: number,
  maxRot = 6,
  maxTrans = 10,
): TiltResult<T> {
  const { ref, x, y } = useMouseParallax<HTMLDivElement>();
  const tiltRef = useRef<T>(null);
  const target = useRef({ x: 0, y: 0 });

  // Lightweight effect: just mirror the latest pointer into the ref.
  // Runs on every x/y change but does no heavy work (no rAF teardown).
  useEffect(() => {
    target.current.x = x;
    target.current.y = y;
  }, [x, y]);

  // One long-running rAF loop (empty deps). Eases toward the target
  // each frame and writes the tilt transform directly to the DOM.
  useEffect(() => {
    const tilt = tiltRef.current;
    if (!tilt) return;
    let raf = 0;
    let curX = 0;
    let curY = 0;
    const apply = () => {
      const tx = target.current.x;
      const ty = target.current.y;
      curX += (tx - curX) * 0.08;
      curY += (ty - curY) * 0.08;
      const rot = curX * maxRot;
      const dx = curX * maxTrans;
      const dy = curY * maxTrans;
      tilt.setAttribute(
        "transform",
        `translate(${dx.toFixed(2)} ${dy.toFixed(2)}) rotate(${rot.toFixed(2)} ${cx} ${cy})`,
      );
      raf = requestAnimationFrame(apply);
    };
    raf = requestAnimationFrame(apply);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [cx, cy, maxRot, maxTrans]);

  return { ref, tiltRef };
}
