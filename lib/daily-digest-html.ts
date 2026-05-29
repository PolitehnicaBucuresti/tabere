import type { Application } from "@prisma/client";

/**
 * HTML body: summary list of applications for daily digest email.
 */
export function getDailyDigestEmailHtml(rows: Application[], dateLabel: string): string {
  const rowsHtml = rows
    .map(
      (r) => `
    <tr>
      <td style="padding:8px;border:1px solid #d7e0ef;">${escapeHtml(r.createdAt.toISOString().slice(0, 10))}</td>
      <td style="padding:8px;border:1px solid #d7e0ef;">${escapeHtml(r.childName)}</td>
      <td style="padding:8px;border:1px solid #d7e0ef;">${escapeHtml(r.parentName)}</td>
      <td style="padding:8px;border:1px solid #d7e0ef;">${escapeHtml(String(r.phone ?? ""))}</td>
      <td style="padding:8px;border:1px solid #d7e0ef;">${escapeHtml(r.email)}</td>
      <td style="padding:8px;border:1px solid #d7e0ef;">${escapeHtml(r.series)}</td>
      <td style="padding:8px;border:1px solid #d7e0ef;">${escapeHtml(r.ageCategory)}</td>
      <td style="padding:8px;border:1px solid #d7e0ef;">${escapeHtml(r.discountCode || "—")}</td>
      <td style="padding:8px;border:1px solid #d7e0ef;">${r.waitlisted ? "Da" : "Nu"}</td>
    </tr>`,
    )
    .join("");

  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Segoe UI,sans-serif;color:#122647;background:#f4f7fc;padding:20px;">
  <div style="max-width:900px;margin:0 auto;background:#fff;border-radius:12px;padding:24px;border:1px solid #d7e0ef;">
    <h1 style="color:#1e315f;">Taberele Micilor Ingineri — rezumat înscrieri</h1>
    <p style="color:#536685;">Data raportului: <strong>${escapeHtml(dateLabel)}</strong></p>
    <p style="color:#536685;">Total înscrieri (în baza de date): <strong>${rows.length}</strong></p>
    <table style="border-collapse:collapse;width:100%;font-size:14px;margin-top:16px;">
      <thead>
        <tr style="background:#edf3ff;">
          <th style="padding:8px;border:1px solid #d7e0ef;text-align:left;">Dată</th>
          <th style="padding:8px;border:1px solid #d7e0ef;text-align:left;">Copil</th>
          <th style="padding:8px;border:1px solid #d7e0ef;text-align:left;">Părinte</th>
          <th style="padding:8px;border:1px solid #d7e0ef;text-align:left;">Telefon</th>
          <th style="padding:8px;border:1px solid #d7e0ef;text-align:left;">E-mail</th>
          <th style="padding:8px;border:1px solid #d7e0ef;text-align:left;">Săptămână</th>
          <th style="padding:8px;border:1px solid #d7e0ef;text-align:left;">Grupă</th>
          <th style="padding:8px;border:1px solid #d7e0ef;text-align:left;">Cod reducere</th>
          <th style="padding:8px;border:1px solid #d7e0ef;text-align:left;">Listă așteptare</th>
        </tr>
      </thead>
      <tbody>${rowsHtml || `<tr><td colspan="10" style="padding:12px;">Nu există înscrieri în baza de date.</td></tr>`}</tbody>
    </table>
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
