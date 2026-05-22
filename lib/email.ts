import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { InscriptionPayload } from "./inscription-schema";

/** Strip characters that break SMTP headers or MIME display-name wrapping. */
function sanitizeHeaderDisplayName(value: string, max = 72): string {
  return value.replace(/[\r\n<>]/g, " ").replace(/"/g, "'").trim().slice(0, max);
}

function sanitizeSubjectPart(value: string, max = 100): string {
  return value.replace(/[\r\n]/g, " ").trim().slice(0, max);
}

/** Escape user-provided text embedded in HTML e-mail bodies */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function htmlMultiline(text: string): string {
  return escapeHtml(text).replace(/\n/g, "<br>");
}

/** Trim, drop empties, dedupe addresses case-insensitively (for To/Cc). */
function uniqueRecipientList(...emails: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of emails) {
    const e = raw.trim();
    if (!e) continue;
    const key = e.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(e);
  }
  return out;
}

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

  // Port 587 expects STARTTLS (plain socket first); 465 is implicit TLS.
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
 * Generate a beautifully styled, premium HTML email for the administrator.
 */
function getAdminEmailHtml(data: InscriptionPayload): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Înscriere nouă - Taberele Micilor Ingineri</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f7fc;
          color: #122647;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(31, 56, 112, 0.08);
          border: 1px solid #d7e0ef;
        }
        .header {
          background: linear-gradient(135deg, #1e315f 0%, #2e4d8d 100%);
          padding: 35px 25px;
          text-align: center;
          color: #ffffff;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
        .header p {
          margin: 8px 0 0 0;
          font-size: 14px;
          color: #e2e8f5;
          opacity: 0.9;
        }
        .content {
          padding: 30px 25px;
        }
        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #3f5ea8;
          border-bottom: 2px solid #eef3fb;
          padding-bottom: 8px;
          margin-top: 25px;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .section-title:first-of-type {
          margin-top: 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        th, td {
          padding: 12px 10px;
          text-align: left;
          font-size: 14px;
          border-bottom: 1px solid #eef3fb;
        }
        th {
          width: 35%;
          color: #536685;
          font-weight: 600;
        }
        td {
          color: #122647;
          font-weight: 500;
        }
        .medical-box {
          background-color: #fff9f0;
          border-left: 4px solid #ff9800;
          padding: 15px;
          border-radius: 4px 8px 8px 4px;
          font-size: 14px;
          color: #b7791f;
          line-height: 1.5;
          margin-top: 10px;
        }
        .medical-box-none {
          background-color: #f4fbf7;
          border-left: 4px solid #2d9d95;
          padding: 12px 15px;
          border-radius: 4px 8px 8px 4px;
          font-size: 14px;
          color: #1e6b65;
          margin-top: 10px;
        }
        .footer {
          background-color: #eef3fb;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #536685;
          border-top: 1px solid #d7e0ef;
        }
        .footer p {
          margin: 5px 0;
        }
        .badge {
          display: inline-block;
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 20px;
          background-color: #eef3fb;
          color: #3f5ea8;
          border: 1px solid #cfe0ff;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Înscriere Taberele Micilor Ingineri</h1>
          <p>Notificare automată de înregistrare în sistem</p>
        </div>
        <div class="content">
          <div class="section-title">Informații Program</div>
          <table>
            <tr>
              <th>Categorie vârstă</th>
              <td><span class="badge">${escapeHtml(data.ageCategory)}</span></td>
            </tr>
            <tr>
              <th>Seria aleasă</th>
              <td><strong>${escapeHtml(data.series)}</strong></td>
            </tr>
          </table>

          <div class="section-title">Date copil</div>
          <table>
            <tr>
              <th>Nume copil</th>
              <td>${escapeHtml(data.childName)}</td>
            </tr>
            <tr>
              <th>Vârstă</th>
              <td>${data.age} ani</td>
            </tr>
            <tr>
              <th>Școală</th>
              <td>${escapeHtml(data.school)}</td>
            </tr>
          </table>

          <div class="section-title">Date părinte</div>
          <table>
            <tr>
              <th>Nume părinte</th>
              <td>${escapeHtml(data.parentName)}</td>
            </tr>
            <tr>
              <th>Telefon</th>
              <td><a href="tel:${escapeHtml(data.phone)}" style="color: #3f5ea8; text-decoration: none;">${escapeHtml(data.phone)}</a></td>
            </tr>
            <tr>
              <th>E-mail</th>
              <td><a href="mailto:${escapeHtml(data.email)}" style="color: #3f5ea8; text-decoration: none;">${escapeHtml(data.email)}</a></td>
            </tr>
          </table>

          <div class="section-title">Informații medicale / alergii</div>
          ${
            data.medicalInfo && data.medicalInfo.toLowerCase() !== "nu" && data.medicalInfo.trim() !== "-"
              ? `<div class="medical-box">${htmlMultiline(data.medicalInfo)}</div>`
              : `<div class="medical-box-none">Nu sunt raportate probleme medicale, alergii sau afecțiuni.</div>`
          }

          <div class="section-title">Pasiuni ale copilului</div>
          <div class="medical-box" style="border-left-color: #3f5ea8;">
            ${htmlMultiline(data.childPassions)}
          </div>

          <div class="section-title">Mesaj către organizatori</div>
          <div class="medical-box" style="border-left-color: #5b6ed6;">
            ${htmlMultiline(data.organizerNotes)}
          </div>

          <div class="section-title">Acorduri</div>
          <table>
            <tr>
              <th>Acord GDPR</th>
              <td>✅ Da, consimțământ acordat</td>
            </tr>
          </table>
        </div>
        <div class="footer">
          <p>Acest e-mail a fost trimis automat de Taberele Micilor Ingineri.</p>
          <p>&copy; ${new Date().getFullYear()} Universitatea Națională de Științe și Tehnologie POLITEHNICA București</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate a beautifully styled, premium HTML confirmation email for the parent.
 */
function getParentConfirmationHtml(data: InscriptionPayload): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmare primire cerere - Taberele Micilor Ingineri</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f7fc;
          color: #122647;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(31, 56, 112, 0.08);
          border: 1px solid #d7e0ef;
        }
        .header {
          background: linear-gradient(135deg, #2e4d8d 0%, #3f5ea8 100%);
          padding: 40px 25px;
          text-align: center;
          color: #ffffff;
        }
        .header h1 {
          margin: 0;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.12);
        }
        .header p {
          margin: 8px 0 0 0;
          font-size: 15px;
          color: #e8efff;
        }
        .content {
          padding: 30px 25px;
          line-height: 1.6;
        }
        .greeting {
          font-size: 17px;
          font-weight: 700;
          color: #1e315f;
          margin-bottom: 15px;
        }
        .intro-text {
          font-size: 15px;
          color: #536685;
          margin-bottom: 25px;
        }
        .details-card {
          background-color: #f8faff;
          border: 1px solid #e2e8f5;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 25px;
        }
        .details-title {
          font-weight: 700;
          color: #2e4d8d;
          font-size: 15px;
          margin-bottom: 12px;
          border-bottom: 1px solid #e2e8f5;
          padding-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .details-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px dashed #eef3fb;
          font-size: 14px;
        }
        .details-row:last-child {
          border-bottom: none;
        }
        .details-label {
          color: #536685;
          font-weight: 600;
        }
        .details-value {
          color: #122647;
          font-weight: 700;
          text-align: right;
        }
        .parent-note-block {
          padding: 10px 0;
          border-bottom: 1px dashed #eef3fb;
        }
        .parent-note-block-last {
          border-bottom: none;
        }
        .parent-note-label {
          font-weight: 700;
          color: #536685;
          font-size: 13px;
          margin-bottom: 6px;
        }
        .parent-note-body {
          font-size: 14px;
          color: #122647;
          line-height: 1.55;
        }
        .steps {
          margin-top: 25px;
          margin-bottom: 25px;
        }
        .steps-title {
          font-size: 16px;
          font-weight: 700;
          color: #122647;
          margin-bottom: 15px;
        }
        .step-item {
          display: flex;
          margin-bottom: 15px;
        }
        .step-number {
          background-color: #edf3ff;
          color: #3f5ea8;
          font-weight: 700;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          flex-shrink: 0;
          font-size: 14px;
          border: 1px solid #cfe0ff;
        }
        .step-content {
          font-size: 14px;
          color: #536685;
          padding-top: 3px;
        }
        .step-content strong {
          color: #122647;
        }
        .cta-box {
          background: linear-gradient(135deg, #edf4ff 0%, #e2e8f5 100%);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #2e4d8d;
          font-weight: 600;
          border: 1px solid #d7e0ef;
          margin-top: 30px;
        }
        .footer {
          background-color: #eef3fb;
          padding: 25px 20px;
          text-align: center;
          font-size: 12px;
          color: #536685;
          border-top: 1px solid #d7e0ef;
        }
        .footer p {
          margin: 5px 0;
        }
        .footer a {
          color: #3f5ea8;
          text-decoration: none;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Taberele Micilor Ingineri</h1>
          <p>Cerere de înscriere înregistrată cu succes</p>
        </div>
        <div class="content">
          <div class="greeting">Dragă ${escapeHtml(data.parentName)},</div>
          <div class="intro-text">
            Vă mulțumim pentru interesul acordat taberei de vară <strong>Taberele Micilor Ingineri</strong>! 
            Am primit cu succes cererea dvs. de înscriere pentru copilul <strong>${escapeHtml(data.childName)}</strong>. 
            Mai jos găsiți rezumatul detaliilor transmise:
          </div>

          <div class="details-card">
            <div class="details-title">Rezumat înscriere</div>
            <div class="details-row">
              <span class="details-label">Nume copil:</span>
              <span class="details-value">${escapeHtml(data.childName)}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Vârstă copil:</span>
              <span class="details-value">${data.age} ani</span>
            </div>
            <div class="details-row">
              <span class="details-label">Categorie de vârstă:</span>
              <span class="details-value">${escapeHtml(data.ageCategory)}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Săptămâna aleasă:</span>
              <span class="details-value">${escapeHtml(data.series)}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Școala copilului:</span>
              <span class="details-value">${escapeHtml(data.school)}</span>
            </div>
          </div>

          <div class="details-card">
            <div class="details-title">Informații medicale și mesaje</div>
            <div class="parent-note-block">
              <div class="parent-note-label">Alergii sau afecțiuni medicale</div>
              <div class="parent-note-body">${htmlMultiline(data.medicalInfo)}</div>
            </div>
            <div class="parent-note-block">
              <div class="parent-note-label">Pasiunile copilului</div>
              <div class="parent-note-body">${htmlMultiline(data.childPassions)}</div>
            </div>
            <div class="parent-note-block parent-note-block-last">
              <div class="parent-note-label">Mesaj către organizatori</div>
              <div class="parent-note-body">${htmlMultiline(data.organizerNotes)}</div>
            </div>
          </div>

          <div class="details-card">
            <div class="details-title">Datele dumneavoastră de contact</div>
            <div class="details-row">
              <span class="details-label">Nume părinte:</span>
              <span class="details-value">${escapeHtml(data.parentName)}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Telefon:</span>
              <span class="details-value">${escapeHtml(data.phone)}</span>
            </div>
            <div class="details-row">
              <span class="details-label">E-mail:</span>
              <span class="details-value">${escapeHtml(data.email)}</span>
            </div>
          </div>

          <div class="steps">
            <div class="steps-title">Ce urmează după trimitere?</div>
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-content">
                <strong>Verificarea locurilor:</strong> Echipa noastră va analiza disponibilitatea locurilor pentru seria selectată.
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-content">
                <strong>Validarea telefonică:</strong> Vă vom contacta în scurt timp pentru validare și confirmare finală.
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-content">
                <strong>Plata și documentele:</strong> După confirmare, veți primi pe e-mail link-ul de plată securizat și instrucțiunile suplimentare pentru documentele fizice necesare la sosire.
              </div>
            </div>
          </div>

          <div class="cta-box">
            Ne bucurăm să vă avem alături în această vară plină de descoperiri și aventuri științifice!
          </div>
        </div>
        <div class="footer">
          <p>Dacă aveți întrebări, ne puteți contacta la adresa <a href="mailto:marketing@upb.ro">marketing@upb.ro</a>.</p>
          <p>&copy; ${new Date().getFullYear()} Universitatea Națională de Științe și Tehnologie POLITEHNICA București</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Sends a registration email.
 * This will send:
 * 1. A notification with full application data to CONTACT_FORM_TO_EMAIL (default online.team@upb.ro)
 *    and always to marketing@upb.ro for review (override via INSCRIPTION_MARKETING_REVIEW_EMAIL).
 * 2. A confirmation email to the parent (data.email).
 */
export async function sendInscriptionEmails(data: InscriptionPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const smtpFrom =
      process.env.SMTP_FROM_EMAIL?.trim() ||
      process.env.SMTP_USER?.trim() ||
      "";
    const adminInbox =
      process.env.CONTACT_FORM_TO_EMAIL?.trim() || "online.team@upb.ro";
    const marketingReviewEmail =
      process.env.INSCRIPTION_MARKETING_REVIEW_EMAIL?.trim() || "marketing@upb.ro";

    if (!smtpFrom) {
      return {
        success: false,
        error: "Lipsește SMTP_FROM_EMAIL sau SMTP_USER în configurare.",
      };
    }

    const adminRecipients = uniqueRecipientList(adminInbox, marketingReviewEmail);
    if (adminRecipients.length === 0) {
      return {
        success: false,
        error: "Nu există destinatari pentru notificarea administratorului.",
      };
    }

    const transporter = createSmtpTransporter();

    const safeParentName = sanitizeHeaderDisplayName(data.parentName);
    const safeChildName = sanitizeSubjectPart(data.childName);

    // 1. Staff notification (same HTML body to every recipient — full form data)
    const adminMailOptions = {
      from: `"${safeParentName} via Taberele Micilor Ingineri" <${smtpFrom}>`,
      to: adminRecipients,
      subject: `[Înscriere Nouă] ${safeChildName} - ${data.ageCategory} - ${data.series}`,
      html: getAdminEmailHtml(data),
      replyTo: data.email,
    };

    // 2. Parent confirmation
    const parentMailOptions = {
      from: `"Taberele Micilor Ingineri" <${smtpFrom}>`,
      to: data.email,
      subject: `Înscriere înregistrată - Taberele Micilor Ingineri (${safeChildName})`,
      html: getParentConfirmationHtml(data),
    };

    // Sequential delivery — some relays reject parallel MAIL FROM on one connection.
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(parentMailOptions);

    console.log("Inscription emails sent (staff + parent).", { staff: adminRecipients });

    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to send SMTP emails:", error);
    const message =
      error instanceof Error ? error.message : "Eroare necunoscută la trimiterea e-mailului prin SMTP.";
    return {
      success: false,
      error: message,
    };
  }
}
