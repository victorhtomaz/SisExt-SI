"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { StatusSolicitacao } from "@/types";

interface AcaoParaAvaliacao {
  id: string;
  aluno_nome: string;
  aluno_email: string;
  titulo: string;
  descricao: string;
  horas_solicitadas: number;
  data_acao: string;
  data_solicitacao: string;
  status: string;
  comprovante_url: string;
}

export function AvaliacoesList() {
  const [avaliacoes, setAvaliacoes] = useState<AcaoParaAvaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [responseLoading, setResponseLoading] = useState(false);

  useEffect(() => {
    fetchAvaliacoes();
  }, []);

  const fetchAvaliacoes = async () => {
    try {
      const response = await api.get("/acoes-extensionistas/pendentes");
      setAvaliacoes(response.data.data || []);
    } catch (err) {
      setError("Erro ao carregar avaliações pendentes");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (acaoId: string, horasAprovadas: number) => {
    setResponseLoading(true);
    try {
      await api.post(`/acoes-extensionistas/${acaoId}/aprovar`, {
        horas_aprovadas: horasAprovadas,
      });
      fetchAvaliacoes();
      setSelectedId(null);
    } catch (err) {
      alert("Erro ao aprovar ação");
    } finally {
      setResponseLoading(false);
    }
  };

  const handleReject = async (acaoId: string, motivo: string) => {
    setResponseLoading(true);
    try {
      await api.post(`/acoes-extensionistas/${acaoId}/rejeitar`, {
        motivo,
      });
      fetchAvaliacoes();
      setSelectedId(null);
    } catch (err) {
      alert("Erro ao rejeitar ação");
    } finally {
      setResponseLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Carregando...</div>;
  }

  if (error) {
    return <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>;
  }

  if (avaliacoes.length === 0) {
    return (
      <div className="rounded-md bg-green-50 p-4 text-center text-green-700">
        Não há solicitações pendentes para avaliação.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {avaliacoes.map((avaliacao) => (
        <div
          key={avaliacao.id}
          className="rounded-lg border border-yellow-200 bg-yellow-50 p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-600">ALUNO</p>
                  <p className="font-semibold text-gray-900">{avaliacao.aluno_nome}</p>
                  <p className="text-sm text-gray-600">{avaliacao.aluno_email}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600">AÇÃO</p>
                  <p className="font-semibold text-gray-900">{avaliacao.titulo}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600">HORAS SOLICITADAS</p>
                  <p className="text-lg font-bold text-blue-600">
                    {avaliacao.horas_solicitadas}h
                  </p>
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-700">{avaliacao.descricao}</p>

              <div className="mt-2 flex gap-4 text-xs text-gray-600">
                <span>
                  Data da ação:{" "}
                  {new Date(avaliacao.data_acao).toLocaleDateString("pt-BR")}
                </span>
                <span>
                  Solicitado em:{" "}
                  {new Date(avaliacao.data_solicitacao).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                setSelectedId(selectedId === avaliacao.id ? null : avaliacao.id)
              }
              className="ml-4 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              {selectedId === avaliacao.id ? "Fechar" : "Avaliar"}
            </button>
          </div>

          {selectedId === avaliacao.id && (
            <AvaliacaoForm
              acaoId={avaliacao.id}
              horasSolicitadas={avaliacao.horas_solicitadas}
              onApprove={handleApprove}
              onReject={handleReject}
              loading={responseLoading}
            />
          )}
        </div>
      ))}
    </div>
  );
}

interface AvaliacaoFormProps {
  acaoId: string;
  horasSolicitadas: number;
  onApprove: (acaoId: string, horas: number) => Promise<void>;
  onReject: (acaoId: string, motivo: string) => Promise<void>;
  loading: boolean;
}

function AvaliacaoForm({
  acaoId,
  horasSolicitadas,
  onApprove,
  onReject,
  loading,
}: AvaliacaoFormProps) {
  const [horasAprovadas, setHorasAprovadas] = useState(horasSolicitadas);
  const [motivo, setMotivo] = useState("");

  return (
    <div className="mt-4 space-y-4 border-t border-yellow-200 pt-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Horas a aprovar (máximo: {horasSolicitadas})
        </label>
        <input
          type="number"
          value={horasAprovadas}
          onChange={(e) => setHorasAprovadas(Math.min(Number(e.target.value), horasSolicitadas))}
          max={horasSolicitadas}
          min="0"
          step="0.5"
          className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onApprove(acaoId, horasAprovadas)}
          disabled={loading}
          className="flex-1 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "Processando..." : "Aprovar"}
        </button>

        <button
          onClick={() => {
            setMotivo(prompt("Informe o motivo da rejeição:") || "");
          }}
          disabled={loading}
          className="flex-1 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:bg-gray-400"
        >
          {loading ? "Processando..." : "Rejeitar"}
        </button>
      </div>

      {motivo && (
        <button
          onClick={() => onReject(acaoId, motivo)}
          disabled={loading}
          className="w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:bg-gray-400"
        >
          Confirmar rejeição
        </button>
      )}
    </div>
  );
}