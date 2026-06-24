import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { alunos, funcionarios, matriculas, usuarios } from "@/db/schema";
import type { Aluno } from "@/models/aluno";
import type { Funcionario } from "@/models/funcionario";

export async function existeUsuarioComEmail(email: string): Promise<boolean> {
	const resultado = await db
		.select({ id: usuarios.id })
		.from(usuarios)
		.where(eq(usuarios.email, email));

	return resultado.length > 0;
}

export async function existeUsuarioComCpf(cpf: string): Promise<boolean> {
	const resultado = await db
		.select({ id: usuarios.id })
		.from(usuarios)
		.where(eq(usuarios.cpf, cpf));

	return resultado.length > 0;
}

export async function existeUsuarioComMatricula(
	matricula: string,
): Promise<boolean> {
	const resultado = await db
		.select({ id: matriculas.id })
		.from(matriculas)
		.where(eq(matriculas.matricula, matricula));

	return resultado.length > 0;
}

export async function existeUsuarioComSiape(siape: string): Promise<boolean> {
	const resultado = await db
		.select({ id: funcionarios.usuarioId })
		.from(funcionarios)
		.where(eq(funcionarios.siape, siape));

	return resultado.length > 0;
}

export async function criarAlunoRepository(aluno: Aluno): Promise<number> {
	return await db.transaction(async (tx) => {
		const [usuarioSalvo] = await tx
			.insert(usuarios)
			.values({
				nome: aluno.nome,
				cpf: aluno.cpf,
				email: aluno.email,
				celular: aluno.celular,
				senhaHash: aluno.senhaHash,
				dataNascimento: aluno.dataNascimento,
				ativo: aluno.ativo,
			})
			.returning({ id: usuarios.id });

		await tx.insert(alunos).values({
			usuarioId: usuarioSalvo.id,
		});

		if (!aluno.matriculas || aluno.matriculas.length === 0) {
			throw new Error("Aluno deve ter uma matrícula");
		}
		const dadosMatricula = aluno.matriculas[0];

		await tx.insert(matriculas).values({
			alunoId: usuarioSalvo.id,
			matricula: dadosMatricula.matricula,
			curso: dadosMatricula.curso,
			nivel: dadosMatricula.nivel,
			status: dadosMatricula.status,
			periodoIngresso: dadosMatricula.periodoIngresso,
		});

		return usuarioSalvo.id;
	});
}

export async function criarFuncionarioRepository(
	funcionario: Funcionario,
): Promise<number> {
	return await db.transaction(async (tx) => {
		const [usuarioSalvo] = await tx
			.insert(usuarios)
			.values({
				nome: funcionario.nome,
				cpf: funcionario.cpf,
				email: funcionario.email,
				celular: funcionario.celular,
				senhaHash: funcionario.senhaHash,
				dataNascimento: funcionario.dataNascimento,
				ativo: funcionario.ativo,
			})
			.returning({ id: usuarios.id });

		await tx.insert(funcionarios).values({
			usuarioId: usuarioSalvo.id,
			siape: funcionario.siape,
			tipo: funcionario.tipo,
			departamento: funcionario.departamento,
			instituto: funcionario.instituto,
			membroComissao: funcionario.membroComissao,
		});

		return usuarioSalvo.id;
	});
}

export async function buscarUsuarioPorEmail(email: string) {
	const resultado = await db.query.usuarios.findFirst({
		where: and(eq(usuarios.email, email), eq(usuarios.ativo, true)),
		with: {
			funcionario: true,
			aluno: {
				with: {
					matriculas: true,
				},
			},
		},
	});

	return resultado;
}

export async function existeUsuarioAtivoComId(
	usuarioId: number,
): Promise<boolean> {
	const resultado = await db
		.select({ id: usuarios.id })
		.from(usuarios)
		.where(and(eq(usuarios.id, usuarioId), eq(usuarios.ativo, true)));

	return resultado.length > 0;
}

export async function deletarUsuario(usuarioId: number): Promise<void> {
	await db
		.update(usuarios)
		.set({ ativo: false })
		.where(and(eq(usuarios.id, usuarioId), eq(usuarios.ativo, true)));
}
