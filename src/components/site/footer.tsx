"use client";

import { Linkedin, Instagram, Twitter } from "lucide-react";
import { useAppStore, type PageId } from "@/lib/theme-store";
import { LogoMark } from "./logo-mark";
import { cn } from "@/lib/utils";

const SOCIALS = [
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "X", icon: Twitter, href: "#" },
];

export function Footer() {
  const setPage = useAppStore((s) => s.setPage);
  const go = (id: PageId) => () => setPage(id);

  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-1.5">
              <LogoMark className="h-10 w-10" />
              <span className="font-serif text-lg font-semibold tracking-tight">
                Noad<span className="text-muted-foreground">Flow</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Custom AI agents that automate the busywork for businesses
              worldwide.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Company
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <FooterLink onClick={go("services")}>Services</FooterLink>
              </li>
              <li>
                <FooterLink onClick={go("portfolio")}>Portfolio</FooterLink>
              </li>
              <li>
                <FooterLink onClick={go("about")}>About</FooterLink>
              </li>
              <li>
                <FooterLink onClick={go("pricing")}>Pricing</FooterLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Get in touch
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <FooterLink onClick={go("contact")}>Contact</FooterLink>
              </li>
              <li>
                <a
                  href="mailto:contact@noadflow.com"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  contact@noadflow.com
                </a>
              </li>
              <li>
                <FooterLink onClick={go("contact")}>Book a call</FooterLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © 2026 NoadFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-2.5">
            {SOCIALS.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </button>
  );
}
