import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-api-guard";
import { INSCRIPTION_AGE_CATEGORIES, INSCRIPTION_SERIES_OPTIONS } from "@/lib/inscription-constants";

const patchSchema = z
  .object({
    parentName: z.string().trim().min(2).max(120).optional(),
    phone: z.string().trim().min(8).max(40).optional(),
    email: z.string().trim().email().max(254).optional(),
    childName: z.string().trim().min(2).max(120).optional(),
    age: z.number().int().min(5).max(11).optional(),
    school: z.string().trim().min(2).max(200).optional(),
    series: z.enum(INSCRIPTION_SERIES_OPTIONS).optional(),
    ageCategory: z.enum(INSCRIPTION_AGE_CATEGORIES).optional(),
    medicalInfo: z.string().trim().min(1).max(4000).optional(),
    childPassions: z.string().trim().min(1).max(4000).optional(),
    organizerNotes: z.string().trim().min(1).max(4000).optional(),
    gdprAccepted: z.boolean().optional(),
  })
  .strict();

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, ctx: Ctx) {
  const denied = await requireAdminSession(request);
  if (denied) return denied;

  const { id } = await ctx.params;
  const app = await prisma.application.findUnique({ where: { id } });
  if (!app) {
    return NextResponse.json({ error: "Nu există." }, { status: 404 });
  }
  return NextResponse.json(app);
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const denied = await requireAdminSession(request);
  if (denied) return denied;

  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalid." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Date invalide.", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const app = await prisma.application.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json(app);
  } catch {
    return NextResponse.json({ error: "Actualizare eșuată." }, { status: 404 });
  }
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  const denied = await requireAdminSession(request);
  if (denied) return denied;

  const { id } = await ctx.params;

  try {
    await prisma.application.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Ștergere eșuată." }, { status: 404 });
  }
}
