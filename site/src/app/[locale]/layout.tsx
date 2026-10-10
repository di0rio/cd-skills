import type { Metadata } from "next";
import { Ubuntu, Ubuntu_Mono } from "next/font/google";
import { ViewTransition } from "react";
import "../globals.css";
import { LocaleSwitch } from "@/components/site-shell/locale-switch";
import { SitePrompt } from "@/components/site-shell/site-prompt";
import { ThemeProvider } from "@/components/site-shell/theme-provider";
import { ThemeSwitch } from "@/components/site-shell/theme-switch";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getT, locales } from "@/i18n/server";
import { site } from "@/lib/site";
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

const navLink =
	"rounded-md px-2 py-1 outline-none transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand";
const footerLink =
	"rounded-sm underline decoration-muted-foreground/40 underline-offset-4 hover:text-foreground hover:decoration-brand";

export default async function RootLayout({
	children,
}: LayoutProps<"/[locale]">) {
	const { locale, t } = await getT();
	const shell = t.components["site-shell"];

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
			<body className="flex min-h-full flex-col bg-background text-[15px] text-foreground leading-[1.65]">
				<ThemeProvider>
					<TooltipProvider>
						{/* Primeiro foco da página: pula o header e vai direto pro conteúdo. */}
						<a
							className="sr-only rounded-md bg-background px-3 py-1.5 text-sm outline-none focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:ring-2 focus:ring-brand"
							href="#conteudo"
						>
							{shell.skip}
						</a>
						{/* Uma coluna só (640px): header, conteúdo e rodapé alinhados no mesmo eixo. */}
						<header className="mx-auto grid w-full max-w-[640px] grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 px-4 pt-6 sm:grid-cols-[1fr_auto_1fr]">
							<SitePrompt label={shell.nav.home} locale={locale} />
							<nav
								aria-label={shell.nav.label}
								className="max-sm:order-last max-sm:col-span-2 max-sm:-mx-2"
							>
								<ul className="flex items-center gap-1 text-muted-foreground text-sm">
									<li>
										<a
											className={navLink}
											href={site.github}
											rel="noopener"
											target="_blank"
										>
											{shell.nav.github}
										</a>
									</li>
									<li>
										<a
											className={navLink}
											href={site.portfolio}
											rel="noopener"
											target="_blank"
										>
											{shell.nav.portfolio}
										</a>
									</li>
								</ul>
							</nav>
							<div className="flex items-center gap-2 justify-self-end">
								<LocaleSwitch label={shell.language.label} locale={locale} />
								<ThemeSwitch labels={shell.theme} />
							</div>
						</header>

						{/* Trocar de página anima só o conteúdo; header e rodapé ficam parados. */}
						<ViewTransition default="page">
							<main
								className="mx-auto flex w-full min-w-0 max-w-[640px] flex-1 flex-col gap-16 px-4 pt-16 pb-24 outline-none"
								id="conteudo"
								tabIndex={-1}
							>
								{children}
							</main>
						</ViewTransition>

						<footer className="mx-auto flex w-full max-w-[640px] flex-wrap items-center justify-between gap-4 border-t px-4 py-6 text-muted-foreground text-sm">
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
						</footer>
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
