import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readSessionFromRequest } from "./admin-auth";

export async function requireAdminSession(request: NextRequest): Promise<NextResponse | null> {
  if (!(await readSessionFromRequest(request))) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 401 });
  }
  return null;
}
