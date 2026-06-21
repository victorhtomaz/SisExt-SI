"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContextType } from "@/types/auth";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const USE_MOCK = true;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar token e usuário do localStorage ao montar
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      setError(null);
      setLoading(true);

      // Chamar API de login (vamos criar depois)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        throw new Error("Falha ao fazer login");
      }

      const data = await response.json();

      setToken(data.token);
      setUser(data.user);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: any) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Falha ao criar conta");
      }

      const responseData = await response.json();

      setToken(responseData.token);
      setUser(responseData.user);

      localStorage.setItem("token", responseData.token);
      localStorage.setItem("user", JSON.stringify(responseData.user));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    signup,
    logout,
    error,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}