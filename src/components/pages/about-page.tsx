"use client";

import Image from "next/image";
import { UserRound, Bot, Globe2 } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { FadeIn } from "@/components/site/fade-in";
import { CTASection } from "@/components/site/cta-section";

const STORY = [
  {
    eyebrow: "My Story",
    title: "Why NoadFlow exists",
    body: "I've always been drawn to building things — figuring out how systems work and making them work better. NoadFlow grew out of that: a way to take the repetitive, time-consuming parts of running a business and hand them off to AI agents that actually think through what needs to happen. Every project I take on, I build personally — which means you're not getting a templated solution, you're getting something built specifically around how your business actually works.",
  },
  {
    eyebrow: "How I Work",
    title: "Hands-on, from start to finish",
    body: "Every build is handled with care from the first conversation about what's slowing you down, to designing the agent, to making sure it keeps running smoothly after launch. Direct communication, no layers of account managers — just clear, focused work that gets your automation shipped and performing.",
  },
];

const PRINCIPLES = [
  {
    icon: UserRound,
    title: "Built around you",
    body: "Every solution is designed from scratch around your specific workflows. No templates, no copy-paste automation — just systems built specifically for how your business runs.",
  },
  {
    icon: Bot,
    title: "Real AI agents",
    body: "Not just Zapier with a chatbot skin. Agents that actually reason through each situation and decide what to do next.",
  },
  {
    icon: Globe2,
    title: "Built to scale",
    body: "What starts as one agent can grow into a full automation fleet. Systems are designed to scale with your business, not get rebuilt as you grow.",
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

      {/* Portrait + intro band */}
      <section className="relative px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="grid gap-6 lg:grid-cols-[420px_1fr] lg:items-stretch">
              {/* Portrait card */}
              <div className="relative overflow-hidden rounded-3xl border border-border bg-card">
                <div className="relative aspect-[5/7] w-full">
                  <Image
                    src="/anas.png"
                    alt="Anas — founder of NoadFlow"
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover object-top"
                    priority
                  />
                  {/* Subtle gradient at the bottom for caption legibility. */}
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
                    style={{
                      background:
                        "linear-gradient(to top, var(--card), transparent)",
                    }}
                  />
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      Founder
                    </p>
                    <p className="mt-1 font-serif text-xl font-semibold tracking-tight">
                      Anas
                    </p>
                  </div>
                  <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] backdrop-blur">
                    NoadFlow
                  </span>
                </div>
              </div>

              {/* Intro narrative */}
              <div className="flex h-full flex-col justify-center rounded-3xl border border-border bg-card p-8 sm:p-10">
                <div className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  <span className="h-px w-7 bg-current opacity-40" />
                  Quick intro
                </div>
                <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                  I build AI agents that handle the busywork — so you can
                  focus on growing your business.
                </h2>
                <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                  NoadFlow is a focused studio built around direct
                  communication and careful work. Every project gets the same
                  attention to detail — no templated solutions, no bloated
                  teams, no handoffs. If you're tired of generic automation
                  tools that don't quite fit, I'll build you something that
                  actually does.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {[
                    "AI Agents",
                    "Lead Generation",
                    "Customer Support",
                    "Workflow Automation",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Principles strip — replaces the empty decorative wave band.
          Three concrete value props with icons, so the section actually
          says something instead of just being decoration. */}
      <section className="relative px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="grid gap-4 rounded-3xl border border-border bg-card p-6 sm:grid-cols-3 sm:p-8">
              {PRINCIPLES.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="flex flex-col gap-3 sm:px-2 sm:first:pl-0 sm:last:pr-0"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="text-base font-semibold tracking-tight">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              ))}
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
