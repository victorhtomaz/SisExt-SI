"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Faça login na sua conta SIGAE"
      footerLink={{
        text: "Não tem uma conta?",
        href: "/signup",
        linkText: "Criar conta",
      }}
    >
      <LoginForm />
    </AuthLayout>
  );
}