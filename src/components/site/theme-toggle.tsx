"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useAppStore } from "@/lib/theme-store";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useAppStore((s) => s.theme);
  const toggle = useAppStore((s) => s.toggleTheme);
  const hydrate = useAppStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-transform duration-300 hover:scale-105 active:scale-95",
        className,
      )}
    >
      <Sun
        className={cn(
          "h-[18px] w-[18px] transition-all duration-500",
          theme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0",
        )}
      />
      <Moon
        className={cn(
          "absolute h-[18px] w-[18px] transition-all duration-500",
          theme === "light"
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0",
        )}
      />
    </button>
  );
}
