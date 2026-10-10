import type { MetadataRoute } from "next";
import { localePath } from "@/i18n/path";
import { site } from "@/lib/site";
import { skills } from "@/lib/skills";

// Cada página entra nas duas línguas, apontando uma pra outra (hreflang).
function entry(
	path: string,
	extra: Omit<MetadataRoute.Sitemap[number], "url"> = {},
): MetadataRoute.Sitemap {
	const pt = site.url + localePath("pt", path);
	const en = site.url + localePath("en", path);
	const languages = { "pt-BR": pt, en };
	return [
		{ url: pt, alternates: { languages }, ...extra },
		{ url: en, alternates: { languages }, ...extra },
	];
}

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		...entry("/", { changeFrequency: "monthly", priority: 1 }),
		...skills.flatMap((s) =>
			entry(`/${s.slug}`, { changeFrequency: "monthly", priority: 0.8 }),
		),
	];
}
