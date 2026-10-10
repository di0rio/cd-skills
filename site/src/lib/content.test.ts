import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
	parseContent,
	pick,
	portfolioUrl,
	readContent,
	type Text,
} from "./content";
import { readSkills } from "./skills";

const valid = {
	tagline: { pt: "tag", en: "tag-en" },
	headline: { pt: "grande" },
	idea: {
		title: { pt: "a ideia" },
		kind: "diff",
		file: "a.ts",
		counter: "-1 +1",
		lines: [
			["-", "velho"],
			["+", "novo"],
		],
		caption: { pt: "legenda" },
	},
	modes: {
		title: { pt: "modos" },
		items: [{ term: "lite", text: { pt: "x" } }],
	},
	post: "/blog/x",
};

describe("readContent", () => {
	let dir: string;
	beforeAll(() => {
		dir = mkdtempSync(join(tmpdir(), "content-"));
		writeFileSync(join(dir, "ok.json"), JSON.stringify(valid));
		writeFileSync(join(dir, "ruim.json"), JSON.stringify({ tagline: "x" }));
		writeFileSync(join(dir, "quebrado.json"), "{");
	});
	afterAll(() => rmSync(dir, { recursive: true, force: true }));

	test("arquivo válido vira o conteúdo tipado", () => {
		const content = readContent(dir, "ok");
		expect(content?.headline).toEqual({ pt: "grande" });
		expect(content?.idea?.lines).toEqual([
			["-", "velho"],
			["+", "novo"],
		]);
		expect(content?.modes?.items[0].term).toEqual({ pt: "lite" });
	});

	test("sem arquivo dá undefined (a skill usa só o frontmatter e o README)", () => {
		expect(readContent(dir, "nao-existe")).toBeUndefined();
	});

	test("arquivo inválido falha dizendo o slug e o campo", () => {
		expect(() => readContent(dir, "ruim")).toThrow(/ruim\.json: .*tagline/);
		expect(() => readContent(dir, "quebrado")).toThrow(/quebrado\.json/);
	});
});

describe("parseContent", () => {
	test("sinal de linha do diff só aceita - ou +", () => {
		const bad = {
			...valid,
			idea: { ...valid.idea, lines: [["~", "x"]] },
		};
		expect(() => parseContent(bad)).toThrow(/idea\.lines\[0\]/);
	});

	test("kind desconhecido e post sem barra falham", () => {
		expect(() =>
			parseContent({ ...valid, idea: { ...valid.idea, kind: "outro" } }),
		).toThrow(/idea\.kind/);
		expect(() => parseContent({ ...valid, post: "blog/x" })).toThrow(/post/);
	});

	test("texto sem português falha", () => {
		expect(() => parseContent({ ...valid, tagline: { en: "only" } })).toThrow(
			/tagline\.pt/,
		);
	});
});

describe("idioma", () => {
	const text: Text = { pt: "oi", en: "hi" };

	test("pick devolve o idioma, e o português quando falta o inglês", () => {
		expect(pick(text, "en")).toBe("hi");
		expect(pick({ pt: "oi" }, "en")).toBe("oi");
		expect(pick({ pt: "oi" }, "pt")).toBe("oi");
	});

	test("caminho do portfólio ganha o prefixo do idioma; URL inteira não muda", () => {
		expect(portfolioUrl("pt", "/blog/x")).toBe(
			"https://cauadiorio.vercel.app/blog/x",
		);
		expect(portfolioUrl("en", "/blog/x")).toBe(
			"https://cauadiorio.vercel.app/en/blog/x",
		);
		expect(portfolioUrl("en", "https://github.com/x")).toBe(
			"https://github.com/x",
		);
	});
});

describe("content/ do repositório", () => {
	test("toda skill que tem JSON passa na validação", () => {
		const skills = readSkills(join(process.cwd(), "..", "skills"));
		const dir = join(process.cwd(), "content");
		for (const { slug } of skills) expect(readContent(dir, slug)).toBeDefined();
	});
});
