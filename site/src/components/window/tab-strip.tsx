"use client";

import { PlusIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { stripLocale } from "@/i18n/path";
import { cn } from "@/lib/utils";

export type Tab = {
	/** Caminho sem idioma: `/` ou `/<slug>`. */
	id: string;
	href: string;
	label: string;
};

/**
 * Uma aba por página, no estilo do Chrome: a home primeiro, depois cada skill. Links de verdade; a aba ativa tem a
 * cor da barra de baixo e os "pés" curvos que a emendam nela. A aba fica ativa já no pointerdown (otimista) e
 * todas as rotas são pré-carregadas, então trocar de aba não espera a rede. O × e o + são só enfeite (nada pra
 * fechar ou abrir), por isso ficam escondidos do teclado e do leitor de tela.
 */
export function TabStrip({ tabs, label }: { tabs: Tab[]; label: string }) {
	const router = useRouter();
	const pathname = stripLocale(usePathname() ?? "/");
	/** Aba tocada que a URL ainda não alcançou (vale só enquanto a URL é a de antes do toque). */
	const [touched, setTouched] = useState<{ id: string; from: string } | null>(
		null,
	);
	const clicked = useRef(false);
	const scroller = useRef<HTMLUListElement>(null);
	const current = touched?.from === pathname ? touched.id : pathname;
	const touch = (id: string) => setTouched({ id, from: pathname });

	// Pré-carrega todas as abas (no dev o Next ignora).
	useEffect(() => {
		for (const tab of tabs) router.prefetch(tab.href);
	}, [tabs, router]);

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
		<nav aria-label={label} className="flex min-w-0 flex-1 items-end self-end">
			<ul
				className="tabs-scroll flex min-w-0 items-end px-2.5"
				ref={scroller}
				style={{ "--tabs": tabs.length } as CSSProperties}
			>
				{tabs.map((tab) => {
					const active = tab.id === current;
					return (
						<li className="tab-item" key={tab.id}>
							<Link
								aria-current={active ? "page" : undefined}
								className="tab"
								href={tab.href}
								onClick={() => {
									clicked.current = true;
									touch(tab.id);
								}}
								onPointerDown={(event) => {
									if (
										event.button !== 0 ||
										event.ctrlKey ||
										event.metaKey ||
										event.shiftKey ||
										event.altKey
									)
										return;
									clicked.current = false;
									touch(tab.id);
								}}
								onPointerLeave={() => {
									if (!clicked.current) setTouched(null);
								}}
								prefetch
							>
								<span aria-hidden="true" className="tab-pill" />
								{tab.id === "/" ? (
									<Image
										alt=""
										className="relative size-4 shrink-0 rounded-[3px]"
										height={16}
										src="/icon.svg"
										unoptimized
										width={16}
									/>
								) : (
									<span
										aria-hidden="true"
										className={cn(
											"relative size-2.5 shrink-0 rounded-full",
											active ? "bg-brand" : "bg-muted-foreground/50",
										)}
									/>
								)}
								<span className="tab-title">{tab.label}</span>
								<XIcon aria-hidden="true" className="tab-close" />
							</Link>
						</li>
					);
				})}
			</ul>
			<span aria-hidden="true" className="tab-new">
				<PlusIcon />
			</span>
		</nav>
	);
}
