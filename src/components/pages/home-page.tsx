"use client";

import { ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/theme-store";
import { FadeIn } from "@/components/site/fade-in";
import { TypingText } from "@/components/site/typing-text";
import { SectionHeading } from "@/components/site/section-heading";
import { CTASection } from "@/components/site/cta-section";
import { NeuralNetwork } from "@/components/svg/neural-network";
import { LeadNetworkMap } from "@/components/svg/lead-network-map";
import { ChatBubbles } from "@/components/svg/chat-bubbles";
import { InterlockingGears } from "@/components/svg/interlocking-gears";

const SERVICES = [
  {
    title: "Lead Generation Agents",
    desc: "Finds and researches prospects, then writes personalized outreach automatically.",
    Svg: LeadNetworkMap,
  },
  {
    title: "Customer Support Agents",
    desc: "Answers customer questions 24/7 using your business's own knowledge.",
    Svg: ChatBubbles,
  },
  {
    title: "Workflow Automation",
    desc: "Connects your tools so they work together without manual effort.",
    Svg: InterlockingGears,
  },
];

export function HomePage() {
  const setPage = useAppStore((s) => s.setPage);

  return (
    <>
      {/* HERO */}
      <section className="relative px-4 pb-12 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <FadeIn>
              <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-border px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                <span
                  className="nf-pulse-soft h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--fg)" }}
                />
                AI Automation Agency
              </div>
            </FadeIn>
            <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <TypingText text="Automation that thinks for itself." delay={300} />
            </h1>
            <FadeIn delay={0.5}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                We build AI agents that handle the busywork — so you can focus on
                growing your business.
              </p>
            </FadeIn>
            <FadeIn delay={0.65}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setPage("contact")}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
                >
                  Book a Free Call <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage("portfolio")}
                  className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  See Our Work
                </button>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.3} className="relative">
            <div className="relative mx-auto aspect-square w-full max-w-[640px]">
              <NeuralNetwork className="h-full w-full" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="relative px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="What We Do"
            title="Not just automation. Intelligence."
            subtitle="Most automation tools follow fixed steps. Our AI agents think through each situation and decide what to do — finding leads, answering customers, and managing your busywork around the clock."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {SERVICES.map((s, i) => (
              <FadeIn key={s.title} delay={i * 0.12}>
                <button
                  onClick={() => setPage("services")}
                  className="group flex h-full w-full flex-col rounded-3xl border border-border bg-card p-6 text-left transition-all duration-500 hover:-translate-y-1 hover:border-foreground/30"
                >
                  <div className="mb-6 h-40 w-full">
                    <s.Svg className="h-full w-full" />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 transition-colors group-hover:text-foreground">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </button>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Let's build something that works while you sleep."
        buttonLabel="Book a Free 30-Minute Call"
      />
    </>
  );
}
