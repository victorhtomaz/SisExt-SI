"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface EstatisticasRelatorio {
  total_acoes: number;
  total_aprovadas: number;
  total_rejeitadas: number;
  total_horas: number;
  alunos_ativos: number;
  acoes_por_mes: Array<{
    mes: string;
    quantidade: number;
    horas: number;
  }>;
}

export function RelatoriosDashboard() {
  const [stats, setStats] = useState<EstatisticasRelatorio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/relatorios/estatisticas");
      setStats(response.data.data);
    } catch (err) {
      setError("Erro ao carregar relatórios");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Carregando...</div>;
  }

  if (error || !stats) {
    return <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>;
  }

  const approvalRate = stats.total_acoes > 0
    ? Math.round((stats.total_aprovadas / stats.total_acoes) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Ações"
          value={stats.total_acoes}
          color="bg-blue"
        />
        <StatCard
          title="Ações Aprovadas"
          value={stats.total_aprovadas}
          color="bg-green"
        />
        <StatCard
          title="Ações Rejeitadas"
          value={stats.total_rejeitadas}
          color="bg-red"
        />
        <StatCard
          title="Total de Horas"
          value={`${stats.total_horas}h`}
          color="bg-purple"
        />
      </div>

      {/* Estatísticas adicionais */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900">Taxa de Aprovação</h3>
          <div className="mt-4">
            <div className="text-4xl font-bold text-blue-600">{approvalRate}%</div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-blue-600"
                style={{ width: `${approvalRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900">Alunos Ativos</h3>
          <div className="mt-4">
            <div className="text-4xl font-bold text-green-600">
              {stats.alunos_ativos}
            </div>
            <p className="mt-2 text-sm text-gray-600">
              alunos com ações registradas
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico de ações por mês */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="text-lg font-semibold text-gray-900">Ações por Mês</h3>
        <div className="mt-4 space-y-3">
          {stats.acoes_por_mes.map((item) => (
            <div key={item.mes}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.mes}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {item.quantidade} ações ({item.horas}h)
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${(item.quantidade / 10) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botão para exportar relatório */}
      <button
        onClick={() => window.open("/api/relatorios/exportar")}
        className="w-full rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        Exportar Relatório (PDF)
      </button>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  color: string;
}

function StatCard({ title, value, color }: StatCardProps) {
  const bgColors: Record<string, string> = {
    "bg-blue": "bg-blue-100",
    "bg-green": "bg-green-100",
    "bg-red": "bg-red-100",
    "bg-purple": "bg-purple-100",
  };

  const textColors: Record<string, string> = {
    "bg-blue": "text-blue-600",
    "bg-green": "text-green-600",
    "bg-red": "text-red-600",
    "bg-purple": "text-purple-600",
  };

  return (
    <div className={`rounded-lg ${bgColors[color]} p-6 shadow`}>
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <p className={`mt-2 text-3xl font-bold ${textColors[color]}`}>{value}</p>
    </div>
  );
}