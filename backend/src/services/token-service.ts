import jwt from "jsonwebtoken";
import type { PapeisUsuario } from "@/models/usuario";
import { JWT_EXPIRATION_M, JWT_SECRET } from "@/utils/constants";

const ACCESS_TOKEN_SECRET = JWT_SECRET;
const TOKEN_EXPIRATION_TIME = Number(JWT_EXPIRATION_M) * 60;

export interface TokenPayload {
	usuarioId: number;
	email: string;
	papel: PapeisUsuario;
}

export const tokenService = {
	gerarToken: (payload: TokenPayload): string => {
		return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
			expiresIn: TOKEN_EXPIRATION_TIME,
		});
	},

	validarToken: (token: string): TokenPayload => {
		return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
	},
};
