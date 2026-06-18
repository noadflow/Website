import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, business, message } = body ?? {};

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields." },
        { status: 400 },
      );
    }

    // In a real deployment this would forward to email / CRM.
    // Here we simply acknowledge receipt.
    return NextResponse.json({
      ok: true,
      message: "Your message has been sent — I'll be in touch shortly.",
      received: { name, email, business, message: String(message).slice(0, 200) },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }
}
