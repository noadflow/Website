"use client";

import { Check, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/theme-store";
import { PageHero } from "@/components/site/page-hero";
import { FadeIn } from "@/components/site/fade-in";
import { CTASection } from "@/components/site/cta-section";
import { GeometricShapes } from "@/components/svg/geometric-shapes";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Starter Build",
    cadence: "One-time project",
    desc: "A single custom AI agent, built and deployed for your business. Ideal for solving one specific bottleneck.",
    features: ["Custom agent build", "Setup & deployment", "2 weeks of support after launch"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Growth Retainer",
    cadence: "Monthly",
    desc: "Your agent, fully managed and maintained — plus ongoing improvements as your business changes.",
    features: ["Everything in Starter", "Hosting & maintenance", "Monthly check-ins & updates"],
    cta: "Book a Call",
    popular: true,
  },
  {
    name: "Custom",
    cadence: "Let's talk",
    desc: "Multiple agents, complex integrations, or a full automation overhaul. Built around exactly what you need.",
    features: ["Tailored scope", "Direct collaboration", "Flexible terms"],
    cta: "Contact us",
    popular: false,
  },
];

export function PricingPage() {
  const setPage = useAppStore((s) => s.setPage);

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        headline="Simple, honest pricing."
        subtitle="Pick what fits — or let's figure it out together on a call."
      />

      {/* Geometric shapes band */}
      <section className="relative px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="relative h-[180px] w-full overflow-hidden rounded-3xl border border-border bg-card/40 sm:h-[220px]">
              <GeometricShapes className="h-full w-full" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="relative px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
            {PLANS.map((p, i) => (
              <FadeIn key={p.name} delay={i * 0.1}>
                <div
                  className={cn(
                    "relative flex h-full flex-col rounded-3xl border p-8 transition-all duration-500",
                    p.popular
                      ? "border-foreground/40 bg-card shadow-[0_24px_80px_-32px_rgba(0,0,0,0.4)] lg:-translate-y-3"
                      : "border-border bg-card hover:-translate-y-1 hover:border-foreground/30",
                  )}
                >
                  {p.popular && (
                    <div className="absolute -top-3 left-8 inline-flex items-center rounded-full bg-foreground px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-background">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-semibold tracking-tight">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {p.cadence}
                  </p>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {p.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-sm text-foreground/90"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setPage("contact")}
                    className={cn(
                      "mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-opacity hover:opacity-90",
                      p.popular
                        ? "bg-foreground text-background"
                        : "border border-border text-foreground hover:bg-secondary",
                    )}
                  >
                    {p.cta} <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Let us build it for you."
        subtitle="Most people start with a quick call — no pressure, just a conversation about what's possible."
        buttonLabel="Book a Free Call"
      />
    </>
  );
}
