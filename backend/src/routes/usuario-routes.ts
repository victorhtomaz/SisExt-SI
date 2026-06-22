import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { createUsuarioSchema } from "@/dtos/requests/create-usuario-request";
import type { ErrorResponse } from "@/dtos/responses/error-response";
import { AppError } from "@/errors/app-error";
import { createUserService } from "@/services/usuario-service";

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

export default userRoutes;
