"use client";

import Image from "next/image";
import { UserRound, Bot, Globe2 } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { FadeIn } from "@/components/site/fade-in";
import { CTASection } from "@/components/site/cta-section";

const TEAM = [
  {
    name: "Anas",
    role: "Founder & Automation Lead",
    image: "/anas.jpg",
    alt: "Anas — founder of NoadFlow",
    bio: "Anas runs NoadFlow and builds every automation that ships from it. He sits down with each client, works out where the business is losing time, and turns that into AI agents and workflows that actually fix the problem — lead generation, customer support, internal processes, whatever is eating the hours. When he's not building for clients, he runs NoadFlow's socials too.",
    tags: [
      "AI Agents",
      "Workflow Automation",
      "Client Automation",
      "Social Media",
    ],
  },
  {
    name: "Sumiya",
    role: "Client Relations & Delivery",
    image: "/sumiya.jpg",
    alt: "Sumiya — client relations at NoadFlow",
    bio: "Sumiya takes care of everything on the client side. She manages every lead that comes in, has the first conversation, and stays with you right through to delivery — updates, questions, changes, and the final handover. Nothing gets lost between a first message and a finished automation, and you always know exactly where your project stands.",
    tags: ["Lead Management", "Client Communication", "Delivery", "Onboarding"],
  },
];

const STORY = [
  {
    eyebrow: "Our Story",
    title: "Why NoadFlow exists",
    body: "NoadFlow grew out of a simple frustration — businesses losing hours every week to repetitive work that a well-built system could handle on its own. We built a studio around fixing that: handing the busywork off to AI agents that actually think through what needs to happen. Every project is built personally by our team, so what you get is designed around how your business really works, not a templated shortcut.",
  },
  {
    eyebrow: "How We Work",
    title: "Hands-on, from start to finish",
    body: "From the first conversation about what's slowing you down, through the build, to keeping everything running after launch — you deal with the same two people the whole way. Anas works out the problem and builds the system; Sumiya keeps you informed and makes sure delivery lands. No account managers, no layers — just the two people actually doing the work.",
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
        headline="The two people behind NoadFlow."
        subtitle="Anas builds the automations. Sumiya handles the client side. No account managers, no layers — just the two of us doing the work."
      />

      {/* Team — the main section of the About page. Two members side by
          side, each card: portrait on the left, bio + tags on the right. */}
      <section className="relative px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Our Team"
            title="Meet Anas & Sumiya"
            subtitle="One works out the problem and builds the system. The other makes sure you're informed and that delivery lands. Everything in between is handled by the same two people you'll actually work with."
            className="max-w-3xl"
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {TEAM.map((member, i) => (
              <FadeIn key={member.name} delay={i * 0.12}>
                <div className="h-full overflow-hidden rounded-3xl border border-border bg-card">
                  <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[180px_1fr] md:grid-cols-[230px_1fr]">
                    {/* Portrait — image on the left */}
                    <div className="relative min-h-[260px]">
                      <Image
                        src={member.image}
                        alt={member.alt}
                        fill
                        sizes="(max-width: 640px) 120px, (max-width: 768px) 180px, 230px"
                        className="object-cover object-top"
                      />
                    </div>

                    {/* Bio — on the right */}
                    <div className="flex flex-col p-5 sm:p-6">
                      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                        {member.role}
                      </p>
                      <h3 className="mt-2 font-serif text-2xl font-semibold tracking-tight">
                        {member.name}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {member.bio}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {member.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-border px-3 py-1 text-[11px] font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* What we do — statement + service tags */}
      <section className="relative px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="rounded-3xl border border-border bg-card p-8 sm:p-10">
              <div className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                <span className="h-px w-7 bg-current opacity-40" />
                What We Do
              </div>
              <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                We build AI agents that handle the busywork — so you can focus
                on growing your business.
              </h2>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground">
                NoadFlow is a focused two-person studio — no templated
                solutions, no bloated teams, no handoffs. Just careful work
                built around your business.
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
          </FadeIn>
        </div>
      </section>

      {/* Principles strip */}
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

      {/* Story + How We Work */}
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
        title="Want Anas and Sumiya to build your automation?"
        subtitle="Book a free call — we'll talk through what's slowing your business down and what we can build."
        buttonLabel="Book a Free Call"
      />
    </>
  );
}


