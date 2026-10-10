import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
	firstSentence,
	installOne,
	parseFrontmatter,
	readSkills,
	rewriteLink,
	skillUrl,
	stripTitle,
} from "./skills";

const gh = "https://github.com/di0rio/cd-skills";

describe("parseFrontmatter", () => {
	test("lê chaves simples e tira as aspas", () => {
		const { data, body } = parseFrontmatter(
			'---\nname: demo\ndescription: "Faz isso: e aquilo."\nargument-hint: "[lite|full]"\n---\n\n# Demo\n',
		);
		expect(data).toEqual({
			name: "demo",
			description: "Faz isso: e aquilo.",
			"argument-hint": "[lite|full]",
		});
		expect(body).toBe("\n# Demo\n");
	});

	test("aspas no meio do valor ficam", () => {
		const { data } = parseFrontmatter(
			'---\ndescription: Reescreve textos com "cara de IA" pra soar natural.\n---\n',
		);
		expect(data.description).toBe(
			'Reescreve textos com "cara de IA" pra soar natural.',
		);
	});

	test("junta linhas indentadas e entende > e CRLF", () => {
		const { data } = parseFrontmatter(
			"---\r\nname: a\r\ndescription: >\r\n  primeira\r\n  segunda\r\n---\r\ncorpo",
		);
		expect(data.description).toBe("primeira segunda");
	});

	test("sem frontmatter devolve o texto inteiro", () => {
		expect(parseFrontmatter("# só texto")).toEqual({
			data: {},
			body: "# só texto",
		});
	});
});

describe("stripTitle e firstSentence", () => {
	test("tira só o primeiro # título", () => {
		expect(stripTitle("# demo\n\nTexto.\n\n# outro\n")).toBe(
			"Texto.\n\n# outro\n",
		);
		expect(stripTitle("Texto sem título")).toBe("Texto sem título");
	});

	test("primeira frase da descrição", () => {
		expect(firstSentence("Simples e curto. Use quando quiser.")).toBe(
			"Simples e curto.",
		);
		expect(firstSentence("Sem ponto final")).toBe("Sem ponto final");
	});
});

describe("rewriteLink", () => {
	test("arquivo da própria skill vira blob do GitHub", () => {
		expect(rewriteLink("SKILL.md", "humanizar")).toBe(
			`${gh}/blob/main/skills/humanizar/SKILL.md`,
		);
		expect(rewriteLink("./references/patterns.md", "humanizar")).toBe(
			`${gh}/blob/main/skills/humanizar/references/patterns.md`,
		);
	});

	test("sobe pastas até a raiz do repositório", () => {
		expect(rewriteLink("../../LICENSE", "clean-code-ai")).toBe(
			`${gh}/blob/main/LICENSE`,
		);
		expect(rewriteLink("../../bench/clean-code-ai/", "clean-code-ai")).toBe(
			`${gh}/tree/main/bench/clean-code-ai`,
		);
	});

	test("mantém âncora e query", () => {
		expect(rewriteLink("SKILL.md#install", "x")).toBe(
			`${gh}/blob/main/skills/x/SKILL.md#install`,
		);
	});

	test("caminho com / no começo parte da raiz do repositório", () => {
		expect(rewriteLink("/README.md", "x")).toBe(`${gh}/blob/main/README.md`);
	});

	test("imagem (src) vira raw", () => {
		expect(rewriteLink("img/a.png", "x", "src")).toBe(
			"https://raw.githubusercontent.com/di0rio/cd-skills/main/skills/x/img/a.png",
		);
	});

	test("absolutos, âncoras e mailto não mudam", () => {
		for (const url of [
			"https://skills.sh",
			"#uso",
			"//cdn.x/a",
			"mailto:a@b.c",
		])
			expect(rewriteLink(url, "x")).toBe(url);
	});

	test("caminho que foge do repositório cai na raiz dele", () => {
		expect(rewriteLink("../../../etc/passwd", "x")).toBe(gh);
	});
});

describe("urls", () => {
	test("links da skill no GitHub e comando de instalação", () => {
		expect(skillUrl("humanizar", "SKILL.pt.md")).toBe(
			`${gh}/blob/main/skills/humanizar/SKILL.pt.md`,
		);
		expect(skillUrl("humanizar")).toBe(`${gh}/tree/main/skills/humanizar`);
		expect(installOne("humanizar")).toBe(
			"npx skills add di0rio/cd-skills --skill humanizar",
		);
	});
});

describe("readSkills", () => {
	let dir: string;
	const write = (path: string, text: string) => {
		mkdirSync(join(dir, path, ".."), { recursive: true });
		writeFileSync(join(dir, path), text);
	};

	beforeAll(() => {
		dir = mkdtempSync(join(tmpdir(), "skills-"));
		write(
			"zeta/SKILL.md",
			"---\nname: zeta\ndescription: Only English.\n---\n",
		);
		write("zeta/README.md", "# Zeta\n\nEnglish body only.\n");
		write(
			"alfa/SKILL.md",
			"---\nname: alfa\ndescription: English text.\n---\n\n# Alfa\n\nRule one.\n",
		);
		write(
			"alfa/SKILL.pt.md",
			"---\nname: alfa\ndescription: Texto em português.\n---\n",
		);
		write("alfa/README.md", "# Alfa\n\nEnglish body.\n");
		write("alfa/README.pt.md", "# Alfa\n\nCorpo em português.\n");
		write("bench/README.md", "# não é skill\n");
	});

	afterAll(() => rmSync(dir, { recursive: true, force: true }));

	test("só pastas com SKILL.md, em ordem alfabética", () => {
		expect(readSkills(dir).map((s) => s.slug)).toEqual(["alfa", "zeta"]);
	});

	test("descrição no idioma, com fallback pro inglês", () => {
		const [alfa, zeta] = readSkills(dir);
		expect(alfa.description).toEqual({
			en: "English text.",
			pt: "Texto em português.",
		});
		expect(zeta.description.pt).toBe("Only English.");
		expect(zeta.hasPt).toBe(false);
		expect(alfa.hasPt).toBe(true);
	});

	test("README em pt quando existe; senão o inglês, marcado como não traduzido", () => {
		const [alfa, zeta] = readSkills(dir);
		expect(alfa.readme.pt).toEqual({
			body: "Corpo em português.\n",
			translated: true,
		});
		expect(alfa.readme.en.body).toBe("English body.\n");
		expect(zeta.readme.pt).toEqual({
			body: "English body only.\n",
			translated: false,
		});
	});

	test("source é o corpo do SKILL.md, sem o frontmatter", () => {
		const [alfa, zeta] = readSkills(dir);
		expect(alfa.source).toBe("\n# Alfa\n\nRule one.\n");
		expect(zeta.source).toBe("");
	});

	test("pasta que não existe dá lista vazia", () => {
		expect(readSkills(join(dir, "nada"))).toEqual([]);
	});
});
