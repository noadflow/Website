"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypingTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  showCaret?: boolean;
}

/**
 * Types out `text` letter by letter when mounted.
 * Re-mounts on page change (via the keyed wrapper in page.tsx) so it
 * re-types every time.
 */
export function TypingText({
  text,
  speed = 42,
  delay = 250,
  className,
  showCaret = true,
}: TypingTextProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let stepTimer: ReturnType<typeof setTimeout>;
    let i = 0;

    const tick = () => {
      if (cancelled) return;
      i += 1;
      setCount(i);
      if (i < text.length) {
        stepTimer = setTimeout(tick, speed);
      }
    };

    const startTimer = setTimeout(tick, delay);

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
      clearTimeout(stepTimer);
    };
  }, [text, speed, delay]);

  const done = count >= text.length;

  return (
    <span className={cn("inline-block", className)}>
      {text.slice(0, count)}
      {showCaret && !done && <span className="typing-caret" aria-hidden="true" />}
    </span>
  );
}
