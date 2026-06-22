"use client";

import { CertificadosList } from "@/components/student/CertificadosList";

export default function CertificadosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meus Certificados</h1>
        <p className="mt-2 text-gray-600">
          Visualize e baixe seus certificados de ações extensionistas
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <CertificadosList />
      </div>
    </div>
  );
}