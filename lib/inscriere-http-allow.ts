/**
 * Helpers for guarding public inscription endpoints.
 * Same-origin GET often omits the Origin header; POST usually includes it.
 * Behind Traefik/reverse proxies use X-Forwarded-Host for the public hostname.
 */

import type { NextRequest } from "next/server";

function expandOriginVariants(originOrUrl: string): string[] {
  try {
    const u = originOrUrl.includes("://") ? new URL(originOrUrl) : new URL(`https://${originOrUrl}`);
    const h = u.hostname.toLowerCase();
    const out = new Set<string>([u.origin]);
    if (!h.startsWith("www.") && h.includes(".") && h !== "localhost" && h !== "127.0.0.1") {
      out.add(`${u.protocol}//www.${h}`);
    } else if (h.startsWith("www.") && h.slice(4).includes(".")) {
      out.add(`${u.protocol}//${h.slice(4)}`);
    }
    return [...out];
  } catch {
    return [originOrUrl];
  }
}

export function getInscriptionAllowedOrigins(): string[] | null {
  const explicit = process.env.INSCRIPTION_ALLOWED_ORIGINS?.trim();
  if (explicit) {
    const list = explicit.split(",").map((s) => s.trim()).filter(Boolean);
    if (!list.length) return null;
    const expanded = new Set<string>();
    for (const raw of list) {
      for (const v of expandOriginVariants(raw)) expanded.add(v);
    }
    return [...expanded];
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!site) return null;

  try {
    const u = new URL(site);
    return expandOriginVariants(u.origin);
  } catch {
    return null;
  }
}

function normalizeComparableHost(hostNoPort: string): string {
  const h = hostNoPort.trim().toLowerCase();
  return h.startsWith("www.") ? h.slice(4) : h;
}

/** Public hostnames as seen by the client (proxy-friendly). */
function getForwardedOrRequestHostnames(req: NextRequest): string[] {
  const xf = req.headers.get("x-forwarded-host");
  if (xf) {
    const parts = xf.split(",").map((h) => h.trim().split(":")[0]?.toLowerCase()).filter(Boolean);
    if (parts.length) return [...new Set(parts)];
  }
  const host = req.headers.get("host")?.split(":")[0]?.trim().toLowerCase();
  return host ? [host] : [];
}

export function isLocalDevelopmentHost(req: NextRequest): boolean {
  for (const h of getForwardedOrRequestHostnames(req)) {
    const n = normalizeComparableHost(h);
    if (n === "localhost" || n === "127.0.0.1" || n === "::1") return true;
  }
  return false;
}

function requestHostMatchesAnyAllowedSite(req: NextRequest, origins: string[]): boolean {
  const candidates = getForwardedOrRequestHostnames(req);
  if (!candidates.length) return false;

  const allowedNorm = new Set<string>();
  for (const o of origins) {
    try {
      allowedNorm.add(normalizeComparableHost(new URL(o).hostname));
    } catch {
      /* skip */
    }
  }

  for (const hostPart of candidates) {
    if (allowedNorm.has(normalizeComparableHost(hostPart))) return true;
  }
  return false;
}

function requestReferrerMatchesAllowedSite(req: NextRequest, origins: string[]): boolean {
  const referer = req.headers.get("referer");
  if (!referer) return false;
  let refOrigin: string;
  try {
    refOrigin = new URL(referer).origin;
  } catch {
    return false;
  }
  return origins.includes(refOrigin);
}

/**
 * Strict: must have Origin matching allowlist — used for POST JSON (CSRF-lite).
 */
export function isStrictOriginAllowed(req: NextRequest): boolean {
  if (isLocalDevelopmentHost(req)) return true;

  const allowed = getInscriptionAllowedOrigins();
  if (!allowed?.length) return true;

  const origin = req.headers.get("origin");
  return !!origin && allowed.includes(origin);
}

/**
 * Read-only GET (availability): Origin OR host (incl. X-Forwarded-Host) OR Referer match.
 */
export function isCapacityFetchAllowed(req: NextRequest): boolean {
  if (isLocalDevelopmentHost(req)) return true;

  const allowed = getInscriptionAllowedOrigins();
  if (!allowed?.length) return true;

  const origin = req.headers.get("origin");
  if (origin && allowed.includes(origin)) return true;

  if (requestHostMatchesAnyAllowedSite(req, allowed)) return true;
  if (requestReferrerMatchesAllowedSite(req, allowed)) return true;

  return false;
}
