import { Matricula } from "./matricula";
import { Usuario } from "./usuario";

export interface Aluno extends Usuario {
    usuario_id: number;
    usuario?: Usuario;
    matriculas?: Matricula[];
}