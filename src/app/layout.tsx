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
    // Theme-aware SVG favicon — swaps colors via prefers-color-scheme
    // inside the SVG. Modern browsers pick this up automatically.
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
    ],
    // Apple touch icon — single PNG (iOS doesn't support theme variants).
    // Light-theme version (dark logo on white) so it reads on iOS home screens.
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
