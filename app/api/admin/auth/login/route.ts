import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminPassword, SESSION_COOKIE_NAME } from "@/lib/admin-config";
import { createSessionToken, getSessionCookieOptions } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalid." }, { status: 400 });
  }

  const password = typeof body === "object" && body !== null && "password" in body ? String((body as { password: unknown }).password ?? "") : "";

  if (password !== getAdminPassword()) {
    return NextResponse.json({ error: "Parolă incorectă." }, { status: 401 });
  }

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions(request));
  return res;
}
