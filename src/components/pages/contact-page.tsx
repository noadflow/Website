"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Mail, Clock, MapPin, ArrowRight, Check } from "lucide-react";
import Cal from "@calcom/embed-react";
import { useAppStore } from "@/lib/theme-store";
import { PageHero } from "@/components/site/page-hero";
import { FadeIn } from "@/components/site/fade-in";

interface FormState {
  name: string;
  email: string;
  business: string;
  message: string;
}

const INFO = [
  { icon: Mail, label: "Email", value: "contact@noadflow.com" },
  { icon: Clock, label: "Response time", value: "Usually within a day" },
  {
    icon: MapPin,
    label: "Where I work",
    value: "Working with businesses worldwide",
  },
];

export function ContactPage() {
  // Subscribe to the live theme so the Cal.com widget can re-mount
  // with the matching theme (light/dark) when the user toggles.
  const theme = useAppStore((s) => s.theme);

  // Cal.com's iframe caches its initial theme and ignores config
  // changes at runtime — the only reliable way to swap themes is
  // to fully unmount and remount the iframe with the new config.
  // We use a `mountKey` that changes whenever the theme changes,
  // which forces React to tear down the old iframe and create a
  // fresh one. The brief blank state during the swap is masked by
  // a same-colored placeholder behind the iframe.
  const [mountKey, setMountKey] = useState(0);
  useEffect(() => {
    setMountKey((k) => k + 1);
  }, [theme]);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    business: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );

  const update =
    (k: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) setStatus("success");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        headline="Let's talk."
        subtitle="Tell me a bit about your business, or just book a time that works for you."
      />

      <section className="relative px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          {/* Row 1 — form (left) + contact info (right), side by side
              on desktop. Both cards take their natural height. */}
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            {/* Form / success */}
            <FadeIn>
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
                {status === "success" ? (
                  <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-full border border-border"
                      style={{ background: "var(--card-2)" }}
                    >
                      <Check className="h-7 w-7" />
                    </div>
                    <h3 className="mt-6 text-2xl font-semibold tracking-tight">
                      Thanks!
                    </h3>
                    <p className="mt-3 max-w-sm text-muted-foreground">
                      Your message has been sent — I'll be in touch shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="flex flex-col gap-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Name" required>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={update("name")}
                          placeholder="Your name"
                          className="nf-input"
                        />
                      </Field>
                      <Field label="Email" required>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={update("email")}
                          placeholder="you@company.com"
                          className="nf-input"
                        />
                      </Field>
                    </div>
                    <Field label="Business Name (optional)">
                      <input
                        type="text"
                        value={form.business}
                        onChange={update("business")}
                        placeholder="Your business"
                        className="nf-input"
                      />
                    </Field>
                    <Field label="Message" required>
                      <textarea
                        required
                        rows={6}
                        value={form.message}
                        onChange={update("message")}
                        placeholder="Tell me a bit about what you're trying to automate..."
                        className="nf-input resize-none"
                      />
                    </Field>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <p className="max-w-xs text-xs text-muted-foreground">
                        I read and reply to every message personally — usually
                        within a day.
                      </p>
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
                      >
                        {status === "sending" ? "Sending..." : "Send Message"}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                    {status === "error" && (
                      <p className="text-sm text-destructive">
                        Something went wrong. Please email contact@noadflow.com
                        directly.
                      </p>
                    )}
                  </form>
                )}
              </div>
            </FadeIn>

            {/* Contact info card */}
            <FadeIn delay={0.12}>
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
                <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Contact details
                </h3>
                <ul className="mt-6 flex flex-col gap-6">
                  {INFO.map(({ icon: Icon, label, value }) => (
                    <li key={label} className="flex items-start gap-3.5">
                      <span
                        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border"
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                          {label}
                        </p>
                        <p className="mt-1 text-sm font-medium">{value}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>

          {/* Row 2 — Cal.com scheduler as a full-width landscape card.
              Width spans the combined width of the form + contact info
              cards above it, so the scheduler has room to breathe in
              landscape. Cal.com's month_view layout is responsive and
              will fill the horizontal space. */}
          <FadeIn delay={0.2}>
            <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    Prefer to talk it through?
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Pick a time that works for you — this is a free 45-minute
                    call. We'll go through what's slowing your business down
                    and what AI agents can do about it.
                  </p>
                </div>
                <a
                  href="https://cal.com/noadflow/45-min-meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-border px-4 py-2 text-xs font-medium transition-colors hover:bg-secondary sm:self-auto"
                >
                  Open in new tab <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
              {/* Cal.com inline embed — full width, fixed landscape
                  height so the scheduler is usable without dominating
                  the page.
                  - `styles.body.background: "transparent"` makes the
                    iframe's own body background transparent, so the
                    container's `var(--card)` background shows through.
                    This is the key fix: without it, Cal.com's iframe
                    loads with a server-rendered background that matches
                    the INITIAL theme and never updates — so when you
                    toggle themes, the calendar UI changes but the
                    outer background stays stuck in the old theme.
                    With transparency, the container handles the
                    background and updates instantly via the CSS
                    variable.
                  - `key={mountKey}` forces a full remount on theme
                    change so the calendar UI inside the iframe
                    re-initializes with the new theme.
                  - No explicit `layout` is set — Cal.com's responsive
                    default adapts better to the container width. */}
              <div
                className="mt-6 overflow-hidden rounded-2xl border border-border"
                style={{ background: "var(--card)" }}
              >
                <Cal
                  key={mountKey}
                  calLink="noadflow/45-min-meeting"
                  style={{ width: "100%", height: "720px" }}
                  config={{
                    theme,
                    hideEventTypeDetails: false,
                    styles: {
                      body: { background: "transparent" },
                    },
                  }}
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <style>{`
        .nf-input {
          width: 100%;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--card-2);
          color: var(--fg);
          padding: 0.7rem 0.9rem;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .nf-input::placeholder { color: var(--muted-fg); opacity: 0.7; }
        .nf-input:focus {
          border-color: var(--fg);
          box-shadow: 0 0 0 3px var(--svg-fill);
        }
      `}</style>
    </>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
        {required && <span className="ml-1 opacity-60">*</span>}
      </span>
      {children}
    </label>
  );
}
