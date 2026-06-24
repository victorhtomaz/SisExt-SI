export interface Usuario {
	id: number;
	nome: string;
	cpf: string;
	email: string;
	celular: string;
	senhaHash: string;
	dataNascimento: Date;
	ativo: boolean;
}

export type PapeisUsuario = "Aluno" | "Funcionário" | "Membro da comissão";
