import bcrypt from "bcrypt";
import type { CreateUsuarioRequest } from "@/dtos/requests/create-usuario-request";
import type { DeletarUsuarioRequest } from "@/dtos/requests/deletar-usuario-requets";
import type { UpdateUsuarioRequest } from "@/dtos/requests/update-usuario-request";
import type { AlunoResponse } from "@/dtos/responses/aluno-response";
import type { CreatedUsuarioResponse } from "@/dtos/responses/created-usuario-response";
import type { FuncionarioResponse } from "@/dtos/responses/funcionario-response";
import {
	AppError,
	ConflictError,
	ForbiddenError,
	NotFoundError,
} from "@/errors/app-error";
import type { Aluno } from "@/models/aluno";
import type { Funcionario } from "@/models/funcionario";
import {
	atualizarAluno,
	atualizarFuncionario,
	buscarUsuarioPorId,
	criarAlunoRepository,
	criarFuncionarioRepository,
	deletarUsuario,
	existeUsuarioComCpf,
	existeUsuarioComEmail,
	existeUsuarioComMatricula,
	existeUsuarioComSiape,
} from "@/repositories/usuario-repository";
import { normalizeCelular, normalizeCpf } from "@/utils/normalize";
import { extrairPapelAtivo } from "@/utils/permissoes";
import type { TokenPayload } from "./token-service";

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

export async function listarUsuarioPorId(
	usuarioId: number,
	usuarioAutenticado: TokenPayload,
): Promise<AlunoResponse | FuncionarioResponse> {
	const usuario = await buscarUsuarioPorId(usuarioId);
	if (!usuario) throw new NotFoundError("Usuário não encontrado");

	const usuarioPerfil = extrairPapelAtivo(usuario);

	if (
		usuarioAutenticado.papel === "Aluno" &&
		usuarioPerfil === "Aluno" &&
		usuarioAutenticado.usuarioId !== usuarioId
	) {
		throw new ForbiddenError(
			"Acesso negado. Alunos só podem acessar seus próprios dados.",
		);
	}

	if (usuarioPerfil === "Aluno") {
		const alunoResponse: AlunoResponse = {
			id: usuario.id,
			nome: usuario.nome,
			cpf: usuario.cpf,
			email: usuario.email,
			celular: usuario.celular,
			dataNascimento: usuario.dataNascimento,
			matriculas:
				usuario.aluno.matriculas.map((matricula) => ({
					id: matricula.id,
					matricula: matricula.matricula,
					curso: matricula.curso,
					nivel: matricula.nivel,
					status: matricula.status,
					periodoIngresso: matricula.periodoIngresso,
				})) || [],
		};
		return alunoResponse;
	} else if (
		usuarioPerfil === "Funcionário" ||
		usuarioPerfil === "Membro da comissão"
	) {
		const funcionarioResponse: FuncionarioResponse = {
			id: usuario.id,
			nome: usuario.nome,
			cpf: usuario.cpf,
			email: usuario.email,
			celular: usuario.celular,
			dataNascimento: usuario.dataNascimento,
			siape: usuario.funcionario.siape,
			tipo: usuario.funcionario.tipo,
			departamento: usuario.funcionario.departamento,
			instituto: usuario.funcionario.instituto,
			membroComissao: usuario.funcionario.membroComissao,
		};
		return funcionarioResponse;
	} else {
		throw new NotFoundError("Perfil de usuário não encontrado");
	}
}

export async function atualizarUsuario(
	request: UpdateUsuarioRequest,
	usuarioAutenticado: TokenPayload,
) {
	const usuario = await buscarUsuarioPorId(usuarioAutenticado.usuarioId);
	if (!usuario) throw new NotFoundError("Usuário não encontrado");

	const papelAtivo = extrairPapelAtivo(usuario);
	if (!papelAtivo)
		throw new ForbiddenError("Não é possível atualizar o perfil");

	if (request.email && request.email !== usuario.email) {
		const emailCadastrado = await existeUsuarioComEmail(request.email);
		if (emailCadastrado) {
			throw new ConflictError("Este e-mail já está registrado no sistema.");
		}
	}

	if (request.email) usuario.email = request.email;
	if (request.celular) usuario.celular = request.celular;

	if (papelAtivo === "Aluno") {
		let matriculaValidaId = 0;
		if (request.detalhesPerfil) {
			const perfilAluno = request.detalhesPerfil as {
				matriculaId: number;
				status?: string;
			};
			const matriculaValida = usuario.aluno.matriculas.find(
				(m) => m.id === perfilAluno.matriculaId,
			);
			if (!matriculaValida) {
				throw new ForbiddenError(
					"A matrícula informada não pertence ao seu usuário ou é inválida.",
				);
			}

			matriculaValidaId = matriculaValida.id;
			if (perfilAluno.status) {
				matriculaValida.status = perfilAluno.status;
			}
		}

		await atualizarAluno(usuario, matriculaValidaId);
	} else if (
		papelAtivo === "Funcionário" ||
		papelAtivo === "Membro da comissão"
	) {
		if (request.detalhesPerfil) {
			const perfilFuncionario = request.detalhesPerfil as {
				membroComissao?: boolean;
				departamento?: string;
				instituto?: string;
			};

			if (perfilFuncionario.membroComissao !== undefined) {
				usuario.funcionario.membroComissao = perfilFuncionario.membroComissao;
			}

			if (perfilFuncionario.departamento) {
				usuario.funcionario.departamento = perfilFuncionario.departamento;
			}

			if (perfilFuncionario.instituto) {
				usuario.funcionario.instituto = perfilFuncionario.instituto;
			}
		}

		await atualizarFuncionario(usuario);
	}
}

export async function deletarUsuarioService(
	request: DeletarUsuarioRequest,
): Promise<void> {
	if (!request.usuarioId) {
		throw new AppError("ID do usuário não fornecido.");
	}

	await deletarUsuario(request.usuarioId);
}
