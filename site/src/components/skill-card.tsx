import Link from "next/link";
import type { Locale } from "@/i18n/generated";
import { localePath } from "@/i18n/path";
import { content, pick } from "@/lib/content";
import { firstSentence, type Skill } from "@/lib/skills";
import { SkillArt } from "./skill-art";

type Labels = { before: string; after: string; open: string };

/** Uma skill da grade: ilustração viva em cima, nome e frase embaixo. O card inteiro é o link (`after:inset-0`). */
export function SkillCard({
	skill,
	n,
	locale,
	labels,
}: {
	skill: Skill;
	n: number;
	locale: Locale;
	labels: Labels;
}) {
	const landing = content(skill.slug);
	return (
		<li className="row relative flex border-r border-b flex-col gap-5 p-5 outline-offset-[-2px] outline-ring has-[a:focus-visible]:outline-2 sm:p-7">
			<span
				aria-hidden="true"
				className="row-line absolute inset-x-0 -top-px h-px bg-brand"
			/>
			{landing?.idea && (
				<SkillArt
					idea={landing.idea}
					labels={labels}
					locale={locale}
					slug={skill.slug}
				/>
			)}
			<div className="flex min-w-0 flex-1 flex-col">
				<p className="flex items-baseline justify-between font-mono text-muted-foreground text-xs">
					<span className="row-index tabular-nums">
						{String(n).padStart(2, "0")}
					</span>
					<span aria-hidden="true">
						{labels.open} <span className="row-arrow inline-block">→</span>
					</span>
				</p>
				<h3 className="mt-3 font-bold font-mono text-[clamp(1.5rem,2.4vw,2rem)] leading-tight tracking-[-0.03em]">
					<Link
						className="outline-none [overflow-wrap:anywhere] after:absolute after:inset-0"
						href={localePath(locale, `/${skill.slug}`)}
					>
						{skill.name}
					</Link>
				</h3>
				<p className="mt-2 text-muted-foreground">
					{landing
						? pick(landing.tagline, locale)
						: firstSentence(skill.description[locale])}
				</p>
			</div>
		</li>
	);
}
