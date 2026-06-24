import type { UsuarioComRelacionamentos } from "@/db/types/usuario";
import type { AlunoResponse } from "@/dtos/responses/aluno-response";
import type { FuncionarioResponse } from "@/dtos/responses/funcionario-response";

// biome-ignore lint/complexity/noStaticOnlyClass: Utilizada representação de classe utilitária conforme requisitos
export class UsuarioMapper {
	public static mapearParaAlunoResponse(
		usuario: UsuarioComRelacionamentos,
	): AlunoResponse {
		return {
			id: usuario.id,
			nome: usuario.nome,
			cpf: usuario.cpf,
			email: usuario.email,
			celular: usuario.celular,
			dataNascimento: usuario.dataNascimento,
			matriculas:
				usuario.aluno?.matriculas.map((matricula) => ({
					id: matricula.id,
					matricula: matricula.matricula,
					curso: matricula.curso,
					nivel: matricula.nivel,
					status: matricula.status,
					periodoIngresso: matricula.periodoIngresso,
				})) || [],
		};
	}

	public static mapearParaFuncionarioResponse(
		usuario: UsuarioComRelacionamentos,
	): FuncionarioResponse {
		// biome-ignore lint/style/noNonNullAssertion: funcionario é garantido não ser nulo para perfil de Funcionário/Comissão
		const funcionario = usuario.funcionario!;
		return {
			id: usuario.id,
			nome: usuario.nome,
			cpf: usuario.cpf,
			email: usuario.email,
			celular: usuario.celular,
			dataNascimento: usuario.dataNascimento,
			siape: funcionario.siape,
			tipo: funcionario.tipo,
			departamento: funcionario.departamento,
			instituto: funcionario.instituto,
			membroComissao: funcionario.membroComissao,
		};
	}
}
