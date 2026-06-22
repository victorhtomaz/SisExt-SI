export interface Usuario {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  senha_hash: string;
  data_nascimento: Date;
  ativo: boolean;
}