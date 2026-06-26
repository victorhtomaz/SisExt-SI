export type AuthUser = {
  id: number;
  email: string;
  papel: "Aluno" | "Funcionário" | "Membro da comissão";
};

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  error: string | null;
}

export interface LoginRequest {
  email: string;
  senha: string;
}