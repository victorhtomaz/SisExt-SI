"use client";

import { AvaliacoesList } from "@/components/commission/AvaliacoesList";

export default function AvaliacoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Avaliações Pendentes
        </h1>
        <p className="mt-2 text-gray-600">
          Avalie as solicitações de ações extensionistas dos alunos
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <AvaliacoesList />
      </div>
    </div>
  );
}