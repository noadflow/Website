"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore, type PageId } from "@/lib/theme-store";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { ParallaxBackground } from "@/components/site/parallax-background";
import { HomePage } from "@/components/pages/home-page";
import { ServicesPage } from "@/components/pages/services-page";
import { PortfolioPage } from "@/components/pages/portfolio-page";
import { AboutPage } from "@/components/pages/about-page";
import { PricingPage } from "@/components/pages/pricing-page";
import { ContactPage } from "@/components/pages/contact-page";

const PAGES: Record<PageId, () => React.JSX.Element> = {
  home: HomePage,
  services: ServicesPage,
  portfolio: PortfolioPage,
  about: AboutPage,
  pricing: PricingPage,
  contact: ContactPage,
};

export default function Home() {
  const page = useAppStore((s) => s.page);
  const hydrate = useAppStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const Current = PAGES[page];

  return (
    <div className="relative flex min-h-screen flex-col">
      <ParallaxBackground />
      <Navbar />
      <main className="relative z-10 flex-1 pt-24 sm:pt-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Current />
          </motion.div>
        </AnimatePresence>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
