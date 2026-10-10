import type { Metadata } from "next";
import { Ubuntu, Ubuntu_Mono } from "next/font/google";
import { ViewTransition } from "react";
import "../globals.css";
import { GithubLink } from "@/components/site-shell/github-link";
import { LocaleSwitch } from "@/components/site-shell/locale-switch";
import { MotionToggle } from "@/components/site-shell/motion-toggle";
import { ThemeProvider } from "@/components/site-shell/theme-provider";
import { ThemeSwitch } from "@/components/site-shell/theme-switch";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WindowShell } from "@/components/window/window-shell";
import { localePath } from "@/i18n/path";
import { getT, locales } from "@/i18n/server";
import { site } from "@/lib/site";
import { skills } from "@/lib/skills";
import { cn } from "@/lib/utils";

const ubuntu = Ubuntu({
	subsets: ["latin"],
	weight: ["400", "500", "700"],
	variable: "--font-sans",
});
const ubuntuMono = Ubuntu_Mono({
	subsets: ["latin"],
	weight: ["400", "700"],
	variable: "--font-mono",
});

export const dynamicParams = false;

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
	const { t } = await getT();
	return {
		metadataBase: new URL(site.url),
		title: { default: site.name, template: `%s · ${site.name}` },
		description: t.app.meta.description,
	};
}

const footerLink =
	"rounded-sm underline decoration-muted-foreground/40 underline-offset-4 hover:text-foreground hover:decoration-brand";

export default async function RootLayout({
	children,
}: LayoutProps<"/[locale]">) {
	const { locale, t } = await getT();
	const shell = t.components["site-shell"];
	const tabs = [
		{ id: "/", href: localePath(locale, "/"), label: site.name },
		...skills.map(({ slug, name }) => ({
			id: `/${slug}`,
			href: localePath(locale, `/${slug}`),
			label: name,
		})),
	];

	return (
		<html
			className={cn(
				"h-full antialiased font-sans",
				ubuntu.variable,
				ubuntuMono.variable,
			)}
			lang={locale}
			suppressHydrationWarning
		>
			<body className="bg-desktop text-[16px] text-foreground leading-[1.65]">
				<ThemeProvider>
					<TooltipProvider>
						{/* Primeiro foco da página: pula a janela e vai direto pro conteúdo. */}
						<a
							className="sr-only rounded-md bg-background px-3 py-1.5 text-sm outline-none focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:ring-2 focus:ring-brand"
							href="#conteudo"
						>
							{shell.skip}
						</a>
						<div aria-hidden="true" className="wallpaper" />
						<WindowShell
							controls={
								<>
									<LocaleSwitch label={shell.language.label} locale={locale} />
									<ThemeSwitch labels={shell.theme} />
									<MotionToggle labels={shell.motion} />
									<GithubLink label={shell.nav.github} />
								</>
							}
							labels={{
								tabs: shell.window.tabs,
								back: shell.window.back,
								forward: shell.window.forward,
								address: shell.window.address,
								copied: shell.copy.done,
								close: shell.window.close,
								minimize: shell.window.minimize,
								zoom: shell.window.zoom,
								unzoom: shell.window.unzoom,
								open: shell.window.open,
								desktop: shell.window.desktop,
								hint: shell.window.hint,
							}}
							tabs={tabs}
						>
							{/* Trocar de página anima só o conteúdo; a janela e o rodapé ficam parados. */}
							<ViewTransition default="page">
								<main
									className="flex min-w-0 flex-col outline-none"
									id="conteudo"
									tabIndex={-1}
								>
									{children}
								</main>
							</ViewTransition>

							<footer className="mt-28 border-t sm:mt-40">
								<div className="wrap flex flex-col gap-10 py-14 sm:py-20">
									<p
										aria-hidden="true"
										className="font-bold font-mono text-[clamp(1.75rem,6.4vw,4.5rem)] leading-none tracking-[-0.04em]"
									>
										<span className="text-brand-foreground">~</span>/cd-skills{" "}
										<span className="text-muted-foreground">$</span>{" "}
										<span className="inline-block h-[0.85em] w-[0.5em] translate-y-[0.1em] animate-caret bg-brand motion-reduce:animate-none" />
									</p>
									<div className="flex flex-wrap items-center justify-between gap-4 text-muted-foreground text-sm">
										<a
											className={footerLink}
											href={site.github}
											rel="noopener"
											target="_blank"
										>
											{shell.footer.license} · {site.repo}
										</a>
										<a
											className={footerLink}
											href={site.portfolio}
											rel="noopener"
											target="_blank"
										>
											{shell.footer.made}
										</a>
									</div>
								</div>
							</footer>
						</WindowShell>
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
