import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET ?? "";
export const DATABASE_URL = process.env.DATABASE_URL ?? "";
export const JWT_EXPIRATION_M = process.env.JWT_EXPIRATION_M ?? "15";
