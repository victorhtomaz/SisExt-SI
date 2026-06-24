import { z } from "zod";
import {
	createFuncionarioSchema,
	createUsuarioDadosComunsSchema,
} from "./create-usuario-request";

const updateDadosComuns = createUsuarioDadosComunsSchema
	.pick({
		email: true,
		celular: true,
	})
	.partial();

export const updateAlunoSchema = z.object({
	...updateDadosComuns.shape,
	detalhesPerfil: z
		.object({
			matriculaId: z.number({
				error:
					"O ID da matrícula é obrigatório para atualização do perfil acadêmico",
			}),
			status: z.string({ error: "Status inválido" }).optional(),
		})
		.optional(),
});

export const updateFuncionarioSchema = z.object({
	...updateDadosComuns.shape,
	detalhesPerfil: createFuncionarioSchema.shape.detalhesPerfil
		.pick({
			membroComissao: true,
			departamento: true,
			instituto: true,
		})
		.partial()
		.optional(),
});

export const updateUsuarioSchema = z.union([
	updateAlunoSchema,
	updateFuncionarioSchema,
]);

export type UpdateUsuarioRequest = z.infer<typeof updateUsuarioSchema>;
