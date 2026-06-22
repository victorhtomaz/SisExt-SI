export interface Matricula {
	id: number;
	alunoId: number;
	matricula: string;
	curso: string;
	nivel: MatriculaNivel;
	status: MatriculaStatus;
	periodoIngresso: string;
}

type MatriculaStatus = "Ativa" | "Trancada" | "Concluída" | "Cancelada";
type MatriculaNivel = "Graduação" | "Pós-graduação" | "Mestrado" | "Doutorado";
