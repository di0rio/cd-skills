import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Locale } from "@/i18n/generated";
import { site } from "@/lib/site";

/** Texto por idioma. O português é o canônico: se faltar o inglês, `pick` devolve o português. */
export type Text = { pt: string; en?: string };

export type Idea = {
	title: Text;
	kind: "diff" | "beforeAfter";
	/** Só no `diff`: nome do arquivo e contador (`-6 +1`) da barra do bloco. */
	file?: string;
	counter?: string;
	/** Só no `diff`: `["-" | "+", linha]`. É código, não traduz. */
	lines: readonly (readonly ["-" | "+", string])[];
	/** Só no `beforeAfter`. */
	before?: Text;
	after?: Text;
	caption: Text;
};

/** Conteúdo da landing de uma skill (`site/content/<slug>.json`). Tudo é opcional menos o topo. */
export type SkillContent = {
	tagline: Text;
	headline: Text;
	idea?: Idea;
	list?: { title: Text; intro?: Text; items: Text[] };
	stats?: {
		title: Text;
		items: { value: string; label: Text }[];
		caption?: Text;
		/** `href` com `/` no começo é caminho do portfólio; o resto é URL inteira. */
		link?: { label: Text; href: string };
	};
	modes?: { title: Text; intro?: Text; items: { term: Text; text: Text }[] };
	/** Caminho do post no portfólio, ex.: `/blog/skill-humanizar`. */
	post?: string;
};

type Obj = Record<string, unknown>;

const fail = (path: string, expected: string): never => {
	throw new Error(`content: ${path} deve ser ${expected}`);
};

const obj = (value: unknown, path: string): Obj =>
	typeof value === "object" && value !== null && !Array.isArray(value)
		? (value as Obj)
		: fail(path, "um objeto");

const str = (value: unknown, path: string): string =>
	typeof value === "string" && value !== "" ? value : fail(path, "um texto");

const arr = (value: unknown, path: string): unknown[] =>
	Array.isArray(value) ? value : fail(path, "uma lista");

const text = (value: unknown, path: string): Text => {
	const { pt, en } = obj(value, path);
	return {
		pt: str(pt, `${path}.pt`),
		...(en === undefined ? {} : { en: str(en, `${path}.en`) }),
	};
};

const optional = <T>(
	value: unknown,
	path: string,
	parse: (value: unknown, path: string) => T,
) => (value === undefined ? undefined : parse(value, path));

const term = (value: unknown, path: string): Text =>
	typeof value === "string" ? { pt: str(value, path) } : text(value, path);

const line = (value: unknown, path: string) => {
	const [sign, code, ...rest] = arr(value, path);
	if ((sign !== "-" && sign !== "+") || typeof code !== "string" || rest.length)
		fail(path, 'um par ["-" ou "+", linha]');
	return [sign, code] as ["-" | "+", string];
};

function parseIdea(value: unknown, path: string): Idea {
	const o = obj(value, path);
	const kind = o.kind;
	if (kind !== "diff" && kind !== "beforeAfter")
		fail(`${path}.kind`, '"diff" ou "beforeAfter"');
	const base = {
		title: text(o.title, `${path}.title`),
		caption: text(o.caption, `${path}.caption`),
	};
	if (kind === "diff")
		return {
			...base,
			kind,
			file: optional(o.file, `${path}.file`, str),
			counter: optional(o.counter, `${path}.counter`, str),
			lines: arr(o.lines, `${path}.lines`).map((l, i) =>
				line(l, `${path}.lines[${i}]`),
			),
		};
	return {
		...base,
		kind: "beforeAfter",
		lines: [],
		before: text(o.before, `${path}.before`),
		after: text(o.after, `${path}.after`),
	};
}

const items = <T>(
	value: unknown,
	path: string,
	parse: (value: unknown, path: string) => T,
) => arr(value, path).map((item, i) => parse(item, `${path}[${i}]`));

/** Valida o JSON de uma skill e devolve o tipo. Erro diz o caminho do campo, pra o build falhar em voz alta. */
export function parseContent(raw: unknown): SkillContent {
	const o = obj(raw, "$");
	const list = optional(o.list, "list", obj);
	const stats = optional(o.stats, "stats", obj);
	const modes = optional(o.modes, "modes", obj);
	const link = stats && optional(stats.link, "stats.link", obj);
	const post = optional(o.post, "post", str);
	if (post && !post.startsWith("/"))
		fail("post", "um caminho que começa com /");

	return {
		tagline: text(o.tagline, "tagline"),
		headline: text(o.headline, "headline"),
		idea: optional(o.idea, "idea", parseIdea),
		list: list && {
			title: text(list.title, "list.title"),
			intro: optional(list.intro, "list.intro", text),
			items: items(list.items, "list.items", text),
		},
		stats: stats && {
			title: text(stats.title, "stats.title"),
			items: items(stats.items, "stats.items", (v, p) => {
				const item = obj(v, p);
				return {
					value: str(item.value, `${p}.value`),
					label: text(item.label, `${p}.label`),
				};
			}),
			caption: optional(stats.caption, "stats.caption", text),
			link: link && {
				label: text(link.label, "stats.link.label"),
				href: str(link.href, "stats.link.href"),
			},
		},
		modes: modes && {
			title: text(modes.title, "modes.title"),
			intro: optional(modes.intro, "modes.intro", text),
			items: items(modes.items, "modes.items", (v, p) => {
				const item = obj(v, p);
				return {
					term: term(item.term, `${p}.term`),
					text: text(item.text, `${p}.text`),
				};
			}),
		},
		post,
	};
}

/** `content/<slug>.json`, ou `undefined` se a skill não tem landing própria (a página usa só o frontmatter e o README). */
export function readContent(dir: string, slug: string) {
	const file = join(dir, `${slug}.json`);
	if (!existsSync(file)) return undefined;
	try {
		return parseContent(JSON.parse(readFileSync(file, "utf8")));
	} catch (error) {
		throw new Error(`${slug}.json: ${(error as Error).message}`);
	}
}

export const content = (slug: string) =>
	readContent(join(process.cwd(), "content"), slug);

export const pick = (value: Text, locale: Locale) => value[locale] ?? value.pt;

/** Caminho do portfólio (`/blog/x`) → URL com o prefixo do idioma. URL inteira passa como está. */
export const portfolioUrl = (locale: Locale, href: string) =>
	href.startsWith("/")
		? `${site.portfolio}${locale === "pt" ? "" : `/${locale}`}${href}`
		: href;
