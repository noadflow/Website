"use client";

import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/page-hero";
import { FadeIn } from "@/components/site/fade-in";
import { CTASection } from "@/components/site/cta-section";
import { LeadNetworkMap } from "@/components/svg/lead-network-map";
import { ChatBubbles } from "@/components/svg/chat-bubbles";
import { VideoPlay } from "@/components/svg/video-play";

const PROJECTS = [
  {
    title: "Done For You UGC Ads",
    desc: "We handle the full UGC ad pipeline — from script to final video — so you can run paid social without filming a thing.",
    Svg: VideoPlay,
    href: "https://drive.google.com/drive/folders/1DAJ0IWLgW0bqfMIU_qlf3xNIVUjHEYwe?usp=sharing",
  },
  {
    title: "Lead Research Agent",
    desc: "Finds and researches prospects daily, then writes personalized outreach that actually gets replies.",
    Svg: LeadNetworkMap,
  },
  {
    title: "Customer Support Agent",
    desc: "Answers customer questions 24/7 using your business's own knowledge base — no more repetitive tickets.",
    Svg: ChatBubbles,
  },
];

export function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Work"
        headline="What we've built."
        subtitle="Real agents and automations running for real businesses. Click any card to see examples."
      />

      <section className="relative px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3">
            {PROJECTS.map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.15} y={30} duration={0.8}>
                <motion.div
                  whileInView={{
                    scale: 1,
                    opacity: 1,
                    transition: { duration: 0.5 },
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:-translate-y-2 hover:border-foreground/40 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
                >
                  {/* Visual */}
                  <div className="relative aspect-[4/3] w-full border-b border-border bg-card-2/40 p-6">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="relative h-full w-full flex items-center justify-center overflow-hidden transition-transform duration-500"
                    >
                      <p.Svg className="h-full w-full" />
                    </motion.div>
                    {p.href ? (
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <span
                          className="nf-pulse-soft h-1.5 w-1.5 rounded-full"
                          style={{ background: "var(--fg)" }}
                        />
                        Click to View Examples
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    ) : (
                      <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
                        <span
                          className="nf-pulse-soft h-1.5 w-1.5 rounded-full"
                          style={{ background: "var(--fg)" }}
                        />
                        Examples Coming Soon
                      </div>
                    )}
                  </div>
                  {/* Body */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-semibold tracking-tight">
                      {p.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {p.desc}
                    </p>
                    {p.href && (
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent underline underline-offset-4 transition-colors"
                      >
                        View Examples <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to see what we can build for you?"
        buttonLabel="Book a Free Call"
      />
    </>
  );
}
