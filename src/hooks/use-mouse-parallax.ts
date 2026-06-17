"use client";

import { useEffect, useRef, useState } from "react";

interface ParallaxResult<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  x: number;
  y: number;
  active: boolean;
}

/**
 * Tracks the mouse position relative to an element and returns normalized
 * offsets in the range -0.5 .. 0.5 from the element's center.
 *
 * Usage:
 *   const { ref, x, y } = useMouseParallax<HTMLDivElement>()
 *   <div ref={ref}><svg>... apply transforms using x, y ...</svg></div>
 */
export function useMouseParallax<T extends HTMLElement = HTMLDivElement>(): ParallaxResult<T> {
  const ref = useRef<T>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let latest = { x: 0, y: 0 };

    const update = () => {
      raf = 0;
      setPos(latest);
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      latest = {
        x: Math.max(-0.5, Math.min(0.5, (e.clientX - cx) / rect.width)),
        y: Math.max(-0.5, Math.min(0.5, (e.clientY - cy) / rect.height)),
      };
      if (!raf) raf = requestAnimationFrame(update);
    };

    const onEnter = () => setActive(true);
    const onLeave = () => {
      setActive(false);
      latest = { x: 0, y: 0 };
      if (!raf) raf = requestAnimationFrame(update);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return { ref, x: pos.x, y: pos.y, active };
}
