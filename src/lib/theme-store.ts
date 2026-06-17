import { create } from "zustand";

export type Theme = "dark" | "light";
export type PageId =
  | "home"
  | "services"
  | "portfolio"
  | "about"
  | "pricing"
  | "contact";

interface AppState {
  theme: Theme;
  page: PageId;
  hydrated: boolean;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setPage: (p: PageId) => void;
  hydrate: () => void;
}

const STORAGE_KEY = "noadflow-theme";

function applyTheme(t: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", t);
  try {
    localStorage.setItem(STORAGE_KEY, t);
  } catch {
    /* ignore */
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  theme: "dark",
  page: "home",
  hydrated: false,
  setTheme: (t) => {
    applyTheme(t);
    set({ theme: t });
  },
  toggleTheme: () => {
    const next: Theme = get().theme === "dark" ? "light" : "dark";
    applyTheme(next);
    set({ theme: next });
  },
  setPage: (p) => {
    set({ page: p });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
  hydrate: () => {
    if (typeof document === "undefined") return;
    const attr = document.documentElement.getAttribute("data-theme") as Theme | null;
    let t: Theme = attr ?? "dark";
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === "dark" || stored === "light") t = stored;
    } catch {
      /* ignore */
    }
    applyTheme(t);
    set({ theme: t, hydrated: true });
  },
}));
