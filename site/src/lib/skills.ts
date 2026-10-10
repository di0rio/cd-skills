import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, posix } from "node:path";
import type { Locale } from "@/i18n/generated";
import { site } from "@/lib/site";

export type Skill = {
	/** Nome da pasta em `skills/`: é a URL da página e o argumento do `--skill`. */
	slug: string;
	name: string;
	description: Record<Locale, string>;
	/** Existe `SKILL.pt.md` ao lado do `SKILL.md`. */
	hasPt: boolean;
	/** Corpo do `SKILL.md` (sem o frontmatter). */
	source: string;
	/** README sem o título. `translated: false` = não há versão nesse idioma, o texto é o inglês. */
	readme: Record<Locale, { body: string; translated: boolean }>;
};

const unquote = (value: string) =>
	value.length > 1 && /^(["']).*\1$/.test(value) ? value.slice(1, -1) : value;

/** Frontmatter simples (`chave: valor`, valor entre aspas ou continuado em linhas indentadas) e o resto do arquivo. */
export function parseFrontmatter(source: string) {
	const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
	if (!match) return { data: {} as Record<string, string>, body: source };
	const data: Record<string, string> = {};
	let key: string | undefined;
	for (const line of match[1].split(/\r?\n/)) {
		const pair = /^([\w-]+):\s*(.*)$/.exec(line);
		if (pair) {
			key = pair[1];
			data[key] = /^[>|][+-]?$/.test(pair[2]) ? "" : unquote(pair[2].trim());
		} else if (key && /^\s+\S/.test(line)) {
			data[key] = `${data[key]} ${line.trim()}`.trim();
		}
	}
	return { data, body: source.slice(match[0].length) };
}

/** Tira o `# título` do começo: a página já mostra o nome da skill. */
export const stripTitle = (markdown: string) =>
	markdown.replace(/^\s*# .*\r?\n+/, "");

/** Primeira frase de uma descrição, pra lista da home. */
export function firstSentence(text: string) {
	return /^[\s\S]+?[.!?](?=\s|$)/.exec(text)?.[0] ?? text;
}

function readIfExists(path: string) {
	return existsSync(path) ? readFileSync(path, "utf8") : undefined;
}

/** Lê `<dir>/<slug>/` de toda pasta que tem `SKILL.md`, em ordem alfabética. */
export function readSkills(dir: string): Skill[] {
	if (!existsSync(dir)) return [];
	return readdirSync(dir, { withFileTypes: true })
		.filter(
			(entry) =>
				entry.isDirectory() && existsSync(join(dir, entry.name, "SKILL.md")),
		)
		.map(({ name: slug }) => {
			const read = (file: string) => readIfExists(join(dir, slug, file));
			const { data: en, body: source } = parseFrontmatter(
				read("SKILL.md") ?? "",
			);
			const pt = parseFrontmatter(read("SKILL.pt.md") ?? "").data;
			const readmeEn = stripTitle(read("README.md") ?? "");
			const readmePt = read("README.pt.md");
			return {
				slug,
				name: en.name || slug,
				source,
				description: {
					en: en.description ?? "",
					pt: pt.description || en.description || "",
				},
				hasPt: read("SKILL.pt.md") !== undefined,
				readme: {
					en: { body: readmeEn, translated: true },
					pt:
						readmePt === undefined
							? { body: readmeEn, translated: false }
							: { body: stripTitle(readmePt), translated: true },
				},
			};
		})
		.sort((a, b) => a.slug.localeCompare(b.slug));
}

// O site vive em `site/` e lê `../skills` no build (ver scripts/check-skills.ts).
export const skills = readSkills(join(process.cwd(), "..", "skills"));

export const skillUrl = (slug: string, file?: string) =>
	file
		? `${site.github}/blob/${site.branch}/skills/${slug}/${file}`
		: `${site.github}/tree/${site.branch}/skills/${slug}`;

export const installAll = `npx skills add ${site.repo}`;
export const installOne = (slug: string) => `${installAll} --skill ${slug}`;

/**
 * Link relativo de um README (`SKILL.md`, `../../LICENSE`, `references/x.md`) → o mesmo arquivo no GitHub.
 * `src` vira raw (imagem). Caminho que termina em `/` é pasta (`tree`). Absolutos e âncoras ficam como estão.
 */
export function rewriteLink(url: string, slug: string, key = "href") {
	if (/^([a-z][a-z\d+.-]*:|#|\/\/)/i.test(url)) return url;
	const [, path, suffix] = /^([^?#]*)(.*)$/.exec(url) ?? [];
	const resolved = url.startsWith("/")
		? posix.normalize(path.slice(1))
		: posix.join("skills", slug, path);
	if (resolved.startsWith("..")) return `${site.github}${suffix}`;
	if (key === "src")
		return `https://raw.githubusercontent.com/${site.repo}/${site.branch}/${resolved}`;
	const kind = path.endsWith("/") ? "tree" : "blob";
	return `${site.github}/${kind}/${site.branch}/${resolved.replace(/\/$/, "")}${suffix}`;
}
