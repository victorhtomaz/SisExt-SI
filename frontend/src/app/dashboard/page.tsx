"use client";

import { useAuth } from "@/context/AuthContext";
import { User, UserRole } from "@/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const isAluno = user?.papel === "Aluno";
  const isFuncionario = user?.papel === "Funcionário" || user?.papel === "Membro da comissÃ£o";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bem-vindo!
        </h1>
        <p className="mt-2 text-gray-600">
          {isAluno ? "Gerencie suas ações extensionistas" : "Avalie solicitações de ações extensionistas"}
        </p>
      </div>

      {isAluno && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900">Ações Registradas</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">0</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900">Horas Aprovadas</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">0</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900">Solicitações Pendentes</h3>
            <p className="mt-2 text-3xl font-bold text-yellow-600">0</p>
          </div>
        </div>
      )}

      {isFuncionario && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900">Painel da Comissão</h3>
          <p className="mt-2 text-gray-600">Avaliações pendentes serão listadas aqui</p>
        </div>
      )}
    </div>

    
  );
}