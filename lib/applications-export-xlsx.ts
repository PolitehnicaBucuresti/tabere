import ExcelJS from "exceljs";
import type { Application } from "@prisma/client";
import {
  buildRegistrationRankByApplicationId,
  resolveRegistrationStatus,
} from "@/lib/application-registration-status";

/** Same workbook as admin „Export Excel” — used by the API route and daily digest e-mail. */
export async function buildApplicationsExcelBuffer(apps: Application[]): Promise<Buffer> {
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
    "Cod reducere",
    "Status înscriere",
    "GDPR",
  ] as const;

  ws.addRow([...headers]);
  ws.getRow(1).font = { bold: true };

  const rankById = buildRegistrationRankByApplicationId(apps);

  for (const r of apps) {
    const createdAt =
      r.createdAt instanceof Date ? r.createdAt.toISOString() : new Date(r.createdAt).toISOString();
    ws.addRow([
      r.id,
      createdAt,
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
      r.discountCode || "",
      resolveRegistrationStatus(r, rankById),
      r.gdprAccepted ? "Da" : "Nu",
    ]);
  }

  ws.columns.forEach((col) => {
    col.width = 18;
  });

  const raw = await wb.xlsx.writeBuffer();
  return Buffer.from(raw);
}

export function applicationsExportFilename(forDate: Date = new Date()): string {
  return `inscrieri-tmi-${forDate.toISOString().slice(0, 10)}.xlsx`;
}
