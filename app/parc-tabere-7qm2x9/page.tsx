"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminPanouPath } from "@/lib/admin-config";
import "./admin.css";

function AdminLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || `${adminPanouPath}/`;
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || "Autentificare eșuată.");
      }
      router.push(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="adminWrap">
      <main className="adminMain" style={{ maxWidth: 440 }}>
        <div className="adminCard">
          <h1 className="adminH1">Acces panou înscrieri</h1>
          <p className="adminMuted">Introduceți parola pentru a continua.</p>
          <form className="adminForm" onSubmit={onSubmit} style={{ marginTop: "1rem" }}>
            {error ? <p className="adminError">{error}</p> : null}
            <label className="adminField">
              <span>Parolă</span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="adminBtnPrimary" disabled={loading}>
              {loading ? "Se verifică…" : "Intră"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="adminWrap adminMuted">Se încarcă…</div>}>
      <AdminLoginInner />
    </Suspense>
  );
}
