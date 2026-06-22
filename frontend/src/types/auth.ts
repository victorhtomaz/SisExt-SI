export interface AuthContextType {
  user: any | null;
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