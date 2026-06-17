"use client";

import type { ReactNode } from "react";
import { StarsMoon } from "@/components/svg/stars-moon";
import { useAppStore } from "@/lib/theme-store";
import { FadeIn } from "./fade-in";

interface CTASectionProps {
  title: ReactNode;
  subtitle?: string;
  buttonLabel?: string;
}

export function CTASection({
  title,
  subtitle,
  buttonLabel = "Book a Free Call",
}: CTASectionProps) {
  const setPage = useAppStore((s) => s.setPage);

  return (
    <section className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-16 sm:px-12 sm:py-20">
            {/* Animated stars + moon backdrop */}
            <div className="pointer-events-none absolute inset-0 opacity-70">
              <StarsMoon className="h-full w-full" />
            </div>

            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                {title}
              </h2>
              {subtitle && (
                <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {subtitle}
                </p>
              )}
              <button
                onClick={() => setPage("contact")}
                className="mt-8 inline-flex items-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                {buttonLabel}
              </button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
