import type { NextFunction, Request, Response } from "express";
import { tokenService } from "@/services/token-service";

export function autenticarMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const authHeader = req.headers.authorization;

	const token = authHeader?.split(" ")[1];

	if (!token) {
		return res.status(401).json({
			error: "Acesso negado. Token de autenticação não fornecido.",
		});
	}

	try {
		tokenService.validarToken(token);

		next();
	} catch (error) {
		return res.status(403).json({
			error: "Token inválido ou expirado.",
		});
	}
}
