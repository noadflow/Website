"use client";

import { PageHero } from "@/components/site/page-hero";
import { FadeIn } from "@/components/site/fade-in";
import { CTASection } from "@/components/site/cta-section";
import { FlowingLines } from "@/components/svg/flowing-lines";

const STORY = [
  {
    eyebrow: "My Story",
    title: "Why NoadFlow exists",
    body: "I've always been drawn to building things — figuring out how systems work and making them work better. NoadFlow grew out of that: a way to take the repetitive, time-consuming parts of running a business and hand them off to AI agents that actually think through what needs to happen. Every project I take on, I build personally — which means you're not getting a templated solution, you're getting something built specifically around how your business actually works.",
  },
  {
    eyebrow: "How I Work",
    title: "Hands-on, from start to finish",
    body: "I handle every build myself — from the first conversation about what's slowing you down, to designing the agent, to making sure it keeps running smoothly after launch. No handoffs, no account managers — just direct communication with the person actually building your automation.",
  },
];

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        headline="Hi, I'm Anas."
        subtitle="I started NoadFlow to bring practical, intelligent automation to businesses that don't have the time to build it themselves."
      />

      {/* Flowing lines band */}
      <section className="relative px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="relative h-[200px] w-full overflow-hidden rounded-3xl border border-border bg-card/40 sm:h-[260px]">
              <FlowingLines className="h-full w-full" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Story + How I Work */}
      <section className="relative px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:grid lg:grid-cols-2 lg:gap-8">
          {STORY.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.12}>
              <div className="h-full rounded-3xl border border-border bg-card p-8 sm:p-10">
                <div className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  <span className="h-px w-7 bg-current opacity-40" />
                  {s.eyebrow}
                </div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {s.title}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <CTASection
        title="Want to see what this could look like for your business?"
        buttonLabel="Book a Free Call"
      />
    </>
  );
}
