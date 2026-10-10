"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";
import { motionOff } from "@/lib/motion";

/**
 * Esconde o conteúdo (barras zeradas, via CSS) até a primeira vez que ele entra na tela, e aí marca `data-in`
 * pra animar. Sem JS, com movimento pausado ou já visível na carga, nada fica escondido.
 */
export function InView({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		const el = ref.current;
		if (!el || motionOff()) return;
		if (el.getBoundingClientRect().top < innerHeight) return;
		el.toggleAttribute("data-armed", true);
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();
				el.toggleAttribute("data-in", true);
			},
			{ threshold: 0.35 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div className={className} ref={ref}>
			{children}
		</div>
	);
}
