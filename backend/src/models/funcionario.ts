import type { Usuario } from "./usuario";

export interface Funcionario extends Usuario {
	usuarioId: number;
	siape: string;
	tipo: FuncionarioType;
	departamento: string;
	instituto: string;
	membroComissao: boolean;
	usuario?: Usuario;
}

type FuncionarioType = "Docente" | "Técnico-Administrativo";
