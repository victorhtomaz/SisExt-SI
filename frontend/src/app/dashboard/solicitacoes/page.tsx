"use client";

import { SolicitacoesList } from "@/components/student/SolicitacoesList";

export default function SolicitacoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Solicitações</h1>
        <p className="mt-2 text-gray-600">
          Acompanhe o status de suas solicitações de horas extensionistas
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <SolicitacoesList />
      </div>
    </div>
  );
}