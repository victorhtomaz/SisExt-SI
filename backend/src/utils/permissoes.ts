import type { PapeisUsuario } from "@/models/usuario";

interface UsuarioComRelacionamentos {
	funcionario?: {
		membroComissao: boolean | null;
	} | null;
	aluno?: {
		matriculas: Array<{
			status: string;
		}>;
	} | null;
}

export function extrairPapelAtivo(
	usuario: UsuarioComRelacionamentos,
): PapeisUsuario | null {
	if (usuario.funcionario) {
		if (usuario.funcionario.membroComissao) {
			return "Membro da comissão";
		}
		return "Funcionário";
	}

	if (usuario.aluno?.matriculas) {
		const temMatriculaAtiva = usuario.aluno.matriculas.some(
			(matricula) => matricula.status === "Ativa",
		);

		if (temMatriculaAtiva) {
			return "Aluno";
		}
	}

	return null;
}
