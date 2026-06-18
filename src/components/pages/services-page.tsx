"use client";

import { ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/theme-store";
import { PageHero } from "@/components/site/page-hero";
import { FadeIn } from "@/components/site/fade-in";
import { CTASection } from "@/components/site/cta-section";
import { LeadNetworkMap } from "@/components/svg/lead-network-map";
import { ChatBubbles } from "@/components/svg/chat-bubbles";
import { ContentAgents } from "@/components/svg/content-agents";
import { InterlockingGears } from "@/components/svg/interlocking-gears";
import { cn } from "@/lib/utils";

const SERVICES = [
  {
    num: "01",
    title: "Lead Generation",
    tag: "Lead Generation Agents",
    desc: "Your agent searches for businesses that match your ideal customer profile, researches each one, identifies what they're missing, and writes a personalized outreach message — every morning, automatically. You wake up to a list of warm, ready-to-send leads.",
    Svg: LeadNetworkMap,
  },
  {
    num: "02",
    title: "Customer Support",
    tag: "Customer Support Agents",
    desc: "An AI agent trained on your business's information that answers customer questions instantly, any time of day. It knows your products, policies, and tone — and escalates anything it can't handle to you directly.",
    Svg: ChatBubbles,
  },
  {
    num: "03",
    title: "Content & Social",
    tag: "Content & Social Agents",
    desc: "Turn one piece of content into many. Your agent repurposes blog posts, videos, or updates into formats for different platforms — automatically, on schedule.",
    Svg: ContentAgents,
  },
  {
    num: "04",
    title: "Custom Workflow",
    tag: "Custom Workflow Automation",
    desc: "If it's repetitive, it can probably be automated. I connect your existing tools — email, spreadsheets, CRMs, calendars — so information flows between them without anyone touching it.",
    Svg: InterlockingGears,
  },
];

export function ServicesPage() {
  const setPage = useAppStore((s) => s.setPage);

  return (
    <>
      <PageHero
        eyebrow="Services"
        headline="What I build."
        subtitle="AI agents designed around how your business actually operates."
      />

      {/* Service blocks — alternating layout */}
      <section className="relative px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-16 sm:gap-24">
          {SERVICES.map((s, i) => {
            const reverse = i % 2 === 1;
            return (
              <FadeIn key={s.num}>
                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                  {/* Text */}
                  <div className={cn(reverse && "lg:order-2")}>
                    <div className="mb-4 flex items-center gap-3">
                      <span className="font-serif text-sm text-muted-foreground">
                        {s.num}
                      </span>
                      <span className="h-px w-10 bg-border" />
                      <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                        {s.tag}
                      </span>
                    </div>
                    <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                      {s.title}
                    </h2>
                    <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                      {s.desc}
                    </p>
                    <button
                      onClick={() => setPage("contact")}
                      className="mt-7 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
                    >
                      Book a Free Call <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* SVG */}
                  <div className={cn("relative", reverse && "lg:order-1")}>
                    <div className="mx-auto aspect-square w-full max-w-[440px] rounded-3xl border border-border bg-card/50 p-6">
                      <s.Svg className="h-full w-full" />
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      <CTASection
        title="Not sure which fits your business?"
        subtitle="Tell me what's eating up your time, and I'll tell you honestly whether an agent makes sense for it."
        buttonLabel="Book a Free Call"
      />
    </>
  );
}
