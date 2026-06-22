"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { User, UserRole } from "@/types";

export function Sidebar() {
  const { user } = useAuth();
  const userData = user as User | null;

  const isAluno = userData?.role === UserRole.ALUNO;
  const isFuncionario = userData?.role === UserRole.FUNCIONARIO;

  return (
    <aside className="w-64 bg-gray-900 text-white shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold">Menu</h2>
      </div>

      <nav className="space-y-2 px-4">
        {isAluno && (
          <>
            <Link
              href="/dashboard"
              className="block rounded px-4 py-2 hover:bg-gray-800"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/acoes"
              className="block rounded px-4 py-2 hover:bg-gray-800"
            >
              Minhas Ações
            </Link>
            <Link
              href="/dashboard/solicitacoes"
              className="block rounded px-4 py-2 hover:bg-gray-800"
            >
              Solicitações
            </Link>
            <Link
              href="/dashboard/certificados"
              className="block rounded px-4 py-2 hover:bg-gray-800"
            >
              Certificados
            </Link>
          </>
        )}

        {isFuncionario && (
          <>
            <Link
              href="/dashboard"
              className="block rounded px-4 py-2 hover:bg-gray-800"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/avaliacoes"
              className="block rounded px-4 py-2 hover:bg-gray-800"
            >
              Avaliações Pendentes
            </Link>
            <Link
              href="/dashboard/relatorios"
              className="block rounded px-4 py-2 hover:bg-gray-800"
            >
              Relatórios
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}