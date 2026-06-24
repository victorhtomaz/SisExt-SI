export interface Matricula {
	id: number;
	alunoId: number;
	matricula: string;
	curso: string;
	nivel: MatriculaNivel;
	status: MatriculaStatus;
	periodoIngresso: string;
}

export type MatriculaStatus = "Ativa" | "Trancada" | "Concluída" | "Cancelada";
export type MatriculaNivel =
	| "Graduação"
	| "Pós-graduação"
	| "Mestrado"
	| "Doutorado";
