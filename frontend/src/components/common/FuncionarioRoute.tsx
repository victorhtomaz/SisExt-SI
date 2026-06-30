"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function FuncionarioRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const isFuncionario =
    user?.papel === "Funcionário" ||
    user?.papel === "Membro da comissão";

  useEffect(() => {
    if (!loading && !isFuncionario) {
      router.push("/dashboard");
    }
  }, [loading, isFuncionario, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!isFuncionario) {
    return null;
  }

  return <>{children}</>;
}