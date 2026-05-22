import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { computeInscriptionSlots } from "@/lib/inscription-capacity";
import { isCapacityFetchAllowed } from "@/lib/inscriere-http-allow";

/**
 * Public: current booking counts per săptămână × grupă vârstă (for form UI).
 * Host/referer fallback: same-origin GET often omits Origin, which would 403 with NEXT_PUBLIC_SITE_URL set.
 */
export async function GET(request: NextRequest) {
  if (!isCapacityFetchAllowed(request)) {
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
