import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-api-guard";
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
  const app = await prisma.application.create({
    data: {
      parentName: d.parentName,
      phone: d.phone,
      email: d.email,
      childName: d.childName,
      age: d.age,
      school: d.school,
      series: d.series,
      ageCategory: d.ageCategory,
      medicalInfo: d.medicalInfo,
      childPassions: d.childPassions,
      organizerNotes: d.organizerNotes,
      discountCode: d.discountCode,
      gdprAccepted: true,
    },
  });

  return NextResponse.json(app, { status: 201 });
}
