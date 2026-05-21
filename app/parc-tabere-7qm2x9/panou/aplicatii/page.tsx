"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Application } from "@prisma/client";
import { adminBasePath, adminPanouPath } from "@/lib/admin-config";
import "../../admin.css";

export default function AplicatiiListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/applications", { credentials: "include" });
      if (res.status === 401) {
        router.push(adminBasePath);
        return;
      }
      if (!res.ok) throw new Error("Nu s-au putut încărca înscrierile.");
      setRows(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Eroare");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const t = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(t);
  }, [load]);

  async function remove(id: string) {
    if (!confirm("Ștergi această înscriere?")) return;
    const res = await fetch(`/api/admin/applications/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      alert("Ștergerea a eșuat.");
      return;
    }
    void load();
  }

  return (
    <div>
      <h1 className="adminH1">Înscrieri</h1>
      <div className="adminToolbar">
        <Link href={`${adminPanouPath}/aplicatii/nou`}>Înscriere nouă</Link>
        <Link className="secondary" href="/api/admin/applications/export" prefetch={false}>
          Export Excel (.xlsx)
        </Link>
        <button
          type="button"
          className="secondary"
          style={{ border: "1px solid #cfe0ff", borderRadius: 10, padding: "0.45rem 0.85rem", cursor: "pointer" }}
          onClick={() => void load()}
        >
          Reîncarcă
        </button>
      </div>

      {error ? <p className="adminError">{error}</p> : null}
      {loading ? <p className="adminMuted">Se încarcă…</p> : null}

      {!loading && rows.length === 0 ? <p className="adminMuted">Nu există înscrieri.</p> : null}

      {!loading && rows.length > 0 ? (
        <div className="adminCard" style={{ overflowX: "auto" }}>
          <table className="adminTable">
            <thead>
              <tr>
                <th>Dată</th>
                <th>Copil</th>
                <th>Părinte</th>
                <th>E-mail</th>
                <th>Săptămână</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.createdAt).toLocaleString("ro-RO")}</td>
                  <td>{r.childName}</td>
                  <td>{r.parentName}</td>
                  <td>{r.email}</td>
                  <td>{r.series}</td>
                  <td>
                    <div className="adminTableActions">
                      <Link href={`${adminPanouPath}/aplicatii/${r.id}`}>Editează</Link>
                      <button type="button" className="danger" onClick={() => void remove(r.id)}>
                        Șterge
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
