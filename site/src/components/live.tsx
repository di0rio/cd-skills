"use client";

import { type ReactNode, useEffect, useRef } from "react";

/**
 * Marca `data-live` enquanto o bloco está na tela e a aba está visível. O CSS das ilustrações só anima dentro de
 * `[data-live]`, então nada roda fora da tela nem em aba escondida.
 */
export function Live({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		let seen = false;
		const sync = () =>
			el.toggleAttribute("data-live", seen && !document.hidden);
		const observer = new IntersectionObserver(
			([entry]) => {
				seen = entry.isIntersecting;
				sync();
			},
			{ threshold: 0.4 },
		);
		observer.observe(el);
		document.addEventListener("visibilitychange", sync);
		return () => {
			observer.disconnect();
			document.removeEventListener("visibilitychange", sync);
		};
	}, []);

	return (
		<div className={className} ref={ref}>
			{children}
		</div>
	);
}
