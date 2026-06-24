import { z } from "zod";

export const LoginRequestSchema = z.object({
	email: z.string("O email é obrigatório"),
	senha: z.string("A senha é obrigatória"),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
