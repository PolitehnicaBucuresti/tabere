"use client";

import Link from "next/link";
import type { Application } from "@prisma/client";
import { groupApplicationsBySlot } from "@/lib/applications-grouping";
import { adminPanouPath } from "@/lib/admin-config";

type Props = {
  rows: Application[];
  onRemove: (id: string) => void;
};

export function AdminApplicationsGrouped({ rows, onRemove }: Props) {
  const groups = groupApplicationsBySlot(rows);

  return (
    <div className="adminGroupedList">
      {groups.map((group) => (
        <section key={`${group.ageCategory}-${group.series}`} className="adminCard adminGroupSection">
          <h2 className="adminGroupHeading">
            Grupa de vârstă: <strong>{group.ageCategory}</strong> — Perioada:{" "}
            <strong>{group.series}</strong>: <strong>{group.applications.length}</strong> înscrieri
          </h2>

          {group.applications.length === 0 ? (
            <p className="adminMuted adminGroupEmpty">Nu există înscrieri pentru această combinație.</p>
          ) : (
            <div className="adminTableWrap">
              <table className="adminTable">
                <thead>
                  <tr>
                    <th className="adminTableNr">Nr.</th>
                    <th>Dată</th>
                    <th>Copil</th>
                    <th>Părinte</th>
                    <th>Telefon</th>
                    <th>E-mail</th>
                    <th>Cod reducere</th>
                    <th>Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {group.applications.map((r, i) => (
                    <tr key={r.id}>
                      <td className="adminTableNr">{i + 1}</td>
                      <td>{new Date(r.createdAt).toLocaleString("ro-RO")}</td>
                      <td>{r.childName}</td>
                      <td>{r.parentName}</td>
                      <td>{r.phone}</td>
                      <td>{r.email}</td>
                      <td>{r.discountCode?.trim() ? r.discountCode : "—"}</td>
                      <td>
                        <div className="adminTableActions">
                          <Link href={`${adminPanouPath}/aplicatii/${r.id}`}>Editează</Link>
                          <button type="button" className="danger" onClick={() => onRemove(r.id)}>
                            Șterge
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
