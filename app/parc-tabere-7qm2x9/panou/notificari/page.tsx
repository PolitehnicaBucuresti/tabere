"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminBasePath } from "@/lib/admin-config";
import "../../admin.css";

type Row = { id: string; email: string; createdAt: string };

export default function NotificariPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/notifications", { credentials: "include" });
      if (res.status === 401) {
        router.push(adminBasePath);
        return;
      }
      if (!res.ok) throw new Error("Nu s-au putut încărca adresele.");
      const data = (await res.json()) as Row[];
      setRows(data);
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

  async function add(ev: React.FormEvent) {
    ev.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/notifications", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setError(j.error || "Nu s-a putut adăuga.");
      return;
    }
    setEmail("");
    void load();
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/notifications?id=${encodeURIComponent(id)}`, {
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
      <h1 className="adminH1">Notificări zilnice</h1>
      <p className="adminMuted" style={{ marginBottom: "1rem" }}>
        La ora <strong>09:00</strong> (Europe/Bucharest), serverul trimite automat un e-mail cu lista completă a
        înscrierilor către toate adresele de mai jos (necesită SMTP configurat, ca pentru formularul public).
      </p>

      <div className="adminCard">
        <h2 style={{ fontSize: "1.05rem", marginBottom: "0.75rem" }}>Adaugă destinar</h2>
        <form className="adminRow" onSubmit={add}>
          <input
            type="email"
            required
            placeholder="email@exemplu.ro"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="adminBtnPrimary" style={{ marginTop: 0 }}>
            Adaugă
          </button>
        </form>
        {error ? <p className="adminError" style={{ marginTop: "0.75rem" }}>{error}</p> : null}
      </div>

      <div className="adminCard">
        <h2 style={{ fontSize: "1.05rem", marginBottom: "0.75rem" }}>Listă destinatari</h2>
        {loading ? <p className="adminMuted">Se încarcă…</p> : null}
        {!loading && rows.length === 0 ? <p className="adminMuted">Niciun destinatar — nu se trimite raportul.</p> : null}
        {!loading && rows.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {rows.map((r) => (
              <li
                key={r.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid #e2e8f5",
                }}
              >
                <span>{r.email}</span>
                <button
                  type="button"
                  className="danger"
                  style={{
                    border: "1px solid #fecaca",
                    background: "#fef2f2",
                    color: "#b91c1c",
                    borderRadius: 8,
                    padding: "0.25rem 0.5rem",
                    cursor: "pointer",
                  }}
                  onClick={() => void remove(r.id)}
                >
                  Elimină
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
