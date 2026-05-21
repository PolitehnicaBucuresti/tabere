import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminBasePath, adminPanouPath } from "@/lib/admin-config";
import { readSessionFromRequest } from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith(adminPanouPath)) {
    return NextResponse.next();
  }
  if (!(await readSessionFromRequest(request))) {
    const url = request.nextUrl.clone();
    url.pathname = adminBasePath;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/parc-tabere-7qm2x9/panou/:path*"],
};
