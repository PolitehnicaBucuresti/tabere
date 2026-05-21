"use client";

import { useRouter, useParams } from "next/navigation";
import { AdminApplicationForm } from "../../../components/AdminApplicationForm";
import { adminPanouPath } from "@/lib/admin-config";
import "../../../admin.css";

export default function EditAplicatiePage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  return (
    <div>
      <h1 className="adminH1">Editează înscriere</h1>
      <div className="adminCard">
        <AdminApplicationForm
          mode="edit"
          applicationId={id}
          onSuccess={() => router.push(`${adminPanouPath}/aplicatii`)}
        />
      </div>
    </div>
  );
}
