"use client";

import { RelatoriosDashboard } from "@/components/commission/RelatorioDashboard";

export default function RelatoriosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        <p className="mt-2 text-gray-600">
          Visualize estatísticas e gere relatórios das ações extensionistas
        </p>
      </div>

      <RelatoriosDashboard />
    </div>
  );
}