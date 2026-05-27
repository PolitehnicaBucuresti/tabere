"use client";

import { useEffect, useState } from "react";
import { INSCRIPTION_AGE_CATEGORIES, INSCRIPTION_SERIES_OPTIONS } from "@/lib/inscription-constants";

function normalizeSeries(v: string) {
  const ok = (INSCRIPTION_SERIES_OPTIONS as readonly string[]).includes(v);
  return (ok ? v : INSCRIPTION_SERIES_OPTIONS[0]) as (typeof INSCRIPTION_SERIES_OPTIONS)[number];
}

function normalizeAgeCat(v: string) {
  const ok = (INSCRIPTION_AGE_CATEGORIES as readonly string[]).includes(v);
  return (ok ? v : INSCRIPTION_AGE_CATEGORIES[0]) as (typeof INSCRIPTION_AGE_CATEGORIES)[number];
}

export type AdminFormMode = "create" | "edit";

type Props = {
  mode: AdminFormMode;
  applicationId?: string;
  onSuccess?: () => void;
};

type FormState = {
  parentName: string;
  phone: string;
  email: string;
  childName: string;
  age: number;
  school: string;
  series: (typeof INSCRIPTION_SERIES_OPTIONS)[number];
  ageCategory: (typeof INSCRIPTION_AGE_CATEGORIES)[number];
  medicalInfo: string;
  childPassions: string;
  organizerNotes: string;
  discountCode: string;
  gdpr: boolean;
};

const empty: FormState = {
  parentName: "",
  phone: "",
  email: "",
  childName: "",
  age: 7,
  school: "",
  series: INSCRIPTION_SERIES_OPTIONS[0],
  ageCategory: INSCRIPTION_AGE_CATEGORIES[0],
  medicalInfo: "",
  childPassions: "",
  organizerNotes: "",
  discountCode: "",
  gdpr: false,
};

