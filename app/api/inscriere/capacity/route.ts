import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { computeInscriptionSlots } from "@/lib/inscription-capacity";

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
  if (isLocalBrowserHost(request)) return true;
  const allowed = getAllowedOrigins();
  if (!allowed?.length) return true;
  const origin = request.headers.get("origin");
  return !!origin && allowed.includes(origin);
}

/**
 * Public: current booking counts per săptămână × grupă vârstă (for form UI).
 */
export async function GET(request: NextRequest) {
  if (!isOriginAllowed(request)) {
    return NextResponse.json({ error: "Cerere respinsă." }, { status: 403 });
  }

  try {
    const payload = await computeInscriptionSlots();
    return NextResponse.json(payload, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" },
    });
  } catch (e) {
    console.error("[inscriere/capacity]", e);
    return NextResponse.json({ error: "Nu am putut încărca disponibilitatea." }, { status: 500 });
  }
}
