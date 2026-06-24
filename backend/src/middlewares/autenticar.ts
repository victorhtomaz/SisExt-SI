import type { NextFunction, Request, Response } from "express";
import { existeUsuarioAtivoComId } from "@/repositories/usuario-repository";
import { tokenService } from "@/services/token-service";

export async function autenticarMiddleware(
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
		const decodedToken = tokenService.validarToken(token);
		const usuarioExiste = await existeUsuarioAtivoComId(decodedToken.usuarioId);
		if (!usuarioExiste) {
			return res.status(401).json({
				error: "Acesso negado.",
			});
		}

		req.token = decodedToken;
		next();
	} catch (_error) {
		return res.status(403).json({
			error: "Token inválido ou expirado.",
		});
	}
}
