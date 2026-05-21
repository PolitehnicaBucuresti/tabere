import type { ReactNode } from "react";
import { AdminNav } from "../components/AdminNav";
import "../admin.css";

export default function PanouLayout({ children }: { children: ReactNode }) {
  return (
    <div className="adminWrap">
      <AdminNav />
      <main className="adminMain">{children}</main>
    </div>
  );
}
