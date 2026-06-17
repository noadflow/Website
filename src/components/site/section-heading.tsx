"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FadeIn } from "./fade-in";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  center?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center,
  className,
}: SectionHeadingProps) {
  return (
    <FadeIn
      className={cn("max-w-2xl", center && "mx-auto text-center", className)}
    >
      {eyebrow && (
        <div
          className={cn(
            "mb-4 inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground",
            center && "justify-center",
          )}
        >
          <span className="h-px w-7 bg-current opacity-40" />
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {subtitle}
        </p>
      )}
    </FadeIn>
  );
}
