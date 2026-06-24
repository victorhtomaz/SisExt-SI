import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { LoginRequestSchema } from "@/dtos/requests/login-request";
import { autenticarMiddleware } from "@/middlewares/autenticar";
import { validateRequest } from "@/middlewares/validate-request";
import { doLogin } from "@/services/auth-service";
import { handleRouteError } from "@/utils/handle-route-error";

const authRoutes = Router();

authRoutes.post(
	"/login",
	validateRequest(LoginRequestSchema),
	async (req, res) => {
		try {
			const response = await doLogin(req.body);
			res.status(StatusCodes.OK).json(response);
		} catch (error: unknown) {
			handleRouteError(res, error, "Erro ao autenticar usuário");
		}
	},
);

authRoutes.post("/validar", autenticarMiddleware, (_, res) => {
	res.status(StatusCodes.OK).json({ message: "Token válido" });
});

export default authRoutes;
