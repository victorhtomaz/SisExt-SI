import type { TokenPayload } from "@/services/token-service";

declare global {
	namespace Express {
		interface Request {
			token?: TokenPayload;
		}
	}
}
