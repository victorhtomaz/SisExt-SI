"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import { AuthContextType } from "@/types/auth";

type AuthUser = {
  id: number;
  email: string;
  papel: "Aluno" | "Funcionário" | "Membro da comissão";
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

function decodeJwt(token: string): AuthUser {
  const payload = token.split(".")[1];
  const decoded = JSON.parse(atob(payload));

  return {
    id: decoded.usuarioId,
    email: decoded.email,
    papel: decoded.papel,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAuth() {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!savedToken || !savedUser) {
        setLoading(false);
        return;
      }

      try {
        await api.post("/auth/validar");

        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadAuth();
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      setError(null);
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        senha,
      });

      const accessToken = response.data.accessToken;
      const loggedUser = decodeJwt(accessToken);

      console.log("Usuário logado:", loggedUser);

      setToken(accessToken);
      setUser(loggedUser);

      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(loggedUser));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao fazer login";

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

      await api.post("/usuarios", data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar conta";

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}