import type { Application } from "@prisma/client";
import { groupApplicationsBySlot } from "@/lib/applications-grouping";

const TABLE_HEAD = `
        <tr style="background:#edf3ff;">
          <th style="padding:8px;border:1px solid #d7e0ef;text-align:left;">Dată</th>
          <th style="padding:8px;border:1px solid #d7e0ef;text-align:left;">Copil</th>
          <th style="padding:8px;border:1px solid #d7e0ef;text-align:left;">Părinte</th>
          <th style="padding:8px;border:1px solid #d7e0ef;text-align:left;">Telefon</th>
          <th style="padding:8px;border:1px solid #d7e0ef;text-align:left;">E-mail</th>
          <th style="padding:8px;border:1px solid #d7e0ef;text-align:left;">Cod reducere</th>
        </tr>`;

function renderGroupSection(group: {
  ageCategory: string;
  series: string;
  applications: Application[];
}): string {
  const rowsHtml = group.applications
    .map(
      (r) => `
    <tr>
      <td style="padding:8px;border:1px solid #d7e0ef;">${escapeHtml(r.createdAt.toISOString().slice(0, 10))}</td>
      <td style="padding:8px;border:1px solid #d7e0ef;">${escapeHtml(r.childName)}</td>
      <td style="padding:8px;border:1px solid #d7e0ef;">${escapeHtml(r.parentName)}</td>
      <td style="padding:8px;border:1px solid #d7e0ef;">${escapeHtml(String(r.phone ?? ""))}</td>
      <td style="padding:8px;border:1px solid #d7e0ef;">${escapeHtml(r.email)}</td>
      <td style="padding:8px;border:1px solid #d7e0ef;">${escapeHtml(r.discountCode?.trim() ? r.discountCode : "—")}</td>
    </tr>`,
    )
    .join("");

  const tableBody =
    group.applications.length > 0
      ? rowsHtml
      : `<tr><td colspan="6" style="padding:12px;border:1px solid #d7e0ef;color:#536685;">Nu există înscrieri.</td></tr>`;

  return `
    <section style="margin-top:28px;">
      <h2 style="color:#1e315f;font-size:17px;margin:0 0 12px;line-height:1.45;">
        Grupa de vârstă: <strong>${escapeHtml(group.ageCategory)}</strong> —
        Perioada: <strong>${escapeHtml(group.series)}</strong>:
        <strong>${group.applications.length}</strong> înscrieri
      </h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px;">
        <thead>${TABLE_HEAD}</thead>
        <tbody>${tableBody}</tbody>
      </table>
    </section>`;
}

/**
 * HTML body: înscrieri grupate pe grupă de vârstă și perioadă.
 */
export function getDailyDigestEmailHtml(rows: Application[], dateLabel: string): string {
  const groups = groupApplicationsBySlot(rows);
  const sectionsHtml = groups.map(renderGroupSection).join("");

  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Segoe UI,sans-serif;color:#122647;background:#f4f7fc;padding:20px;">
  <div style="max-width:900px;margin:0 auto;background:#fff;border-radius:12px;padding:24px;border:1px solid #d7e0ef;">
    <h1 style="color:#1e315f;">Taberele Micilor Ingineri — rezumat înscrieri</h1>
    <p style="color:#536685;">Data raportului: <strong>${escapeHtml(dateLabel)}</strong></p>
    <p style="color:#536685;">Total înscrieri (în baza de date): <strong>${rows.length}</strong></p>
    ${sectionsHtml}
  </div>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
