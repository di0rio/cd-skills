"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import type { Locale } from "@/i18n/generated";
import { localePath, stripLocale } from "@/i18n/path";
import { cn } from "@/lib/utils";

const locales: Locale[] = ["pt", "en"];
const SCROLL_KEY = "cd-locale-scroll";

/** O corpo da janela é quem rola, não o window. */
const scroller = () =>
	document.querySelector<HTMLElement>("[data-window-body]");

/**
 * pt/en como links de verdade (cada idioma é uma URL). O clique navega dentro de uma transição
 * pra esmaecer o conteúdo até a outra versão chegar.
 */
export function LocaleSwitch({
	label,
	locale,
}: {
	label: string;
	locale: Locale;
}) {
	const router = useRouter();
	const [pending, startTransition] = useTransition();
	const path = stripLocale(usePathname());

	// A troca remonta a janela (o scroll volta pra 0): devolve a posição guardada no clique.
	useEffect(() => {
		try {
			const saved = sessionStorage.getItem(SCROLL_KEY);
			if (saved === null) return;
			sessionStorage.removeItem(SCROLL_KEY);
			const [savedPath, y] = saved.split("|");
			if (savedPath !== path) return;
			// O conteúdo ainda pode estar crescendo (fontes, streaming): tenta por ~2s até alcançar.
			let tries = 0;
			const restore = () => {
				const el = scroller();
				if (!el) return;
				el.scrollTop = Number(y);
				if (Math.abs(el.scrollTop - Number(y)) > 1 && tries++ < 40)
					setTimeout(restore, 50);
			};
			restore();
		} catch {
			// storage bloqueado: a página abre no topo
		}
	}, [path]);

	// Sinaliza a troca pro CSS esmaecer o <main> até a página no outro idioma chegar.
	useEffect(() => {
		document.documentElement.toggleAttribute("data-pending", pending);
	}, [pending]);

	return (
		<nav
			aria-label={label}
			className="flex rounded-lg border p-0.5 font-mono text-sm"
		>
			{locales.map((l) => {
				const current = l === locale;
				return (
					<a
						aria-current={current ? "page" : undefined}
						className={cn(
							"rounded-md px-2 py-0.5 text-muted-foreground outline-none transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand",
							current && "bg-accent text-foreground",
						)}
						href={localePath(l, "/")}
						hrefLang={l}
						key={l}
						lang={l}
						onClick={(e) => {
							e.preventDefault();
							if (current) return;
							// Mesma página na outra URL de idioma (mantém a âncora, se tiver).
							const { pathname, hash } = window.location;
							try {
								sessionStorage.setItem(
									SCROLL_KEY,
									`${stripLocale(pathname)}|${scroller()?.scrollTop ?? 0}`,
								);
							} catch {
								// storage bloqueado: a página abre no topo
							}
							startTransition(() =>
								router.push(localePath(l, stripLocale(pathname)) + hash, {
									scroll: false,
								}),
							);
						}}
					>
						{l}
					</a>
				);
			})}
		</nav>
	);
}
