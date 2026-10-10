"use client";

import { useEffect, useRef, useState } from "react";
import { motionOff } from "@/lib/motion";

const NOISE = "<>[]{}()/\\|*+=#$%&0123456789";
const WORD = "cd/";
/** Largura de uma célula em px: com a fonte em 2x isso dá um mono de ~9px, bem denso (~130 colunas no desktop). */
const CELL = 4.4;
/** A onda de entrada termina em INTRO; depois o canvas fica parado e só o CSS (brilho) e o pisca-pisca mexem. */
const INTRO = 1100;
const SETTLED = INTRO + 400;
const FRAME = 1000 / 30;
const FLICKER_EVERY = 240;
const FLICKER_FOR = 140;

type Grid = {
	cols: number;
	rows: number;
	/** Tamanho da célula em px do canvas (já com o DPR). */
	tw: number;
	th: number;
	cellW: number;
	cellH: number;
	/** Índices das células que caem em cima do `cd/`. */
	ink: Int32Array;
	/** Índice da letra (no atlas) de cada célula de tinta: o texto das skills corre sem pular entre uma letra e outra. */
	inkTile: Uint16Array;
	/** Instante (ms depois do início) em que a célula de tinta vira a letra certa. */
	settle: Float32Array;
	tiles: Map<string, number>;
	atlas: HTMLCanvasElement;
	/** Fundo apagado: o mesmo texto nas outras células, montado uma vez. */
	background: HTMLCanvasElement;
};

const canvasOf = (width: number, height: number) => {
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	return canvas;
};

/** Uma tira com cada caractere já desenhado: pintar uma célula vira um `drawImage`, bem mais barato que `fillText`. */
function makeAtlas(
	chars: string[],
	color: string,
	alpha: number,
	tw: number,
	th: number,
	font: string,
) {
	const atlas = canvasOf(tw * chars.length, th);
	const ctx = atlas.getContext("2d");
	if (!ctx) return atlas;
	ctx.font = font;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = color;
	ctx.globalAlpha = alpha;
	chars.forEach((char, i) => {
		ctx.fillText(char, i * tw + tw / 2, th / 2);
	});
	return atlas;
}

/** Máscara do `cd/`: a palavra desenhada num canvas de 2 pixels por célula; vê quais células caem em cima da tinta. */
function inkCells(
	cols: number,
	rows: number,
	cellW: number,
	cellH: number,
	family: string,
) {
	const k = 2 / cellW;
	const mask = canvasOf(cols * 2, Math.round(rows * cellH * k));
	const ctx = mask.getContext("2d", { willReadFrequently: true });
	const ink: number[] = [];
	if (!ctx) return ink;
	// Cada letra separada por uma fresta, pra os miolos do c e do d ficarem abertos e as três formas se lerem.
	ctx.font = `700 100px ${family}`;
	const gap = 14;
	const advance = ctx.measureText("c").width;
	const scale =
		(mask.width * 0.98) / (advance * WORD.length + gap * (WORD.length - 1));
	ctx.font = `700 ${100 * scale}px ${family}`;
	ctx.textAlign = "left";
	ctx.textBaseline = "middle";
	ctx.lineWidth = scale * 3;
	ctx.strokeStyle = ctx.fillStyle = "#000";
	const step = (advance + gap) * scale;
	[...WORD].forEach((letter, i) => {
		const x = mask.width * 0.01 + i * step;
		ctx.fillText(letter, x, mask.height / 2);
		ctx.strokeText(letter, x, mask.height / 2);
	});
	const { data } = ctx.getImageData(0, 0, mask.width, mask.height);
	for (let row = 0; row < rows; row++)
		for (let col = 0; col < cols; col++) {
			const x = Math.floor((col + 0.5) * 2);
			const y = Math.floor((row + 0.5) * cellH * k);
			if (data[(y * mask.width + x) * 4 + 3] > 128) ink.push(row * cols + col);
		}
	return ink;
}

type Colors = { ink: string; dim: string; shine: string };

