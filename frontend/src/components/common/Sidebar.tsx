"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";

export function Sidebar() {
  const { user } = useAuth();

  const isAluno = user?.papel === "Aluno";
  const isFuncionario = user?.papel === "Funcionário" || user?.papel === "Membro da comissão";

  return (
    <aside className="w-64 bg-ufrrj-blue text-white shadow-lg">
      <div className="border-b border-white/10 p-6">
        <Image
          src="/logo_rural.png"
          alt="Logo da UFRRJ"
          width={72}
          height={72}
          className="mx-auto mb-3 h-16 w-16 object-contain"
        />

        <div className="text-center">
          <h2 className="text-lg font-bold">SIGAE</h2>
          <p className="text-xs text-white/70">Sistema de Extensão</p>
        </div>
  </div>

      <nav className="space-y-2 px-4">
        {isAluno && (
          <>
            <Link
              href="/dashboard"
              className="block rounded-md px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/acoes"
              className="block rounded-md px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              Minhas Ações
            </Link>
            <Link
              href="/dashboard/solicitacoes"
              className="block rounded-md px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              Solicitações
            </Link>
            <Link
              href="/dashboard/certificados"
              className="block rounded-md px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
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