"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Certificado {
  id: string;
  numero: string;
  acao_id: string;
  titulo_acao: string;
  horas_aprovadas: number;
  data_emissao: string;
  data_expiracao?: string;
  arquivo_url: string;
}

export function CertificadosList() {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCertificados();
  }, []);

  const fetchCertificados = async () => {
    try {
      const response = await api.get("/certificados");
      setCertificados(response.data.data || []);
    } catch (err) {
      setError("Erro ao carregar certificados");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Carregando...</div>;
  }

  if (error) {
    return <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>;
  }

  if (certificados.length === 0) {
    return (
      <div className="rounded-md bg-blue-50 p-4 text-center text-blue-700">
        Você ainda não tem certificados emitidos.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {certificados.map((cert) => (
        <div
          key={cert.id}
          className="rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-md"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Certificado</h3>
            <span className="text-xs font-mono text-gray-600">{cert.numero}</span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600">AÇÃO EXTENSIONISTA</p>
              <p className="font-semibold text-gray-900">{cert.titulo_acao}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-600">HORAS</p>
                <p className="text-lg font-bold text-blue-600">
                  {cert.horas_aprovadas}h
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">EMISSÃO</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(cert.data_emissao).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => window.open(cert.arquivo_url)}
            className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Baixar PDF
          </button>
        </div>
      ))}
    </div>
  );
}