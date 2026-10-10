"use client";

import { useEffect, useRef } from "react";
import { motionOff } from "@/lib/motion";

const GLYPHS = "<>[]{}()/|*+=#$%&0123456789";
const DURATION = 520;

/**
 * Título que "decodifica": quando entra na tela, cada letra sai de um símbolo e vira a letra certa, da esquerda
 * pra direita, uma vez só. O texto de verdade fica num span só pra leitor de tela e aparece inteiro sem JS.
 * Espaços ficam onde estão e a fonte é mono, então nada muda de tamanho nem quebra linha diferente.
 */
export function Decode({ text }: { text: string }) {
	const ref = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el || motionOff()) return;
		let frame = 0;
		let start = 0;
		const tick = (now: number) => {
			const progress = Math.min((now - start) / DURATION, 1);
			const settled = Math.floor((1 - (1 - progress) ** 3) * text.length);
			el.textContent = [...text]
				.map((char, i) =>
					char === " " || i < settled || progress === 1
						? char
						: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
				)
				.join("");
			if (progress < 1) frame = requestAnimationFrame(tick);
		};
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();
				start = performance.now();
				frame = requestAnimationFrame(tick);
			},
			{ threshold: 0.6 },
		);
		observer.observe(el);
		return () => {
			observer.disconnect();
			cancelAnimationFrame(frame);
			el.textContent = text;
		};
	}, [text]);

	return (
		<>
			<span className="sr-only">{text}</span>
			<span aria-hidden="true" ref={ref}>
				{text}
			</span>
		</>
	);
}
