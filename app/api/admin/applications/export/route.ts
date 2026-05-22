import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-api-guard";

export async function GET(request: NextRequest) {
  const denied = await requireAdminSession(request);
  if (denied) return denied;

  const apps = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    take: 50000,
  });

  const wb = new ExcelJS.Workbook();
  wb.creator = "Taberele Micilor Ingineri";
  const ws = wb.addWorksheet("Înscrieri", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  const headers = [
    "ID",
    "Creat la",
    "Părinte",
    "Telefon",
    "E-mail",
    "Copil",
    "Vârstă",
    "Școală",
    "Săptămână",
    "Grupă vârstă",
    "Alergii / medical",
    "Pasiuni",
    "Mesaj organizatori",
    "GDPR",
  ] as const;

  ws.addRow([...headers]);
  ws.getRow(1).font = { bold: true };

  for (const r of apps) {
    ws.addRow([
      r.id,
      r.createdAt.toISOString(),
      r.parentName,
      r.phone,
      r.email,
      r.childName,
      r.age,
      r.school,
      r.series,
      r.ageCategory,
      r.medicalInfo,
      r.childPassions,
      r.organizerNotes,
      r.gdprAccepted ? "Da" : "Nu",
    ]);
  }

  ws.columns.forEach((col) => {
    col.width = 18;
  });

  const buffer = await wb.xlsx.writeBuffer();

  const filename = `inscrieri-polisc-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
    },
  });
}
