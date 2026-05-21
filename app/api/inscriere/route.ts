import { NextRequest, NextResponse } from "next/server";
import { inscriptionPayloadSchema } from "@/lib/inscription-schema";
import { sendInscriptionEmails } from "@/lib/email";
import { prisma } from "@/lib/prisma";

function getAllowedOrigins(): string[] | null {
  const explicit = process.env.INSCRIPTION_ALLOWED_ORIGINS?.trim();
  if (explicit) {
    const list = explicit.split(",").map((s) => s.trim()).filter(Boolean);
    return list.length ? list : null;
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!site) return null;

  try {
    return [new URL(site).origin];
  } catch {
    return null;
  }
}

/** Local browser hits (next dev / next start on this machine) — avoid blocking when NEXT_PUBLIC_SITE_URL is the prod canonical URL. */
function isLocalBrowserHost(request: NextRequest): boolean {
  const raw = request.headers.get("host");
  if (!raw) return false;
  try {
    const hostname = new URL(`http://${raw}`).hostname.toLowerCase();
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
  } catch {
    return false;
  }
}

function isOriginAllowed(request: NextRequest): boolean {
  if (isLocalBrowserHost(request)) {
    return true;
  }

  const allowed = getAllowedOrigins();
  if (!allowed?.length) return true;

  const origin = request.headers.get("origin");
  return !!origin && allowed.includes(origin);
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
  try {
    await prisma.application.create({
      data: {
        parentName: d.parentName,
        phone: d.phone,
        email: d.email,
        childName: d.childName,
        age: d.age,
        school: d.school,
        series: d.series,
        ageCategory: d.ageCategory,
        medicalInfo: d.medicalInfo,
        childPassions: d.childPassions,
        organizerNotes: d.organizerNotes,
        gdprAccepted: true,
      },
    });
  } catch (e) {
    console.error("[inscriere] DB:", e);
    return NextResponse.json(
      { ok: false, error: "Înscrierea nu a putut fi salvată. Încercați din nou sau contactați organizatorii." },
      { status: 500 },
    );
  }

  // Send SMTP emails
  const emailResult = await sendInscriptionEmails(d);
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
}