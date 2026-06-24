import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { createUsuarioSchema } from "@/dtos/requests/create-usuario-request";
import { updateUsuarioSchema } from "@/dtos/requests/update-usuario-request";
import { autenticarMiddleware } from "@/middlewares/autenticar";
import { validateRequest } from "@/middlewares/validate-request";
import {
	atualizarUsuario,
	criarUsuario,
	excluirUsuario,
	listarUsuarioPorId,
} from "@/services/usuario-service";
import { handleRouteError } from "@/utils/handle-route-error";

const userRoutes = Router();

userRoutes.post("/", validateRequest(createUsuarioSchema), async (req, res) => {
	try {
		const { id, mensagem } = await criarUsuario(req.body);
		res.status(StatusCodes.CREATED).json({
			id: id,
			message: mensagem,
		});
	} catch (error: unknown) {
		handleRouteError(res, error, "Erro ao criar usuário");
	}
});

userRoutes.get("/:id", autenticarMiddleware, async (req, res) => {
	try {
		const idRequisitado = Number.parseInt(String(req.params.id), 10);
		if (Number.isNaN(idRequisitado)) {
			res.status(StatusCodes.BAD_REQUEST).json({
				message: "Erro de validação",
				errors: { id: ["ID inválido"] },
			});
			return;
		}

		const tokenPayload = req.token!;
		const response = await listarUsuarioPorId(idRequisitado, tokenPayload);
		res.status(StatusCodes.OK).json(response);
	} catch (error: unknown) {
		handleRouteError(res, error, "Erro ao listar usuário");
	}
});

userRoutes.patch(
	"/",
	autenticarMiddleware,
	validateRequest(updateUsuarioSchema),
	async (req, res) => {
		try {
			const tokenPayload = req.token!;
			await atualizarUsuario(req.body, tokenPayload);
			res.status(StatusCodes.NO_CONTENT).send();
		} catch (error: unknown) {
			handleRouteError(res, error, "Erro ao atualizar usuário");
		}
	},
);

userRoutes.delete("/", autenticarMiddleware, async (req, res) => {
	try {
		const tokenPayload = req.token!;
		await excluirUsuario({
			usuarioId: tokenPayload.usuarioId,
		});
		res.status(StatusCodes.NO_CONTENT).send();
	} catch (error: unknown) {
		handleRouteError(res, error, "Erro ao deletar usuário");
	}
});

export default userRoutes;
