import type { Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { ErrorResponse } from "@/dtos/responses/error-response";
import { AppError } from "@/errors/app-error";

export function handleRouteError(
	res: Response,
	error: unknown,
	defaultMessage: string,
) {
	if (error instanceof AppError) {
		const errorResponse: ErrorResponse = {
			message: defaultMessage,
			errors: { general: [error.message] },
		};
		res.status(error.statusCode).json(errorResponse);
		return;
	}

	const errorMessage = error instanceof Error ? error.message : "Erro interno";
	res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
		message: errorMessage,
	});
}
