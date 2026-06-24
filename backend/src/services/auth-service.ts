import bcrypt from "bcrypt";
import type { LoginRequest } from "@/dtos/requests/login-request";
import type { LoginResponse } from "@/dtos/responses/login-response";
import { UnauthorizedError } from "@/errors/app-error";
import { buscarUsuarioPorEmail } from "@/repositories/usuario-repository";
import { extrairPapelAtivo } from "@/utils/permissoes";
import { tokenService } from "./token-service";

export async function autenticarUsuario(
	credenciais: LoginRequest,
): Promise<LoginResponse> {
	const usuario = await buscarUsuarioPorEmail(credenciais.email);

	if (!usuario?.ativo) {
		throw new UnauthorizedError("Credenciais inválidas");
	}

	const isSenhaValida = await bcrypt.compare(
		credenciais.senha,
		usuario.senhaHash,
	);

	if (!isSenhaValida) {
		throw new UnauthorizedError("Credenciais inválidas");
	}

	const papelUsuario = extrairPapelAtivo(usuario);

	if (!papelUsuario) {
		throw new UnauthorizedError("Credenciais inválidas");
	}

	const accessToken = tokenService.gerarToken({
		usuarioId: usuario.id,
		email: usuario.email,
		papel: papelUsuario,
	});

	return { accessToken };
}
