import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { applicationsExportFilename, buildApplicationsExcelBuffer } from "@/lib/applications-export-xlsx";
import { getDailyDigestEmailHtml } from "@/lib/daily-digest-html";

function createSmtpTransporter() {
  const host = process.env.SMTP_HOST?.trim() || "relay.upb.ro";
  const port = Number.parseInt(process.env.SMTP_PORT?.trim() || "25", 10);
  const user = process.env.SMTP_USER?.trim() || "";
  const pass = process.env.SMTP_PASS?.trim() || "";

  const options: SMTPTransport.Options = {
    host,
    port,
    secure: port === 465,
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 15_000,
    tls: {
      rejectUnauthorized: false,
    },
  };

  if (port === 587) {
    options.secure = false;
    options.requireTLS = true;
  }

  if (user && pass) {
    options.auth = { user, pass };
  }

  return nodemailer.createTransport(options);
}

/**
 * Sends daily digest to all NotificationRecipient emails. Idempotent-friendly (call once per day).
 */
export async function runDailyDigestJob(): Promise<{ ok: true; sent: number } | { ok: false; error: string }> {
  try {
    const smtpFrom =
      process.env.SMTP_FROM_EMAIL?.trim() ||
      process.env.SMTP_USER?.trim() ||
      "";

    if (!smtpFrom) {
      return { ok: false, error: "Missing SMTP_FROM_EMAIL or SMTP_USER" };
    }

    const recipients = await prisma.notificationRecipient.findMany({ orderBy: { email: "asc" } });
    if (recipients.length === 0) {
      console.log("[daily-digest] No notification recipients configured; skipping send.");
      return { ok: true, sent: 0 };
    }

    const apps = await prisma.application.findMany({ orderBy: { createdAt: "desc" } });
    const now = new Date();
    const dateLabel = now.toLocaleString("ro-RO", { timeZone: "Europe/Bucharest", dateStyle: "full" });
    const html = getDailyDigestEmailHtml(apps, dateLabel);
    const subject = `[Taberele Micilor Ingineri] Rezumat zilnic înscrieri — ${now.toLocaleDateString("ro-RO", { timeZone: "Europe/Bucharest" })}`;
    const excelBuffer = await buildApplicationsExcelBuffer(apps);
    const excelFilename = applicationsExportFilename(now);

    const transporter = createSmtpTransporter();

    const toList = recipients.map((r) => r.email);
    await transporter.sendMail({
      from: `"Taberele Micilor Ingineri" <${smtpFrom}>`,
      to: smtpFrom,
      bcc: toList,
      subject,
      html,
      attachments: [
        {
          filename: excelFilename,
          content: excelBuffer,
          contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      ],
    });

    console.log("[daily-digest] Sent to", toList.length, "address(es).");
    return { ok: true, sent: toList.length };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[daily-digest]", e);
    return { ok: false, error: msg };
  }
}
