import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { type AnyZodObject, ZodError } from "zod";
import type { ErrorResponse } from "@/dtos/responses/error-response";

export const validateRequest = (schema: AnyZodObject) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			req.body = schema.parse(req.body);
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const errorResponse: ErrorResponse = {
					message: "Erro de validação",
					errors: error.flatten().fieldErrors as Record<string, string[]>,
				};
				res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
				return;
			}
			next(error);
		}
	};
};
