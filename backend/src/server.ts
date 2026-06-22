import process from "node:process";
import app from "./index";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Servidor rodando na porta: ${PORT}`);
});
