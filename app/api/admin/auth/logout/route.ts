import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/admin-config";
import { getSessionCookieOptions } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, "", {
    ...getSessionCookieOptions(request),
    maxAge: 0,
  });
  return res;
}
