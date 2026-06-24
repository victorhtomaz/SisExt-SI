import type { MatriculaResponse } from "./matricula-response";

export interface AlunoResponse {
	id: number;
	nome: string;
	cpf: string;
	email: string;
	celular: string;
	dataNascimento: Date;
	matriculas: Array<MatriculaResponse>;
}
