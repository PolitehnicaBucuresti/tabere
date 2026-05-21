import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-api-guard";

const emailSchema = z.object({
  email: z.string().trim().email().max(254),
});

export async function GET(request: NextRequest) {
  const denied = await requireAdminSession(request);
  if (denied) return denied;

  const rows = await prisma.notificationRecipient.findMany({ orderBy: { email: "asc" } });
  return NextResponse.json(rows);
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

  const parsed = emailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "E-mail invalid." }, { status: 400 });
  }

  try {
    const row = await prisma.notificationRecipient.create({
      data: { email: parsed.data.email.toLowerCase() },
    });
    return NextResponse.json(row, { status: 201 });
  } catch {
    return NextResponse.json({ error: "E-mail deja în listă sau invalid." }, { status: 409 });
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdminSession(request);
  if (denied) return denied;

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Lipsește id." }, { status: 400 });
  }

  try {
    await prisma.notificationRecipient.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Nu există." }, { status: 404 });
  }
}
