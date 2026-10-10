"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { stripLocale } from "@/i18n/path";
import { cn } from "@/lib/utils";

export type Tab = {
	/** Caminho sem idioma: `/` ou `/<slug>`. */
	id: string;
	href: string;
	label: string;
};

/** Uma aba por página: a home primeiro, depois cada skill. Links de verdade; a aba ativa tem a cor da barra de baixo. */
export function TabStrip({ tabs, label }: { tabs: Tab[]; label: string }) {
	const current = stripLocale(usePathname() ?? "/");
	const scroller = useRef<HTMLUListElement>(null);

	// Borda esmaecida só do lado que ainda tem aba escondida; a aba ativa sempre aparece.
	useEffect(() => {
		const el = scroller.current;
		if (!el) return;
		const fades = () => {
			el.toggleAttribute("data-fade-l", el.scrollLeft > 1);
			el.toggleAttribute(
				"data-fade-r",
				el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
			);
		};
		el.querySelector("[aria-current]")?.scrollIntoView({
			block: "nearest",
			inline: "nearest",
		});
		fades();
		el.addEventListener("scroll", fades, { passive: true });
		const resize = new ResizeObserver(fades);
		resize.observe(el);
		return () => {
			el.removeEventListener("scroll", fades);
			resize.disconnect();
		};
	}, []);

	return (
		<nav aria-label={label} className="min-w-0 self-end">
			<ul className="tabs-scroll flex items-end gap-0.5" ref={scroller}>
				{tabs.map((tab) => {
					const active = tab.id === current;
					return (
						<li className="shrink-0" key={tab.id}>
							<Link
								aria-current={active ? "page" : undefined}
								className={cn(
									"flex h-[34px] w-[9.5rem] items-center gap-2 rounded-t-lg px-3 font-mono text-[13px] outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset",
									active
										? "bg-chrome text-foreground"
										: "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
								)}
								href={tab.href}
							>
								<span
									aria-hidden="true"
									className={cn(
										"size-2 shrink-0 rounded-full",
										active || tab.id === "/"
											? "bg-brand"
											: "bg-muted-foreground/50",
									)}
								/>
								<span className="truncate">{tab.label}</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
