import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import userRoutes from "./routes/usuario-routes";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
	res
		.status(StatusCodes.OK)
		.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/usuarios", userRoutes);

export default app;