export function AdminApplicationForm({ mode, applicationId, onSuccess }: Props) {
  const [values, setValues] = useState<FormState>(empty);
  const [loading, setLoading] = useState(mode === "edit");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "edit" || !applicationId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/applications/${applicationId}`, { credentials: "include" });
        if (!res.ok) throw new Error("Nu s-au putut încărca datele.");
        const d = (await res.json()) as Record<string, unknown>;
        if (cancelled) return;
        setValues({
          parentName: String(d.parentName ?? ""),
          phone: String(d.phone ?? ""),
          email: String(d.email ?? ""),
          childName: String(d.childName ?? ""),
          age: Number(d.age ?? 7),
          school: String(d.school ?? ""),
          series: normalizeSeries(String(d.series ?? "")),
          ageCategory: normalizeAgeCat(String(d.ageCategory ?? "")),
          medicalInfo: String(d.medicalInfo ?? ""),
          childPassions: String(d.childPassions ?? ""),
          organizerNotes: String(d.organizerNotes ?? ""),
          discountCode: String(d.discountCode ?? ""),
          gdpr: Boolean(d.gdprAccepted),
        });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Eroare");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, applicationId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === "create" && !values.gdpr) {
      setError("Bifați acordul GDPR.");
      return;
    }

    try {
      if (mode === "create") {
        const res = await fetch("/api/admin/applications", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            parentName: values.parentName,
            phone: values.phone,
            email: values.email,
            childName: values.childName,
            age: values.age,
            school: values.school,
            series: values.series,
            ageCategory: values.ageCategory,
            medicalInfo: values.medicalInfo,
            childPassions: values.childPassions,
            organizerNotes: values.organizerNotes,
            discountCode: values.discountCode,
            gdpr: true,
          }),
        });
        if (!res.ok) {
          const j = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(j.error || "Nu s-a putut crea înscrierea.");
        }
        onSuccess?.();
        return;
      }

      if (!applicationId) return;
      const res = await fetch(`/api/admin/applications/${applicationId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName: values.parentName,
          phone: values.phone,
          email: values.email,
          childName: values.childName,
          age: values.age,
          school: values.school,
          series: values.series,
          ageCategory: values.ageCategory,
          medicalInfo: values.medicalInfo,
          childPassions: values.childPassions,
          organizerNotes: values.organizerNotes,
          discountCode: values.discountCode,
          gdprAccepted: values.gdpr,
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || "Actualizarea a eșuat.");
      }
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare");
    }
  }

  if (loading) {
    return <p className="adminMuted">Se încarcă…</p>;
  }

  return (
    <form className="adminForm" onSubmit={submit}>
      {error ? <p className="adminError">{error}</p> : null}

      <label className="adminField">
        <span>Nume părinte</span>
        <input
          required
          value={values.parentName}
          onChange={(ev) => setValues((s) => ({ ...s, parentName: ev.target.value }))}
        />
      </label>
      <label className="adminField">
        <span>Telefon</span>
        <input
          required
          value={values.phone}
          onChange={(ev) => setValues((s) => ({ ...s, phone: ev.target.value }))}
        />
      </label>
      <label className="adminField">
        <span>E-mail</span>
        <input
          type="email"
          required
          value={values.email}
          onChange={(ev) => setValues((s) => ({ ...s, email: ev.target.value }))}
        />
      </label>
      <label className="adminField">
        <span>Nume copil</span>
        <input
          required
          value={values.childName}
          onChange={(ev) => setValues((s) => ({ ...s, childName: ev.target.value }))}
        />
      </label>
      <label className="adminField">
        <span>Vârstă (5–11)</span>
        <input
          type="number"
          min={5}
          max={11}
          required
          value={values.age}
          onChange={(ev) => setValues((s) => ({ ...s, age: Number(ev.target.value) }))}
        />
      </label>
      <label className="adminField">
        <span>Școală</span>
        <input
          required
          value={values.school}
          onChange={(ev) => setValues((s) => ({ ...s, school: ev.target.value }))}
        />
      </label>
      <label className="adminField">
        <span>Săptămână</span>
        <select
          value={values.series}
          onChange={(ev) => setValues((s) => ({ ...s, series: normalizeSeries(ev.target.value) }))}
        >
          {INSCRIPTION_SERIES_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </label>
      <label className="adminField">
        <span>Grupă vârstă</span>
        <select
          value={values.ageCategory}
          onChange={(ev) => setValues((s) => ({ ...s, ageCategory: normalizeAgeCat(ev.target.value) }))}
        >
          {INSCRIPTION_AGE_CATEGORIES.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </label>
      <label className="adminField">
        <span>Alergii / informații medicale</span>
        <textarea
          required
          rows={4}
          value={values.medicalInfo}
          onChange={(ev) => setValues((s) => ({ ...s, medicalInfo: ev.target.value }))}
        />
      </label>
      <label className="adminField">
        <span>Pasiuni</span>
        <textarea
          required
          rows={4}
          value={values.childPassions}
          onChange={(ev) => setValues((s) => ({ ...s, childPassions: ev.target.value }))}
        />
      </label>
      <label className="adminField">
        <span>Mesaj pentru organizatori</span>
        <textarea
          required
          rows={4}
          value={values.organizerNotes}
          onChange={(ev) => setValues((s) => ({ ...s, organizerNotes: ev.target.value }))}
        />
      </label>
      <label className="adminField">
        <span>Cod de reducere</span>
        <input
          type="text"
          maxLength={120}
          value={values.discountCode}
          onChange={(ev) => setValues((s) => ({ ...s, discountCode: ev.target.value }))}
        />
      </label>

      {mode === "create" ? (
        <label className="adminCheck">
          <input
            type="checkbox"
            checked={values.gdpr}
            onChange={(ev) => setValues((s) => ({ ...s, gdpr: ev.target.checked }))}
          />
          <span>Confirm prelucrarea datelor (GDPR)</span>
        </label>
      ) : (
        <label className="adminCheck">
          <input
            type="checkbox"
            checked={values.gdpr}
            onChange={(ev) => setValues((s) => ({ ...s, gdpr: ev.target.checked }))}
          />
          <span>GDPR acceptat</span>
        </label>
      )}

      <button type="submit" className="adminBtnPrimary">
        {mode === "create" ? "Adaugă înscriere" : "Salvează modificările"}
      </button>
    </form>
  );
}
