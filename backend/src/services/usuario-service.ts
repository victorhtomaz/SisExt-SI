import bcrypt from "bcrypt";
import type { UsuarioComRelacionamentos } from "@/db/types/usuario";
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
	criarAluno,
	criarFuncionario,
	deletarUsuario,
	existeUsuarioComCpf,
	existeUsuarioComEmail,
	existeUsuarioComMatricula,
	existeUsuarioComSiape,
} from "@/repositories/usuario-repository";
import { normalizeCelular, normalizeCpf } from "@/utils/normalize";
import { extrairPapelAtivo } from "@/utils/permissoes";
import { UsuarioMapper } from "@/utils/usuario-mapper";
import type { TokenPayload } from "./token-service";

// ==============================
// Criação de Usuário
// ==============================

export async function criarUsuario(
	dadosUsuario: CreateUsuarioRequest,
): Promise<CreatedUsuarioResponse> {
	const cpfFormatado = normalizeCpf(dadosUsuario.cpf);
	const celularFormatado = normalizeCelular(dadosUsuario.celular);

	await validarDadosUnicosParaCriacao(dadosUsuario.email, cpfFormatado);

	const senhaHash = await bcrypt.hash(dadosUsuario.senha, 10);
	let novoUsuarioId: number;

	if (dadosUsuario.tipo === "ALUNO") {
		novoUsuarioId = await criarPerfilAluno(
			dadosUsuario,
			cpfFormatado,
			celularFormatado,
			senhaHash,
		);
	} else if (dadosUsuario.tipo === "FUNCIONARIO") {
		novoUsuarioId = await criarPerfilFuncionario(
			dadosUsuario,
			cpfFormatado,
			celularFormatado,
			senhaHash,
		);
	} else {
		throw new Error("Tipo de usuário inválido");
	}

	return {
		id: novoUsuarioId,
		mensagem: "Usuário criado com sucesso",
	};
}

async function validarDadosUnicosParaCriacao(
	email: string,
	cpf: string,
): Promise<void> {
	const emailExiste = await existeUsuarioComEmail(email);
	const cpfExiste = await existeUsuarioComCpf(cpf);

	if (emailExiste || cpfExiste) {
		throw new ConflictError("Usuário já cadastrado com este e-mail ou CPF");
	}
}

async function criarPerfilAluno(
	dadosUsuario: CreateUsuarioRequest,
	cpf: string,
	celular: string,
	senhaHash: string,
): Promise<number> {
	const perfilAluno = dadosUsuario.detalhesPerfil as any;
	const matricula = perfilAluno.matricula;
	if (!matricula) throw new Error("Matrícula é obrigatória para aluno");

	const matriculaExiste = await existeUsuarioComMatricula(matricula);
	if (matriculaExiste) {
		throw new ConflictError("Esta matrícula já está registrada no sistema.");
	}

	const aluno: Aluno = {
		id: 0,
		nome: dadosUsuario.nome,
		cpf,
		email: dadosUsuario.email,
		celular,
		senhaHash,
		dataNascimento: dadosUsuario.dataNascimento,
		ativo: true,
		matriculas: [
			{
				id: 0,
				alunoId: 0,
				matricula,
				curso: perfilAluno.curso,
				nivel: perfilAluno.nivel,
				status: "Ativa",
				periodoIngresso: perfilAluno.periodoIngresso,
			},
		],
	};

	return criarAluno(aluno);
}

async function criarPerfilFuncionario(
	dadosUsuario: CreateUsuarioRequest,
	cpf: string,
	celular: string,
	senhaHash: string,
): Promise<number> {
	const perfilFunc = dadosUsuario.detalhesPerfil as any;
	const siape = perfilFunc.siape;
	if (!siape) throw new Error("Siape é obrigatório para funcionário");

	const siapeExiste = await existeUsuarioComSiape(siape);
	if (siapeExiste) {
		throw new ConflictError("Este SIAPE já está registrado no sistema.");
	}

	const funcionario: Funcionario = {
		id: 0,
		nome: dadosUsuario.nome,
		cpf,
		email: dadosUsuario.email,
		celular,
		senhaHash,
		dataNascimento: dadosUsuario.dataNascimento,
		ativo: true,
		usuarioId: 0,
		siape,
		tipo: perfilFunc.tipo,
		departamento: perfilFunc.departamento,
		instituto: perfilFunc.instituto,
		membroComissao: perfilFunc.membroComissao,
	};

	return criarFuncionario(funcionario);
}

// ==============================
// Listagem de Usuário
// ==============================

