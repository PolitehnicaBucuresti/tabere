import { SignJWT, jwtVerify } from "jose";
import { SESSION_COOKIE_NAME, getSessionSecret } from "./admin-config";
import type { NextRequest } from "next/server";

const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

function getSecretKey() {
  return new TextEncoder().encode(getSessionSecret());
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "tabere_admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_MAX_AGE_SEC}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, getSecretKey());
    return true;
  } catch {
    return false;
  }
}

export function getSessionCookieOptions(request?: NextRequest) {
  const secure =
    process.env.NODE_ENV === "production" || request?.headers.get("x-forwarded-proto") === "https";
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: COOKIE_MAX_AGE_SEC,
  };
}

export async function readSessionFromRequest(request: NextRequest): Promise<boolean> {
  const raw = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(raw);
}
