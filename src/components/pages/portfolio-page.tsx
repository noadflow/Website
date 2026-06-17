"use client";

import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { FadeIn } from "@/components/site/fade-in";
import { CTASection } from "@/components/site/cta-section";
import { LeadNetworkMap } from "@/components/svg/lead-network-map";
import { ChatBubbles } from "@/components/svg/chat-bubbles";
import { FlowingLines } from "@/components/svg/flowing-lines";

const PROJECTS = [
  {
    title: "Lead Research Agent",
    desc: "Finds and researches 30+ prospects daily, with personalized outreach drafted for each one.",
    Svg: LeadNetworkMap,
  },
  {
    title: "Customer Support Agent",
    desc: "Answers customer questions instantly using a business's product catalog and policies.",
    Svg: ChatBubbles,
  },
  {
    title: "Content Repurposing Agent",
    desc: "Takes one long-form post and turns it into five platform-ready versions.",
    Svg: FlowingLines,
  },
];

export function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        headline="See it in action."
        subtitle="Real agents, built for real businesses."
      />

      <section className="relative px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3">
            {PROJECTS.map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.12}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-foreground/30">
                  {/* Visual */}
                  <div className="relative aspect-[4/3] w-full border-b border-border bg-card-2/40 p-6">
                    <p.Svg className="h-full w-full" />
                    {/* Coming soon overlay */}
                    <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
                      <span
                        className="nf-pulse-soft h-1.5 w-1.5 rounded-full"
                        style={{ background: "var(--fg)" }}
                      />
                      Uploading Soon
                    </div>
                  </div>
                  {/* Body */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-semibold tracking-tight">
                      {p.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {p.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Want something built for your business?"
        buttonLabel="Book a Free Call"
      />
    </>
  );
}
