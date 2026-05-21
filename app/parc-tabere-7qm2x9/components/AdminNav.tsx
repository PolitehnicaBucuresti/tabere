"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminBasePath, adminPanouPath } from "@/lib/admin-config";

export function AdminNav() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST", credentials: "include" });
    router.push(adminBasePath);
    router.refresh();
  }

  return (
    <header className="adminNav">
      <Link href={adminPanouPath} className="adminNavBrand">
        Panou înscrieri
      </Link>
      <nav className="adminNavLinks">
        <Link href={`${adminPanouPath}/aplicatii`}>Înscrieri</Link>
        <Link href={`${adminPanouPath}/notificari`}>Notificări zilnice</Link>
        <button type="button" className="adminNavLogout" onClick={() => void logout()}>
          Ieșire
        </button>
      </nav>
    </header>
  );
}
