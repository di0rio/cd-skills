"use client";

import { useEffect, useRef, useState } from "react";
import { motionOff } from "@/lib/motion";

const NOISE = "<>[]{}()/\\|*+=#$%&0123456789";
const WORD = "cd/";
/** Largura de uma célula em px: com a fonte em 2x isso dá um mono de ~9px, bem denso (~130 colunas no desktop). */
const CELL = 4.4;
const INTRO = 1100;
const FRAME = 1000 / 30;

type Grid = {
	cols: number;
	rows: number;
	cellW: number;
	cellH: number;
	fontSize: number;
	/** Índices das células que caem em cima do `cd/`. */
	ink: Int32Array;
	/** Letra de cada célula de tinta: o texto das skills corre sem pular entre uma letra e outra. */
	inkChars: string[];
	/** Instante (ms depois do início) em que a célula de tinta vira a letra certa. */
	settle: Float32Array;
	/** Até quando a célula mostra um símbolo trocado (brilho rápido). */
	flicker: Float32Array;
	/** Fundo apagado: o mesmo texto, em todas as outras células, desenhado uma vez. */
	background: HTMLCanvasElement;
};

/** Máscara do `cd/`: desenha a palavra grande num canvas de fora e vê quais células caem em cima da tinta. */
function buildGrid(
	width: number,
	height: number,
	dpr: number,
	family: string,
	pool: string,
	dim: string,
): Grid {
	const cols = Math.max(24, Math.round(width / CELL));
	const cellW = width / cols;
	const fontSize = cellW * 2;
	const cellH = fontSize;
	const rows = Math.floor(height / cellH);

	const mask = document.createElement("canvas");
	mask.width = width;
	mask.height = height;
	const ctx = mask.getContext("2d");
	const inside = new Uint8Array(cols * rows);
	if (ctx) {
		// Cada letra separada por uma fresta, pra os miolos do c e do d ficarem abertos e as três formas se lerem.
		ctx.font = `700 100px ${family}`;
		const gap = 14;
		const advance = ctx.measureText("c").width;
		const scale =
			(width * 0.98) / (advance * WORD.length + gap * (WORD.length - 1));
		ctx.font = `700 ${100 * scale}px ${family}`;
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";
		ctx.lineWidth = scale * 3;
		ctx.strokeStyle = ctx.fillStyle = "#000";
		const step = (advance + gap) * scale;
		[...WORD].forEach((letter, i) => {
			const x = width * 0.01 + i * step;
			ctx.fillText(letter, x, height / 2);
			ctx.strokeText(letter, x, height / 2);
		});
		const { data } = ctx.getImageData(0, 0, width, height);
		for (let row = 0; row < rows; row++)
			for (let col = 0; col < cols; col++) {
				const x = Math.floor((col + 0.5) * cellW);
				const y = Math.floor((row + 0.5) * cellH);
				inside[row * cols + col] = data[(y * width + x) * 4 + 3] > 128 ? 1 : 0;
			}
	}

	// Dois fluxos do mesmo texto: um só pras células de tinta, outro pro fundo.
	const ink: number[] = [];
	const background = document.createElement("canvas");
	background.width = Math.round(width * dpr);
	background.height = Math.round(height * dpr);
	const bg = background.getContext("2d");
	if (bg) {
		bg.setTransform(dpr, 0, 0, dpr, 0, 0);
		bg.font = `700 ${fontSize}px ${family}`;
		bg.textAlign = "center";
		bg.textBaseline = "middle";
		bg.fillStyle = dim;
		bg.globalAlpha = 0.07;
	}
	let other = 0;
	for (let i = 0; i < inside.length; i++) {
		if (inside[i]) {
			ink.push(i);
			continue;
		}
		const col = i % cols;
		const row = (i - col) / cols;
		bg?.fillText(
			pool[other++ % pool.length],
			(col + 0.5) * cellW,
			(row + 0.5) * cellH,
		);
	}

	const settle = new Float32Array(ink.length);
	for (let k = 0; k < ink.length; k++) {
		// A tinta se resolve em onda, da esquerda pra direita, com um pouco de ruído.
		settle[k] =
			((ink[k] % cols) / cols) * INTRO * 0.8 + Math.random() * INTRO * 0.2;
	}
	return {
		cols,
		rows,
		cellW,
		cellH,
		fontSize,
		ink: Int32Array.from(ink),
		inkChars: ink.map((_, k) => pool[k % pool.length]),
		settle,
		flicker: new Float32Array(ink.length),
		background,
	};
}

