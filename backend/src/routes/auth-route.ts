import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { LoginRequestSchema } from "@/dtos/requests/login-request";
import type { ErrorResponse } from "@/dtos/responses/error-response";
import { AppError } from "@/errors/app-error";
import { autenticarMiddleware } from "@/middlewares/autenticar";
import { doLogin } from "@/services/auth-service";

const authRoutes = Router();

authRoutes.post("/login", async (req, res) => {
	try {
		const result = LoginRequestSchema.safeParse(req.body);

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

		const response = await doLogin(result.data);

		res.status(StatusCodes.OK).json(response);
	} catch (error: unknown) {
		if (error instanceof AppError) {
			const errorResponse: ErrorResponse = {
				message: "Erro ao autenticar usuário",
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

authRoutes.post("/validar", autenticarMiddleware, async (_, res) => {
	res.status(StatusCodes.OK).json({ message: "Token válido" });
});

export default authRoutes;
