import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
import { DATABASE_URL } from "@/utils/constants";

if (!DATABASE_URL) {
	console.error("A variável de ambiente DATABASE_URL não foi definida.");
	process.exit(1);
}

const pool = new pg.Pool({
	connectionString: DATABASE_URL,
	max: 1,
});

const db = drizzle(pool);

export async function runMigrations() {
	console.log("Inicializando migração com drizzle...");
	try {
		await migrate(db, { migrationsFolder: "./drizzle" });
		console.log("Migrações aplicadas com sucesso na base de dados!");

		await pool.end();
	} catch (error) {
		console.error("Falha crítica ao aplicar migrações:", error);
		await pool.end();
	}
}
