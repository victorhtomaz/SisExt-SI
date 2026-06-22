"use client";

import { useState } from "react";
import api from "@/lib/api";

export function AcaoForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    data_acao: "",
    horas_solicitadas: "",
    comprovante: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        comprovante: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("titulo", formData.titulo);
      formDataToSend.append("descricao", formData.descricao);
      formDataToSend.append("data_acao", formData.data_acao);
      formDataToSend.append("horas_solicitadas", formData.horas_solicitadas);

      if (formData.comprovante) {
        formDataToSend.append("comprovante", formData.comprovante);
      }

      await api.post("/acoes-extensionistas", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData({
        titulo: "",
        descricao: "",
        data_acao: "",
        horas_solicitadas: "",
        comprovante: null,
      });

      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao registrar ação extensionista"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
          Título da ação
        </label>
        <input
          id="titulo"
          name="titulo"
          type="text"
          value={formData.titulo}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          placeholder="Ex: Voluntariado em abrigo de animais"
        />
      </div>

      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          placeholder="Descreva a ação extensionista realizada"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="data_acao" className="block text-sm font-medium text-gray-700">
            Data da ação
          </label>
          <input
            id="data_acao"
            name="data_acao"
            type="date"
            value={formData.data_acao}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="horas_solicitadas" className="block text-sm font-medium text-gray-700">
            Horas solicitadas
          </label>
          <input
            id="horas_solicitadas"
            name="horas_solicitadas"
            type="number"
            value={formData.horas_solicitadas}
            onChange={handleChange}
            required
            min="0.5"
            step="0.5"
            className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="Ex: 8"
          />
        </div>
      </div>

      <div>
        <label htmlFor="comprovante" className="block text-sm font-medium text-gray-700">
          Comprovante (PDF, JPG, PNG)
        </label>
        <input
          id="comprovante"
          name="comprovante"
          type="file"
          onChange={handleFileChange}
          required
          accept=".pdf,.jpg,.jpeg,.png"
          className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2"
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400"
      >
        {loading ? "Registrando..." : "Registrar ação"}
      </button>
    </form>
  );
}