export async function listarUsuarioPorId(
	usuarioIdRequisitado: number,
	usuarioAutenticado: TokenPayload,
): Promise<AlunoResponse | FuncionarioResponse> {
	const usuario = await buscarUsuarioPorId(usuarioIdRequisitado);

	if (!usuario) {
		throw new NotFoundError("Usuário não encontrado");
	}

	const perfilUsuario = extrairPapelAtivo(usuario);

	validarAcessoVisualizacaoPerfil(
		usuarioAutenticado,
		perfilUsuario,
		usuarioIdRequisitado,
	);

	if (perfilUsuario === "Aluno") {
		return UsuarioMapper.mapearParaAlunoResponse(usuario);
	}

	if (
		perfilUsuario === "Funcionário" ||
		perfilUsuario === "Membro da comissão"
	) {
		return UsuarioMapper.mapearParaFuncionarioResponse(usuario);
	}

	throw new NotFoundError("Perfil de usuário não encontrado");
}

function validarAcessoVisualizacaoPerfil(
	usuarioAutenticado: TokenPayload,
	perfilAcessado: string | null,
	idAcessado: number,
): void {
	const isAlunoAcessandoOutroAluno =
		usuarioAutenticado.papel === "Aluno" &&
		perfilAcessado === "Aluno" &&
		usuarioAutenticado.usuarioId !== idAcessado;

	if (isAlunoAcessandoOutroAluno) {
		throw new ForbiddenError(
			"Acesso negado. Alunos só podem acessar seus próprios dados.",
		);
	}
}

// ==============================
// Atualização de Usuário
// ==============================

export async function atualizarUsuario(
	dadosAtualizacao: UpdateUsuarioRequest,
	usuarioAutenticado: TokenPayload,
): Promise<void> {
	const usuario = await buscarUsuarioPorId(usuarioAutenticado.usuarioId);

	if (!usuario) {
		throw new NotFoundError("Usuário não encontrado");
	}

	const papelAtivo = extrairPapelAtivo(usuario);

	if (!papelAtivo) {
		throw new ForbiddenError("Não é possível atualizar o perfil");
	}

	await processarAtualizacaoBasica(usuario, dadosAtualizacao);

	if (papelAtivo === "Aluno") {
		await processarAtualizacaoPerfilAluno(usuario, dadosAtualizacao);
	} else if (
		papelAtivo === "Funcionário" ||
		papelAtivo === "Membro da comissão"
	) {
		await processarAtualizacaoPerfilFuncionario(usuario, dadosAtualizacao);
	}
}

async function processarAtualizacaoBasica(
	usuario: UsuarioComRelacionamentos,
	dadosAtualizacao: UpdateUsuarioRequest,
): Promise<void> {
	if (dadosAtualizacao.email && dadosAtualizacao.email !== usuario.email) {
		const emailExiste = await existeUsuarioComEmail(dadosAtualizacao.email);
		if (emailExiste) {
			throw new ConflictError("Este e-mail já está registrado no sistema.");
		}
		usuario.email = dadosAtualizacao.email;
	}

	if (dadosAtualizacao.celular) {
		usuario.celular = dadosAtualizacao.celular;
	}
}

async function processarAtualizacaoPerfilAluno(
	usuario: UsuarioComRelacionamentos,
	dadosAtualizacao: UpdateUsuarioRequest,
): Promise<void> {
	let dadosMatricula: { id: number; status: string } | undefined;

	if (dadosAtualizacao.detalhesPerfil) {
		const perfilAluno = dadosAtualizacao.detalhesPerfil as {
			matriculaId: number;
			status?: string;
		};

		const matriculaVinculada = usuario.aluno?.matriculas.find(
			(m) => m.id === perfilAluno.matriculaId,
		);

		if (!matriculaVinculada) {
			throw new ForbiddenError(
				"A matrícula informada não pertence ao seu usuário ou é inválida.",
			);
		}

		if (perfilAluno.status) {
			matriculaVinculada.status = perfilAluno.status;
		}

		dadosMatricula = {
			id: matriculaVinculada.id,
			status: matriculaVinculada.status,
		};
	}

	const dadosUsuario = { email: usuario.email, celular: usuario.celular };
	await atualizarAluno(usuario.id, dadosUsuario, dadosMatricula);
}

async function processarAtualizacaoPerfilFuncionario(
	usuario: UsuarioComRelacionamentos,
	dadosAtualizacao: UpdateUsuarioRequest,
): Promise<void> {
	let dadosFuncionario:
		| { departamento?: string; instituto?: string; membroComissao?: boolean }
		| undefined;

	if (dadosAtualizacao.detalhesPerfil && usuario.funcionario) {
		const perfilFuncionario = dadosAtualizacao.detalhesPerfil as {
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

		dadosFuncionario = {
			departamento: usuario.funcionario.departamento,
			instituto: usuario.funcionario.instituto,
			membroComissao: usuario.funcionario.membroComissao,
		};
	}

	const dadosUsuario = { email: usuario.email, celular: usuario.celular };
	await atualizarFuncionario(usuario.id, dadosUsuario, dadosFuncionario);
}

// ==============================
// Exclusão de Usuário
// ==============================

export async function excluirUsuario(
	request: DeletarUsuarioRequest,
): Promise<void> {
	if (!request.usuarioId) {
		throw new AppError("ID do usuário não fornecido.");
	}

	await deletarUsuario(request.usuarioId);
}
