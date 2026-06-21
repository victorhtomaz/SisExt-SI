"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { AcaoExtensionista, StatusSolicitacao } from "@/types";

export function AcoesList() {
  const [acoes, setAcoes] = useState<AcaoExtensionista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAcoes();
  }, []);

  const fetchAcoes = async () => {
    try {
      const response = await api.get("/acoes-extensionistas");
      setAcoes(response.data.data || []);
    } catch (err) {
      setError("Erro ao carregar ações");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case StatusSolicitacao.APROVADO:
        return "bg-green-100 text-green-800";
      case StatusSolicitacao.REJEITADO:
        return "bg-red-100 text-red-800";
      case StatusSolicitacao.PENDENTE:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Carregando...</div>;
  }

  if (error) {
    return <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>;
  }

  if (acoes.length === 0) {
    return (
      <div className="rounded-md bg-blue-50 p-4 text-center text-blue-700">
        Você não tem ações registradas ainda. Registre sua primeira ação!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full rounded-lg bg-white shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Título
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Data
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Horas
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Ação
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {acoes.map((acao) => (
            <tr key={acao.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">{acao.titulo}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(acao.data_acao).toLocaleDateString("pt-BR")}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {acao.horas_solicitadas}h
              </td>
              <td className="px-6 py-4 text-sm">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(acao.status)}`}>
                  {acao.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <button className="text-blue-600 hover:text-blue-800">
                  Ver detalhes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}