"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Registre-se como aluno no SIGAE"
      footerLink={{
        text: "Já tem uma conta?",
        href: "/login",
        linkText: "Fazer login",
      }}
    >
      <SignupForm />
    </AuthLayout>
  );
}