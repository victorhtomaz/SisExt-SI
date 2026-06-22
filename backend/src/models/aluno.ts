import type { Matricula } from "./matricula";
import type { Usuario } from "./usuario";

export interface Aluno extends Usuario {
	usuarioId?: number;
	usuario?: Usuario;
	matriculas?: Matricula[];
}
