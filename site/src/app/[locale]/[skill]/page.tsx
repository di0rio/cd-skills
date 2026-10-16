import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Avatar } from "@/components/avatar";
import { BenchTable, readBench } from "@/components/bench";
import { Corners } from "@/components/corners";
import { CtaBand } from "@/components/cta-band";
import { Decode } from "@/components/decode";
import { InView } from "@/components/in-view";
import { InstallPanel } from "@/components/install-panel";
import { Markdown } from "@/components/markdown";
import { Rich } from "@/components/rich";
import { Section } from "@/components/section";
import { PageStepper } from "@/components/site-shell/page-stepper";
import { Ladder, Modes, Stats, walkItem } from "@/components/skill-blocks";
import { SkillCard } from "@/components/skill-card";
import { Walkthrough } from "@/components/walkthrough";
import { localePath } from "@/i18n/path";
import { alternates, getT } from "@/i18n/server";
import { content, pick, portfolioUrl } from "@/lib/content";
import {
	firstSentence,
	installAll,
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
	"rounded-sm underline decoration-muted-foreground/40 underline-offset-4 outline-none transition-[text-decoration-color] duration-150 hover:decoration-brand focus-visible:ring-2 focus-visible:ring-brand";

type Block = {
	id: "idea" | "list" | "stats" | "modes" | "bench";
	title: string;
	intro?: string;
	body: ReactNode;
};

const pad = (n: number) => String(n).padStart(2, "0");

export default async function SkillPage({
	params,
}: PageProps<"/[locale]/[skill]">) {
	const { skill: slug } = await params;
	const index = skills.findIndex((s) => s.slug === slug);
	if (index < 0) notFound();

	const skill = skills[index];
	const { t, locale } = await getT();
	const copy = t.app.skill;
	const home = t.app.home;
	const shell = t.components["site-shell"];
	const readme = skill.readme[locale];
	const landing = content(skill.slug);
	const demo = home.demo;
	const bench = readBench(skill.slug);
	const others = skills.filter((s) => s.slug !== skill.slug);
	const cardLabels = {
		before: home.skills.before,
		after: home.skills.after,
		open: home.skills.open,
	};
	const step = (
		s: Skill | undefined,
		label: (v: { title: string }) => string,
	) =>
		s && {
			href: localePath(locale, `/${s.slug}`),
			title: s.name,
			label: label({ title: s.name }),
		};

	// Seções numeradas na ordem da página; o README é sempre a última.
	const blocks: Block[] = [
		landing?.idea && {
			id: "idea" as const,
			title: pick(landing.idea.title, locale),
			body: (
				<figure data-reveal>
					<Walkthrough
						items={[walkItem(skill, landing.idea, locale)]}
						labels={{
							steps: demo.steps,
							pick: demo.pick,
							removed: home.skills.removed,
							added: home.skills.added,
							list: [
								{ title: demo.step1, text: <Rich text={demo.text1} /> },
								{ title: demo.step2, text: <Rich text={demo.text2} /> },
								{ title: demo.step3, text: <Rich text={demo.text3} /> },
							],
						}}
					/>
					<figcaption className="mt-8 max-w-[62ch] text-muted-foreground">
						{pick(landing.idea.caption, locale)}
					</figcaption>
				</figure>
			),
		},
		landing?.list && {
			id: "list" as const,
			title: pick(landing.list.title, locale),
			intro: landing.list.intro && pick(landing.list.intro, locale),
			body: <Ladder items={landing.list.items} locale={locale} />,
		},
		!bench &&
			landing?.stats && {
				id: "stats" as const,
				title: pick(landing.stats.title, locale),
				body: (
					<>
						<InView>
							<Stats items={landing.stats.items} locale={locale} />
						</InView>
						{(landing.stats.caption || landing.stats.link) && (
							<p className="mt-6 max-w-[62ch] text-muted-foreground">
								{landing.stats.caption && pick(landing.stats.caption, locale)}{" "}
								{landing.stats.link && (
									<a
										className={`${link} whitespace-nowrap text-foreground`}
										href={portfolioUrl(locale, landing.stats.link.href)}
										rel="noopener noreferrer"
										target="_blank"
									>
										{pick(landing.stats.link.label, locale)}
										<span aria-hidden="true"> ↗</span>
									</a>
								)}
							</p>
						)}
					</>
				),
			},
		landing?.modes && {
			id: "modes" as const,
			title: pick(landing.modes.title, locale),
			intro: landing.modes.intro && pick(landing.modes.intro, locale),
			body: <Modes items={landing.modes.items} locale={locale} />,
		},
		bench && {
			id: "bench" as const,
			title: home.bench.title,
			intro: home.bench.intro,
			body: <BenchTable bench={bench} labels={home.bench} slug={skill.slug} />,
		},
	].filter((block) => !!block);

	return (
		<>
			<div className="wrap flex items-center justify-between gap-3 pt-10">
				<Link
					className="inline-flex items-center gap-1.5 rounded-sm text-muted-foreground text-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand"
					href={localePath(locale, "/#skills")}
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

			<section className="wrap grid items-start gap-10 pt-12 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_auto]">
				<div className="min-w-0">
					<p className="font-mono text-muted-foreground text-xs tracking-[0.1em] sm:text-sm">
						{"// "}skill{" "}
						<span className="text-brand-foreground">{pad(index + 1)}</span>
					</p>
					<h1 className="display mt-5 break-words text-[clamp(2.25rem,9vw,8rem)]">
						<Decode text={skill.name} />
					</h1>
					<p className="mt-6 max-w-[32ch] font-bold font-mono text-[clamp(1.375rem,2.8vw,2.25rem)] text-muted-foreground leading-tight tracking-[-0.02em]">
						<Decode
							text={
								landing
									? pick(landing.headline, locale)
									: firstSentence(skill.description[locale])
							}
						/>
					</p>
					{landing && (
						<p className="mt-5 max-w-[56ch] text-lg text-muted-foreground">
							{pick(landing.tagline, locale)}
						</p>
					)}
					<div className="mt-9 max-w-[44rem]">
						<InstallPanel
							copy={shell.copy}
							label={t.app.install.tabs}
							manual={{
								label: t.app.install.manual,
								body: (
									<p>
										<Rich text={copy.manual({ slug: skill.slug })} />
									</p>
								),
							}}
							tabs={[
								{
									id: "one",
									label: skill.name,
									command: installOne(skill.slug),
								},
								{ id: "all", label: t.app.install.all, command: installAll },
							]}
						/>
					</div>
					<ul
						aria-label={copy.files}
						className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm"
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
						{landing?.post && (
							<li>
								<a
									className={link}
									href={portfolioUrl(locale, landing.post)}
									rel="noopener noreferrer"
									target="_blank"
								>
									{copy.post}
									<span aria-hidden="true"> ↗</span>
								</a>
							</li>
						)}
					</ul>
				</div>
				<Avatar alt="" className="hidden lg:block lg:size-36" />
			</section>

			{blocks.map((block, i) => (
				<Section
					id={block.id}
					intro={block.intro && <Rich text={block.intro} />}
					key={block.id}
					label={copy.sections[block.id]}
					n={i + 1}
					title={block.title}
				>
					{block.body}
				</Section>
			))}

			<Section
				id="readme"
				label={copy.sections.readme}
				n={blocks.length + 1}
				title={copy.readme}
			>
				<details className="group" open={!landing}>
					<summary className="flex list-none items-center justify-between gap-4 rounded-xl border bg-card px-5 py-4 font-mono outline-none focus-visible:ring-2 focus-visible:ring-brand [&::-webkit-details-marker]:hidden">
						README.md
						<PlusIcon
							aria-hidden="true"
							className="size-5 text-brand-foreground transition-transform duration-200 ease-out group-open:rotate-45"
						/>
					</summary>
					<div className="mt-10 max-w-[760px]">
						{!readme.translated && (
							<p className="mb-6 text-muted-foreground text-sm">
								{copy.onlyEnglish}
							</p>
						)}
						<Markdown copy={shell.copy} slug={skill.slug}>
							{readme.body}
						</Markdown>
					</div>
				</details>
			</Section>

			{others.length > 0 && (
				<Section
					id="mais"
					label={copy.sections.related}
					n={blocks.length + 2}
					title={copy.relatedTitle}
				>
					<ul className="relative grid border-t border-l md:grid-cols-2">
						<Corners />
						{others.slice(0, 2).map((other) => (
							<SkillCard
								key={other.slug}
								labels={cardLabels}
								locale={locale}
								n={skills.indexOf(other) + 1}
								skill={other}
							/>
						))}
					</ul>
				</Section>
			)}

			<CtaBand
				avatarAlt=""
				command={installOne(skill.slug)}
				copy={shell.copy}
				github={t.app.cta.github}
				githubUrl={skillUrl(skill.slug)}
				label={t.app.cta.label}
				text={t.app.cta.text}
				title={t.app.cta.title}
			/>
		</>
	);
}
