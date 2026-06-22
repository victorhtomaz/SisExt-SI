import bcrypt from "bcrypt";
import type { CreateUsuarioRequest } from "@/dtos/requests/create-usuario-request";
import type { CreatedUsuarioResponse } from "@/dtos/responses/created-usuario-response";
import { ConflictError } from "@/errors/app-error";
import type { Aluno } from "@/models/aluno";
import type { Funcionario } from "@/models/funcionario";
import {
	criarAlunoRepository,
	criarFuncionarioRepository,
	existeUsuarioComCpf,
	existeUsuarioComEmail,
	existeUsuarioComMatricula,
	existeUsuarioComSiape,
} from "@/repositories/usuario-repository";
import { normalizeCelular, normalizeCpf } from "@/utils/normalize";

export async function createUserService(
	request: CreateUsuarioRequest,
): Promise<CreatedUsuarioResponse> {
	const cpf = normalizeCpf(request.cpf);
	const celular = normalizeCelular(request.celular);

	const emailCadastrado = await existeUsuarioComEmail(request.email);
	const cpfCadastrado = await existeUsuarioComCpf(cpf);

	if (emailCadastrado || cpfCadastrado) {
		throw new ConflictError("Usuário já cadastrado com este e-mail ou CPF");
	}

	const senhaHash = await bcrypt.hash(request.senha, 10);

	let userId = 0;
	if (request.tipo === "ALUNO") {
		const matricula = request.detalhesPerfil.matricula;
		const matriculaCadastrada = await existeUsuarioComMatricula(matricula);

		if (matriculaCadastrada) {
			throw new ConflictError("Esta matrícula já está registrada no sistema.");
		}

		const aluno: Aluno = {
			id: 0,
			nome: request.nome,
			cpf: cpf,
			email: request.email,
			celular: celular,
			senhaHash: senhaHash,
			dataNascimento: request.dataNascimento,
			ativo: true,
			matriculas: [
				{
					id: 0,
					alunoId: 0,
					matricula: request.detalhesPerfil.matricula,
					curso: request.detalhesPerfil.curso,
					nivel: request.detalhesPerfil.nivel,
					status: "Ativa",
					periodoIngresso: request.detalhesPerfil.periodoIngresso,
				},
			],
		};

		userId = await criarAlunoRepository(aluno);
	} else if (request.tipo === "FUNCIONARIO") {
		const siapeCadastrado = await existeUsuarioComSiape(
			request.detalhesPerfil.siape,
		);

		if (siapeCadastrado) {
			throw new ConflictError("Este SIAPE já está registrado no sistema.");
		}

		const funcionario: Funcionario = {
			id: 0,
			nome: request.nome,
			cpf: cpf,
			email: request.email,
			celular: celular,
			senhaHash: senhaHash,
			dataNascimento: request.dataNascimento,
			ativo: true,
			usuarioId: 0,
			siape: request.detalhesPerfil.siape,
			tipo: request.detalhesPerfil.tipo,
			departamento: request.detalhesPerfil.departamento,
			instituto: request.detalhesPerfil.instituto,
			membroComissao: request.detalhesPerfil.membroComissao,
		};

		userId = await criarFuncionarioRepository(funcionario);
	} else {
		throw new Error("Tipo de usuário inválido");
	}

	return {
		id: userId,
		mensagem: "Usuário criado com sucesso",
	};
}