function buildGrid(
	width: number,
	height: number,
	dpr: number,
	family: string,
	pool: string,
	colors: Colors,
) {
	const cols = Math.max(24, Math.round(width / CELL));
	const cellW = width / cols;
	const cellH = cellW * 2;
	const rows = Math.floor(height / cellH);
	const tw = Math.round(cellW * dpr);
	const th = Math.round(cellH * dpr);
	const font = `700 ${cellW * 2 * dpr}px ${family}`;

	const chars = [...new Set([...pool, ...NOISE])];
	const tiles = new Map(chars.map((char, i) => [char, i]));
	const ink = Int32Array.from(inkCells(cols, rows, cellW, cellH, family));
	const isInk = new Uint8Array(cols * rows);
	for (const i of ink) isInk[i] = 1;

	const inkAtlas = makeAtlas(chars, colors.ink, 1, tw, th, font);
	const dimAtlas = makeAtlas(chars, colors.dim, 0.07, tw, th, font);
	const shineAtlas = makeAtlas(chars, colors.shine, 1, tw, th, font);

	const place = (col: number, row: number) => [
		Math.round(col * cellW * dpr),
		Math.round(row * cellH * dpr),
	];
	// Dois fluxos do mesmo texto: um só pras células de tinta, outro pro fundo.
	const background = canvasOf(
		Math.round(width * dpr),
		Math.round(height * dpr),
	);
	const bg = background.getContext("2d");
	let other = 0;
	for (let i = 0; i < isInk.length; i++) {
		if (isInk[i]) continue;
		const [x, y] = place(i % cols, Math.floor(i / cols));
		const tile = tiles.get(pool[other++ % pool.length]) ?? 0;
		bg?.drawImage(dimAtlas, tile * tw, 0, tw, th, x, y, tw, th);
	}

	const inkTile = new Uint16Array(ink.length);
	const settle = new Float32Array(ink.length);
	for (let k = 0; k < ink.length; k++) {
		inkTile[k] = tiles.get(pool[k % pool.length]) ?? 0;
		// A tinta se resolve em onda, da esquerda pra direita, com um pouco de ruído.
		settle[k] =
			((ink[k] % cols) / cols) * INTRO * 0.8 + Math.random() * INTRO * 0.2;
	}

	const grid: Grid = {
		cols,
		rows,
		tw,
		th,
		cellW: cellW * dpr,
		cellH: cellH * dpr,
		ink,
		inkTile,
		settle,
		tiles,
		atlas: inkAtlas,
		background,
	};
	return { grid, shineAtlas };
}

const cssColor = (name: string) =>
	getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/**
 * Arte do hero: um `cd/` grande feito com os caracteres do texto das próprias skills, em amarelo, sobre o mesmo
 * texto bem apagado. As letras se resolvem em onda quando a página abre (única parte que redesenha o canvas em
 * loop, e só por ~1,5s). Depois fica parado: o brilho é uma cópia clara da tinta revelada por um clip-path que o
 * CSS anima, e o pisca-pisca troca 2 células a cada 240 ms, só com o bloco na tela. Sem JS, com movimento pausado
 * ou `prefers-reduced-motion` fica a imagem parada. O `cd/` em texto é o que aparece até o canvas pintar (a
 * montagem da grade espera a primeira pintura).
 */
