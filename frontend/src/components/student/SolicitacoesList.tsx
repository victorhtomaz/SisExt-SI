"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { StatusSolicitacao } from "@/types";

interface Solicitacao {
  id: string;
  acao_id: string;
  titulo_acao: string;
  horas_solicitadas: number;
  status: string;
  data_solicitacao: string;
  observacoes?: string;
}

export function SolicitacoesList() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSolicitacoes();
  }, []);

  const fetchSolicitacoes = async () => {
    try {
      const response = await api.get("/acoes-extensionistas/solicitacoes");
      setSolicitacoes(response.data.data || []);
    } catch (err) {
      setError("Erro ao carregar solicitações");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      [StatusSolicitacao.PENDENTE]: "bg-yellow-100 text-yellow-800",
      [StatusSolicitacao.APROVADO]: "bg-green-100 text-green-800",
      [StatusSolicitacao.REJEITADO]: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <div className="text-center text-gray-600">Carregando...</div>;
  }

  if (error) {
    return <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>;
  }

  if (solicitacoes.length === 0) {
    return (
      <div className="rounded-md bg-blue-50 p-4 text-center text-blue-700">
        Você não tem solicitações ainda.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {solicitacoes.map((solicitacao) => (
        <div
          key={solicitacao.id}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {solicitacao.titulo_acao}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {solicitacao.horas_solicitadas} horas solicitadas
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Solicitado em{" "}
                {new Date(solicitacao.data_solicitacao).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(solicitacao.status)}`}
            >
              {solicitacao.status}
            </span>
          </div>

          {solicitacao.observacoes && (
            <div className="mt-3 rounded-md bg-gray-50 p-3">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Observações:</span>{" "}
                {solicitacao.observacoes}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}