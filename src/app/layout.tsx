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
    "NoadFlow builds custom AI agents that automate the busywork for small businesses in the US and UK. Lead generation, customer support, and workflow automation that actually thinks.",
  keywords: [
    "NoadFlow",
    "AI automation",
    "AI agents",
    "lead generation",
    "customer support automation",
    "workflow automation",
  ],
  authors: [{ name: "NoadFlow" }],
  openGraph: {
    title: "NoadFlow — Automation that thinks for itself.",
    description:
      "Custom AI agents that automate the busywork for small businesses in the US and UK.",
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
