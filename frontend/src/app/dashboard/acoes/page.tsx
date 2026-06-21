"use client";

import { useState } from "react";
import { AcaoForm } from "@/components/student/AcaoForm";
import { AcoesList } from "@/components/student/AcoesList";

export default function AcoesPage() {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setShowForm(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Ações Extensionistas</h1>
          <p className="mt-2 text-gray-600">
            Registre e acompanhe suas ações extensionistas
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          {showForm ? "Cancelar" : "Nova Ação"}
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Registrar Nova Ação
          </h2>
          <AcaoForm onSuccess={handleSuccess} />
        </div>
      )}

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Histórico de Ações
        </h2>
        <AcoesList key={refreshKey} />
      </div>
    </div>
  );
}