"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FadeIn } from "./fade-in";
import { TypingText } from "./typing-text";

interface PageHeroProps {
  eyebrow?: string;
  headline: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHero({
  eyebrow,
  headline,
  subtitle,
  children,
  className,
}: PageHeroProps) {
  return (
    <section className={cn("relative px-4 pb-8 pt-10 sm:px-6 sm:pt-16", className)}>
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          {eyebrow && (
            <div className="mb-5 inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              <span className="h-px w-7 bg-current opacity-40" />
              {eyebrow}
            </div>
          )}
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <TypingText text={headline} />
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          )}
          {children}
        </FadeIn>
      </div>
    </section>
  );
}
