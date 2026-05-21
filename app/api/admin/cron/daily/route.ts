import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { runDailyDigestJob } from "@/lib/daily-digest";

/**
 * Manual trigger for daily digest (e.g. cron on host: curl -H "Authorization: Bearer $CRON_SECRET").
 * Or call from admin "Send test" if we add later.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : "";

  if (!secret || token !== secret) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 401 });
  }

  const result = await runDailyDigestJob();
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true, sent: result.sent });
}
