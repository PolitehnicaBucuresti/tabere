import { NextRequest, NextResponse } from "next/server";
import { inscriptionPayloadSchema } from "@/lib/inscription-schema";
import { sendInscriptionEmails } from "@/lib/email";
import { createInscriptionApplication } from "@/lib/inscription-capacity";
import {
  INSCRIPTION_SLOT_FULL_MESSAGE,
  isPublicInscriptionSlotOpen,
} from "@/lib/inscription-constants";
import { isStrictOriginAllowed } from "@/lib/inscriere-http-allow";

function isOriginAllowed(request: NextRequest): boolean {
  return isStrictOriginAllowed(request);
}

function honeypotTriggered(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const raw = (body as Record<string, unknown>).organizationWebsite;

  if (raw === undefined || raw === null) return false;
  if (typeof raw !== "string") return true;

  return raw.trim() !== "";
}

export async function POST(request: NextRequest) {
  if (!isOriginAllowed(request)) {
    return NextResponse.json({ ok: false, error: "Cerere respinsă." }, { status: 403 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ ok: false, error: "Format invalid." }, { status: 415 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Format invalid." }, { status: 400 });
  }

  if (honeypotTriggered(body)) {
    return NextResponse.json({ ok: true });
  }

  const parsed = inscriptionPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Date invalide sau incomplete." }, { status: 400 });
  }

  const d = parsed.data;

  if (!isPublicInscriptionSlotOpen(d.ageCategory, d.series)) {
    return NextResponse.json(
      {
        ok: false,
        error: INSCRIPTION_SLOT_FULL_MESSAGE,
        code: "SLOT_FULL",
      },
      { status: 409 },
    );
  }

  try {
    const saved = await createInscriptionApplication(d);
    if (!saved.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: INSCRIPTION_SLOT_FULL_MESSAGE,
          code: "SLOT_FULL",
        },
        { status: 409 },
      );
    }

    const emailResult = await sendInscriptionEmails(d, { waitlisted: saved.waitlisted });
    if (!emailResult.success) {
      console.error("[inscriere] SMTP:", emailResult.error ?? "unknown");

      const generic =
        "Înscrierea a fost procesată, dar notificarea prin e-mail a eșuat.";

      return NextResponse.json(
        {
          ok: false,
          error: generic,
          ...(emailResult.error ? { details: emailResult.error } : {}),
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[inscriere] DB:", e);
    return NextResponse.json(
      { ok: false, error: "Înscrierea nu a putut fi salvată. Încercați din nou sau contactați organizatorii." },
      { status: 500 },
    );
  }
}
