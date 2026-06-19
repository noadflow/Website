import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NoadFlow — Automation that thinks for itself.",
  description:
    "NoadFlow builds custom AI agents that automate the busywork for businesses worldwide. Lead generation, customer support, and workflow automation that actually thinks.",
  keywords: [
    "NoadFlow",
    "AI automation",
    "AI agents",
    "lead generation",
    "customer support automation",
    "workflow automation",
  ],
  authors: [{ name: "NoadFlow" }],
  icons: {
    // Theme-aware favicons via media-queried <link> tags.
    // The browser picks the matching SVG based on the OS/browser theme.
    // This is the proper cross-browser approach (Safari ignores
    // prefers-color-scheme inside SVG, but DOES respect it on <link>).
    //
    //   light OS  → /favicon-light.svg  (dark grey logo)
    //   dark OS   → /favicon-dark.svg   (white logo)
    //
    // PNG fallbacks for legacy browsers (single static light variant).
    icon: [
      {
        url: "/favicon-light.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-dark.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
    ],
    // Apple touch icon — single PNG (iOS doesn't support theme variants
    // for apple-touch-icon). Light-theme version (dark logo on white)
    // so it reads on iOS home screens.
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "NoadFlow — Automation that thinks for itself.",
    description:
      "Custom AI agents that automate the busywork for businesses worldwide.",
    url: "https://noadflow.com",
    siteName: "NoadFlow",
    type: "website",
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem('noadflow-theme');if(t!=='light'&&t!=='dark'){t='dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${fraunces.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
