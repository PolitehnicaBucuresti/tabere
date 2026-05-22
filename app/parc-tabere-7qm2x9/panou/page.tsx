import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { adminPanouPath } from "@/lib/admin-config";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Panou înscrieri — Taberele Micilor Ingineri",
  robots: { index: false, follow: false },
};

export default async function PanouHomePage() {
  const [nApps, nNotify] = await Promise.all([
    prisma.application.count(),
    prisma.notificationRecipient.count(),
  ]);

  return (
    <div>
      <h1 className="adminH1">Panou</h1>
      <p className="adminMuted" style={{ marginBottom: "1rem" }}>
        Bine ai venit. Rezumat rapid din baza de date.
      </p>
      <div className="adminCard">
        <p>
          <strong>{nApps}</strong> înscrieri înregistrate
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          <strong>{nNotify}</strong> destinatari pentru raportul zilnic (e-mail)
        </p>
        <div className="adminToolbar" style={{ marginTop: "1rem", marginBottom: 0 }}>
          <Link href={`${adminPanouPath}/aplicatii`}>Gestionează înscrieri</Link>
          <Link className="secondary" href={`${adminPanouPath}/notificari`}>
            Notificări zilnice
          </Link>
        </div>
      </div>
      <p className="adminMuted" style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
        Raportul automat la ora 09:00 (Europe/Bucharest) trimite lista completă a înscrierilor către
        adresele configurate. Pentru test manual, folosiți API-ul cu <code>CRON_SECRET</code>.
      </p>
    </div>
  );
}
