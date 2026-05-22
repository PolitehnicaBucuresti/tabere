import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-api-guard";
import { applicationsExportFilename, buildApplicationsExcelBuffer } from "@/lib/applications-export-xlsx";

export async function GET(request: NextRequest) {
  const denied = await requireAdminSession(request);
  if (denied) return denied;

  const apps = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    take: 50000,
  });

  const buffer = await buildApplicationsExcelBuffer(apps);
  const filename = applicationsExportFilename();

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
    },
  });
}
