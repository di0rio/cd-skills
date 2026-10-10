import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { CommandLine } from "@/components/command-line";
import { Rich } from "@/components/rich";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { localePath } from "@/i18n/path";
import { alternates, getT } from "@/i18n/server";
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

export default async function Home() {
	const { t, locale } = await getT();
	const copy = t.app.home;
	const install = copy.install;
	const labels = t.components["site-shell"].copy;

	return (
		<>
			<header className="flex flex-col gap-6">
				<div>
					<h1 className="font-bold font-heading text-[22px] leading-tight">
						{copy.title}
					</h1>
					<p className="mt-1.5 max-w-[520px] text-pretty text-muted-foreground">
						<Rich text={copy.intro} />
					</p>
				</div>
				<CommandLine command={installAll} copy={labels} />
			</header>

			<section aria-labelledby="skills" className="scroll-mt-8">
				<h2 className="mb-5 text-muted-foreground" id="skills">
					{copy.list}
				</h2>
				{skills.length === 0 ? (
					<p className="text-muted-foreground">{copy.empty}</p>
				) : (
					<ul className="flex flex-col gap-6">
						{skills.map((skill, i) => (
							<li
								className="rise"
								key={skill.slug}
								style={{ "--i": i } as CSSProperties}
							>
								<Link
									className="rounded-sm font-mono text-base underline decoration-muted-foreground/40 underline-offset-4 outline-none transition-[text-decoration-color] duration-150 hover:decoration-brand focus-visible:ring-2 focus-visible:ring-brand"
									href={localePath(locale, `/${skill.slug}`)}
								>
									{skill.name}
								</Link>
								<p className="mt-1 max-w-[520px] text-pretty text-muted-foreground">
									{firstSentence(skill.description[locale])}
								</p>
							</li>
						))}
					</ul>
				)}
			</section>

			<section aria-labelledby="install" className="scroll-mt-8">
				<h2 className="mb-5 text-muted-foreground" id="install">
					{install.title}
				</h2>
				<Tabs defaultValue="cli">
					<TabsList aria-label={install.label}>
						<TabsTab value="cli">{install.cli}</TabsTab>
						<TabsTab value="claude">{install.claude}</TabsTab>
						<TabsTab value="others">{install.others}</TabsTab>
					</TabsList>
					<TabsPanel className="flex flex-col gap-3" value="cli">
						<p className="text-pretty text-muted-foreground">
							<Rich text={install.cliText} />
						</p>
						<CommandLine command={installAll} copy={labels} />
						<CommandLine command={installOne("<skill>")} copy={labels} />
					</TabsPanel>
					<TabsPanel value="claude">
						<p className="text-pretty text-muted-foreground">
							<Rich text={install.claudeText} />
						</p>
					</TabsPanel>
					<TabsPanel value="others">
						<p className="text-pretty text-muted-foreground">
							<Rich text={install.othersText} />
						</p>
					</TabsPanel>
				</Tabs>
			</section>
		</>
	);
}
