import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { createUsuarioSchema } from "@/dtos/requests/create-usuario-request";
import { updateUsuarioSchema } from "@/dtos/requests/update-usuario-request";
import type { ErrorResponse } from "@/dtos/responses/error-response";
import { AppError } from "@/errors/app-error";
import { autenticarMiddleware } from "@/middlewares/autenticar";
import {
	atualizarUsuario,
	createUserService,
	deletarUsuarioService,
	listarUsuarioPorId,
} from "@/services/usuario-service";

const userRoutes = Router();

userRoutes.post("/", async (req, res) => {
	try {
		const result = createUsuarioSchema.safeParse(req.body);

		if (!result.success) {
			const errorResponse: ErrorResponse = {
				message: "Erro de validação",
				errors: z.flattenError(result.error).fieldErrors as Record<
					string,
					string[]
				>,
			};
			return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
		}

		const { id, mensagem } = await createUserService(result.data);

		res.status(StatusCodes.CREATED).json({
			id: id,
			message: mensagem,
		});
	} catch (error: unknown) {
		if (error instanceof AppError) {
			const errorResponse: ErrorResponse = {
				message: "Erro ao criar usuário",
				errors: { general: [error.message] },
			};
			return res.status(error.statusCode).json(errorResponse);
		} else {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: error.message,
			});
		}
	}
});

userRoutes.get("/:id", autenticarMiddleware, async (req, res) => {
	try {
		const idRequisitado = parseInt(String(req.params.id), 10);
		const tokenPayload = req.token!;
		if (Number.isNaN(idRequisitado)) {
			const errorResponse: ErrorResponse = {
				message: "Erro de validação",
				errors: { id: ["ID inválido"] },
			};
			return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
		}

		const response = await listarUsuarioPorId(idRequisitado, tokenPayload);
		return res.status(StatusCodes.OK).json(response);
	} catch (error: unknown) {
		if (error instanceof AppError) {
			const errorResponse: ErrorResponse = {
				message: "Erro ao listar usuário",
				errors: { general: [error.message] },
			};
			return res.status(error.statusCode).json(errorResponse);
		} else {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: error.message,
			});
		}
	}
});

userRoutes.patch("/", autenticarMiddleware, async (req, res) => {
	try {
		const result = updateUsuarioSchema.safeParse(req.body);
		if (!result.success) {
			const errorResponse: ErrorResponse = {
				message: "Erro de validação",
				errors: z.flattenError(result.error).fieldErrors as Record<
					string,
					string[]
				>,
			};
			return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
		}
		const tokenPayload = req.token!;

		await atualizarUsuario(result.data, tokenPayload);
		return res.status(StatusCodes.OK).send();
	} catch (error: unknown) {
		if (error instanceof AppError) {
			const errorResponse: ErrorResponse = {
				message: "Erro ao atualizar usuário",
				errors: { general: [error.message] },
			};
			return res.status(error.statusCode).json(errorResponse);
		} else {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: error.message,
			});
		}
	}
});

userRoutes.delete("/", autenticarMiddleware, async (req, res) => {
	try {
		const tokenPayload = req.token;

		await deletarUsuarioService({
			usuarioId: tokenPayload?.usuarioId,
		});
		return res.status(StatusCodes.NO_CONTENT).send();
	} catch (error: unknown) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
});

export default userRoutes;
