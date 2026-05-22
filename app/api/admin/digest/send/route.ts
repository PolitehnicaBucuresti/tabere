import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { runDailyDigestJob } from "@/lib/daily-digest";
import { requireAdminSession } from "@/lib/admin-api-guard";

/**
 * Manual send: same e-mail (+ Excel) as daily 09:00 job, addressed to mailing list recipients.
 */
export async function POST(request: NextRequest) {
  const denied = await requireAdminSession(request);
  if (denied) return denied;

  const result = await runDailyDigestJob();
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true, sent: result.sent });
}
