import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-api-guard";
import { createInscriptionApplication } from "@/lib/inscription-capacity";
import { INSCRIPTION_SLOT_FULL_MESSAGE } from "@/lib/inscription-constants";
import { inscriptionPayloadSchema } from "@/lib/inscription-schema";

export async function GET(request: NextRequest) {
  const denied = await requireAdminSession(request);
  if (denied) return denied;

  const apps = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    take: 2000,
  });
  return NextResponse.json(apps);
}

export async function POST(request: NextRequest) {
  const denied = await requireAdminSession(request);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalid." }, { status: 400 });
  }

  const parsed = inscriptionPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Date invalide.", details: parsed.error.flatten() }, { status: 400 });
  }

  const d = parsed.data;
  const saved = await createInscriptionApplication(d);
  if (!saved.ok) {
    return NextResponse.json({ error: INSCRIPTION_SLOT_FULL_MESSAGE, code: "SLOT_FULL" }, { status: 409 });
  }
  const app = await prisma.application.findUniqueOrThrow({ where: { id: saved.applicationId } });

  return NextResponse.json(app, { status: 201 });
}
