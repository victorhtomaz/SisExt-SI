import { z } from "zod";

export const createUsuarioDadosComunsSchema = z.object({
	nome: z
		.string("Campo nome é obrigatório")
		.min(2, "Nome deve ter pelo menos 2 caracteres"),
	cpf: z.string("Campo CPF é obrigatório").min(11, "CPF inválido").max(14),
	email: z.email("Email inválido"),
	celular: z.string("Campo celular é obrigatório"),
	senha: z
		.string("Campo senha é obrigatório")
		.min(6, "A senha deve ter pelo menos 6 caracteres"),
	dataNascimento: z.coerce.date({
		error: "Data de nascimento inválida",
	}),
});

export const createAlunoSchema = createUsuarioDadosComunsSchema.extend({
	tipo: z.literal("ALUNO"),
	detalhesPerfil: z.object({
		matricula: z.string({
			error: "Matrícula é obrigatória para alunos",
		}),
		curso: z.string({ error: "Curso é obrigatório para alunos" }),
		nivel: z.enum(["Graduação", "Pós-graduação", "Mestrado", "Doutorado"], {
			error: "Tipos de nível são Graduação, Pós-graduação, Mestrado, Doutorado",
		}),
		periodoIngresso: z.string({
			error: "Período de ingresso é obrigatório para alunos",
		}),
	}),
});

export const createFuncionarioSchema = createUsuarioDadosComunsSchema.extend({
	tipo: z.literal("FUNCIONARIO"),
	detalhesPerfil: z.object({
		siape: z.string({
			error: "SIAPE é obrigatório para funcionários",
		}),
		tipo: z.enum(["Docente", "Técnico-Administrativo"], {
			error: "Tipos de funcionário são Docente, Técnico-Administrativo",
		}),
		departamento: z.string({ error: "Departamento é obrigatório" }),
		instituto: z.string({ error: "Instituto é obrigatório" }),
		membroComissao: z.boolean().default(false),
	}),
});

export const createUsuarioSchema = z.discriminatedUnion("tipo", [
	createAlunoSchema,
	createFuncionarioSchema,
]);

export type CreateUsuarioRequest = z.infer<typeof createUsuarioSchema>;
