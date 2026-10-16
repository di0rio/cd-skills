import type { Metadata } from "next";
import { Avatar } from "@/components/avatar";
import { BenchTable, readBench } from "@/components/bench";
import { Corners } from "@/components/corners";
import { CtaBand } from "@/components/cta-band";
import { Decode } from "@/components/decode";
import { GlyphArt } from "@/components/glyph-art";
import { InstallPanel } from "@/components/install-panel";
import { Rich } from "@/components/rich";
import { Section } from "@/components/section";
import { walkItem } from "@/components/skill-blocks";
import { SkillCard } from "@/components/skill-card";
import { Walkthrough } from "@/components/walkthrough";
import { alternates, getT } from "@/i18n/server";
import { content } from "@/lib/content";
import { site } from "@/lib/site";
import { installAll, installOne, skills } from "@/lib/skills";

export async function generateMetadata(): Promise<Metadata> {
	const { t, locale } = await getT();
	return {
		title: { absolute: site.name },
		description: t.app.meta.description,
		alternates: alternates(locale, "/"),
	};
}

const pad = (n: number) => String(n).padStart(2, "0");

export default async function Home() {
	const { t, locale } = await getT();
	const copy = t.app.home;
	const { hero, how, demo, bench } = copy;
	const labels = t.components["site-shell"].copy;
	const cardLabels = {
		before: copy.skills.before,
		after: copy.skills.after,
		open: copy.skills.open,
	};
	// Texto das próprias skills: é com ele que o `cd/` do hero é desenhado.
	const pool = skills
		.map(({ source }) => source.replace(/[^!-~]/g, "").slice(0, 1600))
		.join("");
	const steps = [
		[how.step1, how.text1],
		[how.step2, how.text2],
		[how.step3, how.text3],
	] as const;
	const walk = skills.flatMap((skill) => {
		const idea = content(skill.slug)?.idea;
		return idea ? [walkItem(skill, idea, locale)] : [];
	});
	const benches = skills.flatMap((skill) => {
		const data = readBench(skill.slug);
		return data ? [{ skill, data }] : [];
	});
	let n = 1;

	return (
		<>
			<section className="wrap relative isolate grid items-center gap-12 pt-16 pb-4 sm:pt-24 lg:min-h-[min(calc(100dvh-14rem),44rem)] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-10 lg:pt-12">
				<div aria-hidden="true" className="grid-bg absolute inset-0 -z-10" />
				<div className="min-w-0">
					<p className="enter font-mono text-muted-foreground text-xs tracking-[0.1em] sm:text-sm">
						{hero.eyebrow({ count: String(skills.length) })}
					</p>
					<h1 className="display mt-6 text-[clamp(2.5rem,6.4vw,5.75rem)]">
						<Decode text={hero.line1} />{" "}
						<span className="block text-muted-foreground">
							<Decode text={hero.line2} />
						</span>
					</h1>
					<p className="enter mt-7 max-w-[44ch] text-lg text-muted-foreground sm:text-xl">
						<Rich text={hero.sub} />
					</p>
					<div className="enter mt-9 max-w-[40rem]">
						<InstallPanel
							agents={{
								label: t.app.install.agents,
								done: t.app.install.agentsDone,
								prompt: t.app.install.agentsPrompt({ command: installAll }),
							}}
							aside={
								<a
									className="rounded-sm font-mono text-muted-foreground text-sm outline-none transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand"
									href="#skills"
								>
									{hero.browse} <span aria-hidden="true">↓</span>
								</a>
							}
							copy={labels}
							label={t.app.install.tabs}
							large
							manual={{
								label: t.app.install.manual,
								body: (
									<>
										<p>
											<Rich text={t.app.install.manualClaude} />
										</p>
										<p>
											<Rich text={t.app.install.manualOthers} />
										</p>
									</>
								),
							}}
							tabs={[
								{
									id: "all",
									label: t.app.install.all,
									command: installAll,
								},
								...skills.map((skill) => ({
									id: skill.slug,
									label: skill.name,
									command: installOne(skill.slug),
								})),
							]}
						/>
					</div>
				</div>
				<div className="hero-art relative mx-auto mb-28 aspect-[2/1] w-full max-w-[36rem]">
					<GlyphArt pool={pool} />
					<Avatar
						alt={hero.avatar}
						className="absolute top-full left-1 mt-5 size-24 sm:size-28"
					/>
				</div>
			</section>

			<Section
				id="skills"
				label={copy.skills.label}
				n={n++}
				title={copy.skills.title}
			>
				{skills.length === 0 ? (
					<p className="text-muted-foreground">{copy.skills.empty}</p>
				) : (
					<ul className="relative grid border-t border-l lg:grid-cols-3">
						<Corners />
						{skills.map((skill, i) => (
							<SkillCard
								key={skill.slug}
								labels={cardLabels}
								locale={locale}
								n={i + 1}
								skill={skill}
							/>
						))}
					</ul>
				)}
			</Section>

			{walk.length > 0 && (
				<Section
					id="na-pratica"
					intro={demo.intro}
					label={demo.label}
					n={n++}
					title={demo.title}
				>
					<div data-reveal>
						<Walkthrough
							items={walk}
							labels={{
								steps: demo.steps,
								pick: demo.pick,
								removed: copy.skills.removed,
								added: copy.skills.added,
								list: [
									{ title: demo.step1, text: <Rich text={demo.text1} /> },
									{ title: demo.step2, text: <Rich text={demo.text2} /> },
									{ title: demo.step3, text: <Rich text={demo.text3} /> },
								],
							}}
						/>
					</div>
				</Section>
			)}

			{benches.length > 0 && (
				<Section
					id="benchmark"
					intro={bench.intro}
					label={bench.label}
					n={n++}
					title={bench.title}
				>
					<div className="flex flex-col gap-16">
						{benches.map(({ skill, data }) => (
							<div data-reveal key={skill.slug}>
								<BenchTable bench={data} labels={bench} slug={skill.slug} />
							</div>
						))}
					</div>
				</Section>
			)}

			<Section id="como-funciona" label={how.label} n={n++} title={how.title}>
				<ol className="relative grid border md:grid-cols-3 md:divide-x">
					<Corners />
					{steps.map(([title, text], i) => (
						<li
							className="border-b p-6 last:border-b-0 sm:p-8 md:border-b-0"
							data-reveal
							key={title}
						>
							<span className="font-bold font-mono text-5xl text-brand-foreground leading-none tabular-nums">
								{pad(i + 1)}
							</span>
							<h3 className="mt-6 font-bold font-mono text-xl">{title}</h3>
							<p className="mt-3 text-muted-foreground">{text}</p>
						</li>
					))}
				</ol>
			</Section>

			<CtaBand
				avatarAlt=""
				command={installAll}
				copy={labels}
				github={t.app.cta.github}
				githubUrl={site.github}
				label={t.app.cta.label}
				text={t.app.cta.text}
				title={t.app.cta.title}
			/>
		</>
	);
}
