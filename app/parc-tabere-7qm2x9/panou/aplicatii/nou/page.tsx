"use client";

import { useRouter } from "next/navigation";
import { AdminApplicationForm } from "../../../components/AdminApplicationForm";
import { adminPanouPath } from "@/lib/admin-config";
import "../../../admin.css";

export default function NouAplicatiePage() {
  const router = useRouter();
  return (
    <div>
      <h1 className="adminH1">Înscriere nouă</h1>
      <div className="adminCard">
        <AdminApplicationForm
          mode="create"
          onSuccess={() => router.push(`${adminPanouPath}/aplicatii`)}
        />
      </div>
    </div>
  );
}
