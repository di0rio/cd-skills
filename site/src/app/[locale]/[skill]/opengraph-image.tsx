import { translations } from "@/i18n/generated";
import { locales } from "@/i18n/server";
import { ogSize, pageOg } from "@/lib/og";
import { firstSentence, skills } from "@/lib/skills";

export const alt = "skill";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
	return skills.map(({ slug }) => ({ skill: slug }));
}

export default async function Image({
	params,
}: {
	params: Promise<{ locale: string; skill: string }>;
}) {
	const { locale, skill: slug } = await params;
	const lang = locales.find((l) => l === locale) ?? "pt";
	// Só skills da lista: senão qualquer nome na URL viraria uma imagem.
	const skill = skills.find((s) => s.slug === slug);
	if (!skill) return new Response(null, { status: 404 });
	return pageOg({
		path: skill.slug,
		title: skill.name,
		description:
			firstSentence(skill.description[lang]) ||
			translations[lang].app.meta.description,
	});
}
