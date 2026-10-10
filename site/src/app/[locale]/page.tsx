import type { Metadata } from "next";
import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { CommandLine } from "@/components/command-line";
import { Decode } from "@/components/decode";
import { GlyphArt } from "@/components/glyph-art";
import { Rich } from "@/components/rich";
import { Section } from "@/components/section";
import { MiniDemo } from "@/components/skill-blocks";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { localePath } from "@/i18n/path";
import { alternates, getT } from "@/i18n/server";
import { content, pick } from "@/lib/content";
import { site } from "@/lib/site";
import { firstSentence, installAll, installOne, skills } from "@/lib/skills";

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
	const { hero, how, install } = copy;
	const labels = t.components["site-shell"].copy;
	const demoLabels = {
		removed: copy.skills.removed,
		added: copy.skills.added,
		before: copy.skills.before,
		after: copy.skills.after,
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

	return (
		<>
			<section className="wrap grid items-center gap-12 pt-16 pb-4 sm:pt-24 lg:min-h-[min(calc(100dvh-14rem),44rem)] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-10 lg:pt-12">
				<div>
					<p className="enter font-mono text-muted-foreground text-xs uppercase tracking-[0.2em] sm:text-sm">
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
					<div className="enter mt-9 flex flex-wrap items-center gap-3">
						<Button
							nativeButton={false}
							render={<a href="#instalar" />}
							size="lg"
							variant="brand"
						>
							{hero.install}
						</Button>
						<Button
							nativeButton={false}
							render={<a href="#skills" />}
							size="lg"
							variant="ghost"
						>
							{hero.browse}
							<span aria-hidden="true">↓</span>
						</Button>
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
				n={1}
				title={copy.skills.title}
			>
				{skills.length === 0 ? (
					<p className="text-muted-foreground">{copy.skills.empty}</p>
				) : (
					<ul className="border-b">
						{skills.map((skill, i) => {
							const landing = content(skill.slug);
							return (
								<li
									data-reveal
									className="row relative border-t outline-offset-[-2px] outline-ring has-[a:focus-visible]:outline-2"
									key={skill.slug}
								>
									<span
										aria-hidden="true"
										className="row-line absolute inset-x-0 -top-px h-px bg-brand"
									/>
									<div className="grid items-start gap-x-8 gap-y-6 py-8 sm:py-10 xl:grid-cols-[4.5rem_minmax(0,1fr)_22rem_5rem]">
										<span className="row-index font-bold font-mono text-[2.5rem] text-muted-foreground leading-none tabular-nums sm:text-[3.25rem]">
											{pad(i + 1)}
										</span>
										<div className="min-w-0">
											<h3 className="font-bold font-mono text-[clamp(1.75rem,3.1vw,2.5rem)] leading-tight tracking-[-0.03em]">
												<Link
													className="whitespace-nowrap outline-none after:absolute after:inset-0"
													href={localePath(locale, `/${skill.slug}`)}
												>
													{skill.name}
												</Link>
											</h3>
											<p className="mt-3 max-w-[42ch] text-lg text-muted-foreground">
												{landing
													? pick(landing.tagline, locale)
													: firstSentence(skill.description[locale])}
											</p>
										</div>
										{landing?.idea ? (
											<MiniDemo
												idea={landing.idea}
												labels={demoLabels}
												locale={locale}
											/>
										) : (
											<span />
										)}
										<span
											aria-hidden="true"
											className="row-open hidden justify-self-end font-mono text-muted-foreground xl:block"
										>
											{copy.skills.open}{" "}
											<span className="row-arrow inline-block">→</span>
										</span>
									</div>
								</li>
							);
						})}
					</ul>
				)}
			</Section>

			<Section id="como-funciona" label={how.label} n={2} title={how.title}>
				<ol className="grid gap-x-10 gap-y-12 md:grid-cols-3">
					{steps.map(([title, text], i) => (
						<li className="border-t pt-6" data-reveal key={title}>
							<span className="font-bold font-mono text-5xl text-brand-foreground leading-none tabular-nums">
								{pad(i + 1)}
							</span>
							<h3 className="mt-6 font-bold font-mono text-xl">{title}</h3>
							<p className="mt-3 text-muted-foreground">{text}</p>
						</li>
					))}
				</ol>
			</Section>

			<Section id="instalar" label={install.label} n={3} title={install.title}>
				<Tabs data-reveal defaultValue="cli">
					<TabsList aria-label={install.tabs} className="w-full sm:w-fit">
						<TabsTab
							className="h-auto min-h-8 flex-1 whitespace-normal px-2 py-1 text-center leading-tight sm:h-8 sm:flex-none sm:px-3.5"
							value="cli"
						>
							{install.cli}
						</TabsTab>
						<TabsTab
							className="h-auto min-h-8 flex-1 whitespace-normal px-2 py-1 text-center leading-tight sm:h-8 sm:flex-none sm:px-3.5"
							value="claude"
						>
							{install.claude}
						</TabsTab>
						<TabsTab
							className="h-auto min-h-8 flex-1 whitespace-normal px-2 py-1 text-center leading-tight sm:h-8 sm:flex-none sm:px-3.5"
							value="others"
						>
							{install.others}
						</TabsTab>
					</TabsList>
					<TabsPanel className="mt-4 flex flex-col gap-4" value="cli">
						<p className="max-w-[56ch] text-lg text-muted-foreground">
							<Rich text={install.cliText} />
						</p>
						<CommandLine command={installAll} copy={labels} large />
						<CommandLine command={installOne("<skill>")} copy={labels} large />
					</TabsPanel>
					<TabsPanel className="mt-4" value="claude">
						<p className="max-w-[56ch] rounded-xl border bg-card p-6 text-lg sm:p-8">
							<Rich text={install.claudeText} />
						</p>
					</TabsPanel>
					<TabsPanel className="mt-4" value="others">
						<p className="max-w-[56ch] rounded-xl border bg-card p-6 text-lg sm:p-8">
							<Rich text={install.othersText} />
						</p>
					</TabsPanel>
				</Tabs>
			</Section>
		</>
	);
}