export function GlyphArt({ pool }: { pool: string }) {
	const box = useRef<HTMLDivElement>(null);
	const canvas = useRef<HTMLCanvasElement>(null);
	const shine = useRef<HTMLCanvasElement>(null);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const root = box.current;
		const el = canvas.current;
		const shineEl = shine.current;
		const ctx = el?.getContext("2d");
		if (!root || !el || !shineEl || !ctx) return;

		let grid: Grid | undefined;
		let frame = 0;
		let timer = 0;
		let idle = 0;
		let origin = 0;
		let last = 0;
		let visible = true;
		let cancelled = false;
		let size = "";
		const flickering = new Map<number, number>();

		const spot = (g: Grid, k: number) => {
			const i = g.ink[k];
			return [
				Math.round((i % g.cols) * g.cellW),
				Math.round(Math.floor(i / g.cols) * g.cellH),
			];
		};
		const paintCell = (g: Grid, k: number, tile: number) => {
			const [x, y] = spot(g, k);
			ctx.clearRect(x, y, g.tw, g.th);
			ctx.drawImage(g.atlas, tile * g.tw, 0, g.tw, g.th, x, y, g.tw, g.th);
		};
		/** `t` = ms desde o início. Antes de `settle`, a célula mostra um símbolo. */
		const paint = (g: Grid, t: number) => {
			ctx.clearRect(0, 0, el.width, el.height);
			ctx.drawImage(g.background, 0, 0);
			for (let k = 0; k < g.ink.length; k++) {
				const noise = t < g.settle[k];
				const tile = noise
					? (g.tiles.get(NOISE[Math.floor(Math.random() * NOISE.length)]) ?? 0)
					: g.inkTile[k];
				const [x, y] = spot(g, k);
				ctx.drawImage(g.atlas, tile * g.tw, 0, g.tw, g.th, x, y, g.tw, g.th);
			}
		};

		const stop = () => {
			cancelAnimationFrame(frame);
			clearInterval(timer);
			frame = timer = 0;
		};
		const flicker = () => {
			if (!grid) return;
			const now = performance.now();
			for (const [k, until] of flickering)
				if (now > until) {
					paintCell(grid, k, grid.inkTile[k]);
					flickering.delete(k);
				}
			for (let n = 0; n < 2; n++) {
				const k = Math.floor(Math.random() * grid.ink.length);
				if (flickering.has(k)) continue;
				const noise = NOISE[Math.floor(Math.random() * NOISE.length)];
				paintCell(grid, k, grid.tiles.get(noise) ?? 0);
				flickering.set(k, now + FLICKER_FOR);
			}
		};
		const sync = () => {
			stop();
			if (!grid || cancelled) return;
			flickering.clear();
			root.toggleAttribute("data-visible", visible && !document.hidden);
			if (motionOff()) {
				paint(grid, Number.POSITIVE_INFINITY);
				return;
			}
			if (!visible || document.hidden) return;
			if (performance.now() - origin < SETTLED) {
				const loop = (now: number) => {
					if (!grid) return;
					frame = requestAnimationFrame(loop);
					if (now - last < FRAME) return;
					last = now;
					if (performance.now() - origin >= SETTLED) sync();
					else paint(grid, performance.now() - origin);
				};
				frame = requestAnimationFrame(loop);
				return;
			}
			paint(grid, Number.POSITIVE_INFINITY);
			timer = window.setInterval(flicker, FLICKER_EVERY);
		};

		const layout = () => {
			if (cancelled) return;
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			const { clientWidth: w, clientHeight: h } = el;
			if (!w || !h) return;
			el.width = Math.round(w * dpr);
			el.height = Math.round(h * dpr);
			const family = getComputedStyle(el).fontFamily;
			const colors = {
				ink: cssColor("--brand-foreground"),
				dim: cssColor("--foreground"),
				shine: cssColor("--foreground"),
			};
			const built = buildGrid(w, h, dpr, family, pool, colors);
			grid = built.grid;
			// A cópia clara da tinta (embaixo da faixa de brilho) é desenhada uma vez.
			shineEl.width = el.width;
			shineEl.height = el.height;
			const shineCtx = shineEl.getContext("2d");
			for (let k = 0; k < grid.ink.length; k++) {
				const [x, y] = spot(grid, k);
				shineCtx?.drawImage(
					built.shineAtlas,
					grid.inkTile[k] * grid.tw,
					0,
					grid.tw,
					grid.th,
					x,
					y,
					grid.tw,
					grid.th,
				);
			}
			if (!origin) origin = performance.now();
			sync();
			setReady(true);
		};

		// Reconstrução só depois da primeira pintura, uma por quadro e só se o tamanho mudou.
		const later = (fn: () => void) => {
			if (typeof requestIdleCallback === "function")
				idle = requestIdleCallback(fn, { timeout: 400 });
			else idle = window.setTimeout(fn, 150);
		};
		let pending = 0;
		const schedule = (force: boolean) => {
			cancelAnimationFrame(pending);
			pending = requestAnimationFrame(() => {
				const next = `${el.clientWidth}x${el.clientHeight}@${window.devicePixelRatio}`;
				if (!force && next === size) return;
				size = next;
				layout();
			});
		};

		const resize = new ResizeObserver(() => schedule(false));
		resize.observe(el);
		const view = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			sync();
		});
		view.observe(el);
		const theme = new MutationObserver(() => schedule(true));
		theme.observe(document.documentElement, { attributeFilter: ["class"] });
		const pause = new MutationObserver(sync);
		pause.observe(document.documentElement, {
			attributeFilter: ["data-motion-paused"],
		});
		document.addEventListener("visibilitychange", sync);
		document.fonts.ready.then(() => later(() => schedule(true)));

		return () => {
			cancelled = true;
			stop();
			cancelAnimationFrame(pending);
			if (typeof cancelIdleCallback === "function") cancelIdleCallback(idle);
			else clearTimeout(idle);
			resize.disconnect();
			view.disconnect();
			theme.disconnect();
			pause.disconnect();
			document.removeEventListener("visibilitychange", sync);
		};
	}, [pool]);

	return (
		<div
			aria-hidden="true"
			className="absolute inset-0 overflow-hidden"
			ref={box}
		>
			<p
				className={`absolute inset-0 flex items-center justify-center font-bold font-mono text-[clamp(7rem,20vw,13rem)] text-brand-foreground leading-none tracking-[-0.06em] ${ready ? "invisible" : ""}`}
			>
				cd/
			</p>
			<canvas className="absolute inset-0 size-full font-mono" ref={canvas} />
			<canvas className={`glyph-shine ${ready ? "" : "hidden"}`} ref={shine} />
		</div>
	);
}
