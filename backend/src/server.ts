import process from "node:process";
import { runMigrations } from "./db/migrate";
import app from "./index";

const PORT = process.env.PORT || 3000;

async function startServer() {
	await runMigrations();

	app.listen(PORT, () => {
		console.log(`Servidor rodando na porta: ${PORT}`);
	});
}

startServer();
