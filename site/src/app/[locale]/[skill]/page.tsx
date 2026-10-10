import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommandLine } from "@/components/command-line";
import { Markdown } from "@/components/markdown";
import { PageStepper } from "@/components/site-shell/page-stepper";
import { localePath } from "@/i18n/path";
import { alternates, getT } from "@/i18n/server";
import {
	firstSentence,
	installOne,
	type Skill,
	skills,
	skillUrl,
} from "@/lib/skills";

export const dynamicParams = false;

export function generateStaticParams() {
	return skills.map(({ slug }) => ({ skill: slug }));
}

export async function generateMetadata({
	params,
}: PageProps<"/[locale]/[skill]">): Promise<Metadata> {
	const { skill: slug } = await params;
	const skill = skills.find((s) => s.slug === slug);
	if (!skill) return {};
	const { locale } = await getT();
	return {
		title: skill.name,
		description: firstSentence(skill.description[locale]),
		alternates: alternates(locale, `/${skill.slug}`),
	};
}

const link =
	"underline decoration-muted-foreground/40 underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-brand";

export default async function SkillPage({
	params,
}: PageProps<"/[locale]/[skill]">) {
	const { skill: slug } = await params;
	const index = skills.findIndex((s) => s.slug === slug);
	if (index < 0) notFound();

	const skill = skills[index];
	const { t, locale } = await getT();
	const copy = t.app.skill;
	const shell = t.components["site-shell"];
	const readme = skill.readme[locale];
	const step = (
		s: Skill | undefined,
		label: (v: { title: string }) => string,
	) =>
		s && {
			href: localePath(locale, `/${s.slug}`),
			title: s.name,
			label: label({ title: s.name }),
		};

	return (
		<>
			<header className="-mb-4 flex flex-col gap-6">
				<div>
					<div className="flex items-center justify-between gap-3">
						<Link
							className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
							href={localePath(locale, "/")}
						>
							<ArrowLeftIcon aria-hidden="true" className="size-3.5" />
							{copy.back}
						</Link>
						<PageStepper
							current={index + 1}
							label={copy.nav}
							next={step(skills[index + 1], shell.stepper.next)}
							prev={step(skills[index - 1], shell.stepper.prev)}
							total={skills.length}
						/>
					</div>
					<h1 className="mt-6 font-bold font-mono text-[22px] leading-tight">
						{skill.name}
					</h1>
					<p className="mt-1.5 max-w-[520px] text-pretty text-muted-foreground">
						{firstSentence(skill.description[locale])}
					</p>
				</div>
				<CommandLine command={installOne(skill.slug)} copy={shell.copy} />
				<ul
					aria-label={copy.files}
					className="flex flex-wrap gap-x-4 gap-y-1 text-sm"
				>
					<li>
						<a
							className={link}
							href={skillUrl(skill.slug, "SKILL.md")}
							rel="noopener"
							target="_blank"
						>
							SKILL.md
						</a>
					</li>
					{skill.hasPt && (
						<li>
							<a
								className={link}
								href={skillUrl(skill.slug, "SKILL.pt.md")}
								rel="noopener"
								target="_blank"
							>
								SKILL.pt.md
							</a>
						</li>
					)}
					<li>
						<a
							className={link}
							href={skillUrl(skill.slug)}
							rel="noopener"
							target="_blank"
						>
							{copy.github}
						</a>
					</li>
				</ul>
			</header>

			{!readme.translated && (
				<p className="-mb-8 text-muted-foreground text-sm">
					{copy.onlyEnglish}
				</p>
			)}
			<Markdown copy={shell.copy} slug={skill.slug}>
				{readme.body}
			</Markdown>
		</>
	);
}
