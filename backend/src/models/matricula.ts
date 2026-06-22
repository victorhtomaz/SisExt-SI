export interface Matricula {
    id: number;
    aluno_id: number;
    matricula: string;
    curso: string;
    nivel: MatriculaNivel;
    status: MatriculaStatus;
    periodo_ingresso: string;
}

type MatriculaStatus = "ativa" | "trancada" | "concluida" | "cancelada";
type MatriculaNivel = "graduação"| "pós-graduação" | "mestrado" | "doutorado";