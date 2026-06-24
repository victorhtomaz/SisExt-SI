export interface UsuarioComRelacionamentos {
	id: number;
	nome: string;
	cpf: string;
	email: string;
	celular: string;
	senhaHash: string;
	dataNascimento: Date;
	ativo: boolean;
	aluno: {
		usuarioId: number;
		matriculas: {
			id: number;
			alunoId: number;
			matricula: string;
			curso: string;
			nivel: string;
			status: string;
			periodoIngresso: string;
		}[];
	} | null;
	funcionario: {
		usuarioId: number;
		siape: string;
		tipo: string;
		departamento: string;
		instituto: string;
		membroComissao: boolean;
	} | null;
}