const cssColor = (name: string) =>
	getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/**
 * Arte do hero: um `cd/` grande feito com os caracteres do texto das próprias skills, em amarelo, sobre o mesmo
 * texto bem apagado. As letras se resolvem em onda quando a página abre e depois brilham devagar, com um símbolo
 * trocado aqui e ali. Sem JS ou com o movimento pausado fica a imagem parada. O `cd/` em texto embaixo é o que
 * aparece até o canvas pintar.
 */
export function GlyphArt({ pool }: { pool: string }) {
	const canvas = useRef<HTMLCanvasElement>(null);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const el = canvas.current;
		const ctx = el?.getContext("2d");
		if (!el || !ctx) return;

		let grid: Grid | undefined;
		let color = "";
		let frame = 0;
		let origin = 0;
		let last = 0;
		let running = false;
		let visible = true;
		let cancelled = false;

		const draw = (now: number, animate: boolean) => {
			if (!grid) return;
			const dpr = el.width / el.clientWidth;
			const t = now - origin;
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, el.width, el.height);
			ctx.drawImage(grid.background, 0, 0);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.font = `700 ${grid.fontSize}px ${getComputedStyle(el).fontFamily}`;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillStyle = color;
			for (let k = 0; k < grid.ink.length; k++) {
				const i = grid.ink[k];
				const col = i % grid.cols;
				const row = (i - col) / grid.cols;
				let char = grid.inkChars[k];
				let alpha = 1;
				if (animate) {
					if (t < grid.settle[k])
						char = NOISE[Math.floor(Math.random() * NOISE.length)];
					else if (t > INTRO + 400) {
						const wave = Math.sin(col * 0.07 + row * 0.12 - t / 700);
						alpha = 0.74 + 0.26 * Math.max(0, wave) ** 2;
						if (t < grid.flicker[k])
							char = NOISE[Math.floor(Math.random() * NOISE.length)];
						else if (Math.random() < 0.0008) grid.flicker[k] = t + 140;
					}
				}
				ctx.globalAlpha = alpha;
				ctx.fillText(char, (col + 0.5) * grid.cellW, (row + 0.5) * grid.cellH);
			}
			ctx.globalAlpha = 1;
		};

		const loop = (now: number) => {
			frame = requestAnimationFrame(loop);
			if (now - last < FRAME) return;
			last = now;
			draw(now, true);
		};
		const stop = () => {
			running = false;
			cancelAnimationFrame(frame);
		};
		const sync = () => {
			if (cancelled) return;
			if (motionOff() || !visible || document.hidden) {
				stop();
				draw(performance.now(), false);
			} else if (!running) {
				running = true;
				frame = requestAnimationFrame(loop);
			}
		};

		const layout = () => {
			if (cancelled) return;
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			const { clientWidth: w, clientHeight: h } = el;
			if (!w || !h) return;
			el.width = Math.round(w * dpr);
			el.height = Math.round(h * dpr);
			color = cssColor("--brand-foreground");
			grid = buildGrid(
				w,
				h,
				dpr,
				getComputedStyle(el).fontFamily,
				pool,
				cssColor("--foreground"),
			);
			if (!origin) origin = performance.now();
			stop();
			sync();
			setReady(true);
		};

		const resize = new ResizeObserver(layout);
		resize.observe(el);
		const view = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			sync();
		});
		view.observe(el);
		// Troca de tema muda as cores (refaz o fundo); o botão de pausa muda um atributo do <html>.
		const attrs = new MutationObserver(layout);
		attrs.observe(document.documentElement, {
			attributeFilter: ["class", "data-motion-paused"],
		});
		document.addEventListener("visibilitychange", sync);
		document.fonts.ready.then(layout);

		return () => {
			cancelled = true;
			stop();
			resize.disconnect();
			view.disconnect();
			attrs.disconnect();
			document.removeEventListener("visibilitychange", sync);
		};
	}, [pool]);

	return (
		<div aria-hidden="true" className="absolute inset-0">
			<p
				className={`absolute inset-0 flex items-center justify-center font-bold font-mono text-[clamp(7rem,20vw,13rem)] text-brand-foreground leading-none tracking-[-0.06em] ${ready ? "invisible" : ""}`}
			>
				cd/
			</p>
			<canvas className="absolute inset-0 size-full font-mono" ref={canvas} />
		</div>
	);
}
