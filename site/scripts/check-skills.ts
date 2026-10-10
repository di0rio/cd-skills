import { existsSync } from "node:fs";
import { join } from "node:path";

// O site lê `../skills` no build. Sem a pasta (Root Directory errado, clone parcial) o build falha aqui, em voz alta.
const dir = join(process.cwd(), "..", "skills");
if (!existsSync(dir)) {
	console.error(
		`skills/ não encontrada em ${dir}. Rode o build de dentro de site/, com o repositório inteiro.`,
	);
	process.exit(1);
}
