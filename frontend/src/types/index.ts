export enum UserRole {
  ALUNO = "aluno",
  FUNCIONARIO = "funcionario",
}

export enum NivelEducacao {
  GRADUACAO = "graduação",
  MESTRADO = "mestrado",
  DOUTORADO = "doutorado",
}

export enum StatusMatricula {
  ATIVO = "ativo",
  INATIVO = "inativo",
  TRANCADO = "trancado",
}

export enum TipoFuncionario {
  COMISSAO = "comissão",
  ADMINISTRADOR = "administrador",
}

export enum StatusSolicitacao {
  PENDENTE = "pendente",
  APROVADO = "aprovado",
  REJEITADO = "rejeitado",
}

// Tipos User
export interface User {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  celular: string;
  data_nascimento: string;
  is_active: boolean;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// Tipos Aluno
export interface Aluno extends User {
  role: UserRole.ALUNO;
}

export interface Matricula {
  id: string;
  aluno_id: string;
  matricula: string;
  curso: string;
  nivel: NivelEducacao;
  status: StatusMatricula;
  periodo_ingresso: string;
  created_at: string;
  updated_at: string;
}

// Tipos Funcionário/Comissão
export interface Funcionario extends User {
  role: UserRole.FUNCIONARIO;
  siape: string;
  tipo: TipoFuncionario;
  departamento: string;
  instituto: string;
}

// Tipos de Ações Extensionistas
export interface AcaoExtensionista {
  id: string;
  aluno_id: string;
  titulo: string;
  descricao: string;
  data_acao: string;
  horas_solicitadas: number;
  comprovante_url: string;
  status: StatusSolicitacao;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  approved_by?: string;
  comments?: string;
}

// Tipos de Resposta da API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  errors?: Record<string, string[]>;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SignupRequest {
  nome: string;
  cpf: string;
  email: string;
  celular: string;
  data_nascimento: string;
  senha: string;
  confirmar_senha: string;
  role: UserRole.ALUNO;
}