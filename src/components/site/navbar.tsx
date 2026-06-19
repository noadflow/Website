"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useAppStore, type PageId } from "@/lib/theme-store";
import { ThemeToggle } from "./theme-toggle";
import { LogoMark } from "./logo-mark";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV: { id: PageId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Portfolio" },
  { id: "about", label: "About" },
  { id: "pricing", label: "Pricing" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const page = useAppStore((s) => s.page);
  const setPage = useAppStore((s) => s.setPage);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-2.5" : "py-4 sm:py-5",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav
          className={cn(
            "flex items-center justify-between rounded-2xl px-3 sm:px-5 py-2.5 transition-all duration-500",
            scrolled
              ? "border border-border shadow-[0_8px_40px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl"
              : "border border-transparent",
          )}
          style={{ backgroundColor: "var(--nav-bg)" }}
        >
          {/* Logo */}
          <button
            onClick={() => setPage("home")}
            className="group flex items-center gap-1.5"
            aria-label="NoadFlow home"
          >
            <LogoMark className="h-10 w-10" />
            <span className="font-serif text-lg font-semibold tracking-tight">
              Noad<span className="text-muted-foreground">Flow</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden items-center gap-0.5 md:flex">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  page === item.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
                {page === item.id && (
                  <span className="absolute inset-x-3.5 -bottom-px h-px bg-foreground" />
                )}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setPage("contact")}
              className="hidden rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 sm:inline-flex"
            >
              Book a Free Call
            </button>

            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border md:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] border-border bg-background"
              >
                <div className="flex flex-col gap-1 pt-10">
                  <div className="mb-4 flex items-center gap-1.5 px-4">
                    <LogoMark className="h-9 w-9" />
                    <span className="font-serif text-base font-semibold">
                      Noad<span className="text-muted-foreground">Flow</span>
                    </span>
                  </div>
                  {NAV.map((item) => (
                    <SheetClose asChild key={item.id}>
                      <button
                        onClick={() => setPage(item.id)}
                        className={cn(
                          "rounded-xl px-4 py-3 text-left text-base font-medium transition-colors",
                          page === item.id
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                        )}
                      >
                        {item.label}
                      </button>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <button
                      onClick={() => setPage("contact")}
                      className="mt-4 mx-4 inline-flex items-center justify-center rounded-full bg-foreground px-4 py-3 text-sm font-medium text-background"
                    >
                      Book a Free Call
                    </button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
