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
  /** True once the user has explicitly chosen a theme (vs. following the browser). */
  userOverrodeBrowser: boolean;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setPage: (p: PageId) => void;
  hydrate: () => void;
}

const STORAGE_KEY = "noadflow-theme";
const OVERRIDE_KEY = "noadflow-theme-overridden";

function applyTheme(t: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", t);
  try {
    localStorage.setItem(STORAGE_KEY, t);
  } catch {
    /* ignore */
  }
}

/** Read the browser/OS color-scheme preference. */
function browserTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

/** Did the user explicitly toggle the theme in a previous session? */
function readOverride(): boolean {
  try {
    return localStorage.getItem(OVERRIDE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Mark that the user has explicitly chosen, so we stop following the browser. */
function markOverride() {
  try {
    localStorage.setItem(OVERRIDE_KEY, "1");
  } catch {
    /* ignore */
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  theme: "dark",
  page: "home",
  hydrated: false,
  userOverrodeBrowser: false,
  setTheme: (t) => {
    markOverride();
    applyTheme(t);
    set({ theme: t, userOverrodeBrowser: true });
  },
  toggleTheme: () => {
    markOverride();
    const next: Theme = get().theme === "dark" ? "light" : "dark";
    applyTheme(next);
    set({ theme: next, userOverrodeBrowser: true });
  },
  setPage: (p) => {
    set({ page: p });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
  hydrate: () => {
    if (typeof document === "undefined") return;
    // Priority:
    //   1. If the user has explicitly toggled in a past session → use
    //      their stored choice.
    //   2. Otherwise → follow the browser/OS preference (prefers-color-scheme).
    //   3. Fallback → dark.
    const overridden = readOverride();
    let t: Theme;
    try {
      if (overridden) {
        const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
        t = stored === "light" || stored === "dark" ? stored : browserTheme();
      } else {
        t = browserTheme();
      }
    } catch {
      t = "dark";
    }
    applyTheme(t);
    set({ theme: t, hydrated: true, userOverrodeBrowser: overridden });

    // Listen for browser theme changes. If the user has NOT explicitly
    // overridden, follow the browser live (e.g. user switches OS theme
    // while the tab is open).
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const onChange = () => {
        if (!get().userOverrodeBrowser) {
          const next = browserTheme();
          applyTheme(next);
          set({ theme: next });
        }
      };
      // addEventListener is the modern API; fall back for older Safari.
      if (mq.addEventListener) {
        mq.addEventListener("change", onChange);
      } else if (mq.addListener) {
        mq.addListener(onChange);
      }
    }
  },
}));
