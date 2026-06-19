import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, business, message } = body ?? {};

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields." },
        { status: 400 },
      );
    }

    // Sanitize: trim + cap lengths to protect the DB.
    const safeName = String(name).trim().slice(0, 200);
    const safeEmail = String(email).trim().slice(0, 320);
    const safeBusiness = business ? String(business).trim().slice(0, 200) : null;
    const safeMessage = String(message).trim().slice(0, 5000);

    if (!safeName || !safeEmail || !safeMessage) {
      return NextResponse.json(
        { ok: false, error: "Fields cannot be empty." },
        { status: 400 },
      );
    }

    // Persist to SQLite via Prisma.
    const record = await db.contactMessage.create({
      data: {
        name: safeName,
        email: safeEmail,
        business: safeBusiness,
        message: safeMessage,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Your message has been sent — I'll be in touch shortly.",
      id: record.id,
    });
  } catch (err) {
    console.error("[/api/contact] failed to save message:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong saving your message." },
      { status: 500 },
    );
  }
}
