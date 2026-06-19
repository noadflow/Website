import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/contact/list
 *
 * Returns all contact form submissions, newest first.
 *
 * ⚠️ This is an UNAUTHENTICATED endpoint suitable for a personal
 * site / dev preview. Before deploying to production, gate it
 * behind authentication (e.g. a shared secret in an Authorization
 * header, NextAuth session, etc.). Search for `ADMIN_TOKEN` below
 * for the recommended minimal pattern.
 *
 * Query params:
 *   ?limit=N   — cap number of results (default 100, max 500)
 *
 * Example:
 *   curl http://localhost:3000/api/contact/list?limit=20
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const limitRaw = Number.parseInt(url.searchParams.get("limit") ?? "100", 10);
  const limit = Math.max(1, Math.min(500, Number.isFinite(limitRaw) ? limitRaw : 100));

  /* ── Optional minimal auth gate (uncomment to enable) ──────────
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
  if (ADMIN_TOKEN) {
    const auth = req.headers.get("authorization") ?? "";
    if (auth !== `Bearer ${ADMIN_TOKEN}`) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }
  ──────────────────────────────────────────────────────────────── */

  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      ok: true,
      count: messages.length,
      messages,
    });
  } catch (err) {
    console.error("[/api/contact/list] failed:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch messages." },
      { status: 500 },
    );
  }
}
