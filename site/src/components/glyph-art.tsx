"use client";

import { useEffect, useRef, useState } from "react";
import { motionOff } from "@/lib/motion";

const NOISE = "<>[]{}()/\\|*+=#$%&0123456789";
const WORD = "cd/";
/** Largura de uma célula em px: define quantas colunas cabem (80 no desktop, ~50 no celular). */
const CELL = 6.8;
const INTRO = 1100;
const FRAME = 1000 / 30;

type Grid = {
	cols: number;
	rows: number;
	cellW: number;
	cellH: number;
	fontSize: number;
	/** Célula faz parte das letras de `cd/`. */
	inside: Uint8Array;
	/** Letra de cada célula, tirada na ordem do texto das skills. */
	chars: string[];
	/** Instante (ms depois do início) em que a célula vira a letra certa. */
	settle: Float32Array;
	/** Até quando a célula mostra um símbolo trocado (brilho rápido). */
	flicker: Float32Array;
};

/** Máscara do `cd/`: desenha a palavra grande num canvas de fora e vê quais células caem em cima da tinta. */
function buildGrid(
	width: number,
	height: number,
	family: string,
	pool: string,
): Grid {
	const cols = Math.max(24, Math.round(width / CELL));
	const cellW = width / cols;
	const fontSize = cellW * 2;
	const cellH = fontSize * 1.02;
	const rows = Math.floor(height / cellH);

	const mask = document.createElement("canvas");
	mask.width = width;
	mask.height = height;
	const ctx = mask.getContext("2d");
	const inside = new Uint8Array(cols * rows);
	if (ctx) {
		ctx.font = `700 100px ${family}`;
		const scale = (width * 0.96) / ctx.measureText(WORD).width;
		ctx.font = `700 ${100 * scale}px ${family}`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.lineWidth = scale * 2;
		ctx.strokeStyle = ctx.fillStyle = "#000";
		ctx.fillText(WORD, width / 2, height / 2);
		ctx.strokeText(WORD, width / 2, height / 2);
		const { data } = ctx.getImageData(0, 0, width, height);
		for (let row = 0; row < rows; row++)
			for (let col = 0; col < cols; col++) {
				const x = Math.floor((col + 0.5) * cellW);
				const y = Math.floor((row + 0.5) * cellH);
				inside[row * cols + col] = data[(y * width + x) * 4 + 3] > 128 ? 1 : 0;
			}
	}

	const total = cols * rows;
	const settle = new Float32Array(total);
	for (let i = 0; i < total; i++) {
		const col = i % cols;
		// A tinta se resolve em onda, da esquerda pra direita, com um pouco de ruído.
		settle[i] = (col / cols) * INTRO * 0.8 + Math.random() * INTRO * 0.2;
	}
	return {
		cols,
		rows,
		cellW,
		cellH,
		fontSize,
		inside,
		chars: Array.from({ length: total }, (_, i) => pool[i % pool.length]),
		settle,
		flicker: new Float32Array(total),
	};
}

const cssColor = (name: string) =>
	getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/**
 * Arte do hero: um `cd/` grande feito com os caracteres do texto das próprias skills, em amarelo. As letras se
 * resolvem em onda quando a página abre e depois brilham devagar, com um símbolo trocado aqui e ali. Sem JS ou
 * com o movimento pausado fica a imagem parada. O `cd/` em texto embaixo é o que aparece até o canvas pintar.
 */
export function GlyphArt({ pool }: { pool: string }) {
	const canvas = useRef<HTMLCanvasElement>(null);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const el = canvas.current;
		const ctx = el?.getContext("2d");
		if (!el || !ctx) return;

		let grid: Grid | undefined;
		let ink = "";
		let dim = "";
		let frame = 0;
		let origin = 0;
		let last = 0;
		let running = false;
		let visible = true;
		let cancelled = false;

		const colors = () => {
			ink = cssColor("--brand-foreground");
			dim = cssColor("--muted-foreground");
		};

		const draw = (now: number, animate: boolean) => {
			if (!grid) return;
			const dpr = el.width / el.clientWidth;
			const t = now - origin;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, el.clientWidth, el.clientHeight);
			ctx.font = `700 ${grid.fontSize}px ${getComputedStyle(el).fontFamily}`;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			for (let i = 0; i < grid.inside.length; i++) {
				const col = i % grid.cols;
				const row = (i - col) / grid.cols;
				const inside = grid.inside[i] === 1;
				let char = grid.chars[i];
				let alpha = inside ? 1 : 0.07;
				if (animate && inside) {
					if (t < grid.settle[i])
						char = NOISE[Math.floor(Math.random() * NOISE.length)];
					else if (t < INTRO + 400) alpha = 1;
					else {
						const wave = Math.sin(col * 0.16 + row * 0.1 - t / 700);
						alpha = 0.62 + 0.38 * Math.max(0, wave) ** 3;
						if (t < grid.flicker[i])
							char = NOISE[Math.floor(Math.random() * NOISE.length)];
						else if (Math.random() < 0.0012) grid.flicker[i] = t + 140;
					}
				}
				ctx.globalAlpha = alpha;
				ctx.fillStyle = inside ? ink : dim;
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
			colors();
			grid = buildGrid(w, h, getComputedStyle(el).fontFamily, pool);
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
		// Troca de tema e botão de pausa mudam atributos do <html>.
		const attrs = new MutationObserver(() => {
			colors();
			stop();
			sync();
		});
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
