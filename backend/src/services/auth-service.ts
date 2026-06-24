import bcrypt from "bcrypt";
import type { LoginRequest } from "@/dtos/requests/login-request";
import type { LoginResponse } from "@/dtos/responses/login-response";
import { UnauthorizedError } from "@/errors/app-error";
import { buscarUsuarioPorEmail } from "@/repositories/usuario-repository";
import { extrairPapelAtivo } from "@/utils/permissoes";
import { tokenService } from "./token-service";

export async function doLogin(request: LoginRequest): Promise<LoginResponse> {
	const usuario = await buscarUsuarioPorEmail(request.email);

	if (!usuario?.ativo) throw new UnauthorizedError("Credenciais inválidas");

	const senhaValida = await bcrypt.compare(request.senha, usuario.senhaHash);
	if (!senhaValida) throw new UnauthorizedError("Credenciais inválidas");

	const papelAtivo = extrairPapelAtivo(usuario);

	if (!papelAtivo) throw new UnauthorizedError("Credenciais inválidas");

	const accessToken = tokenService.gerarToken({
		usuarioId: usuario.id,
		email: usuario.email,
		papel: papelAtivo,
	});
	return { accessToken };
}
