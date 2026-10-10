"use client";

import {
	type ReactNode,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { motionOff } from "@/lib/motion";
import { fallbackEasing, spring, supportsLinear } from "@/lib/spring";
import { AppIcon } from "./app-icon";
import { type Tab, TabStrip } from "./tab-strip";
import { Toolbar } from "./toolbar";
import { TrafficLights } from "./traffic-lights";

type Labels = {
	tabs: string;
	back: string;
	forward: string;
	address: string;
	copied: string;
	close: string;
	minimize: string;
	zoom: string;
	unzoom: string;
	open: string;
	desktop: string;
	hint: string;
};

type Mode = "open" | "minimized" | "closed";

const STORE = "cd-skills-window";
const SPRING = spring(0.4);
/** O "genie" do minimizar: primeiro achata na vertical, depois encolhe até o ícone do dock. */
const GENIE = { mid: "scale(0.5, 0.2)", end: "scale(0.03, 0.02)" };
const CLOSED = "scale(0.96)";
const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

/** Tamanho guardado no navegador. Sem acesso ao storage, vale só nessa visita. */
function storedMax() {
	try {
		return localStorage.getItem(STORE) === "max";
	} catch {
		return false;
	}
}
function storeMax(max: boolean) {
	try {
		localStorage.setItem(STORE, max ? "max" : "window");
	} catch {
		return;
	}
}

const springEasing = () => (supportsLinear() ? SPRING.easing : fallbackEasing);
const wide = () => matchMedia("(min-width: 768px)").matches;

/** Onde o elemento está agora na tela (animado ou não): é daqui que toda animação nova parte. */
function snapshot(el: HTMLElement) {
	const { transform, opacity } = getComputedStyle(el);
	return { transform, opacity };
}

/** Centro de `target` em coordenadas da janela, pra ser o `transform-origin`. */
function originAt(el: HTMLElement, target: HTMLElement | null) {
	if (!target) return "50% 100%";
	const r = target.getBoundingClientRect();
	return `${r.left + r.width / 2 - el.offsetLeft}px ${r.top + r.height / 2 - el.offsetTop}px`;
}

/**
 * O site dentro de uma janela do macOS: semáforo e abas em cima, barra de ferramentas embaixo e o corpo, que é
 * quem rola. A aba ativa tem a mesma cor da barra de ferramentas, então as duas se emendam.
 *
 * Os botões do semáforo mexem na janela com a Web Animations API e uma mola criticamente amortecida (sem
 * passar do alvo). Toda animação parte do valor que está na tela naquele instante, então dá pra interromper e
 * inverter no meio. Minimizar encolhe a janela até o ícone do dock e restaurar volta pelo mesmo caminho.
 */
export function WindowShell({
	tabs,
	labels,
	controls,
	children,
}: {
	tabs: Tab[];
	labels: Labels;
	/** Controles da direita da barra de ferramentas (idioma, tema, movimento, github). */
	controls: ReactNode;
	children: ReactNode;
}) {
	const win = useRef<HTMLDivElement>(null);
	const closeButton = useRef<HTMLButtonElement>(null);
	const dockIcon = useRef<HTMLButtonElement>(null);
	const desktopIcon = useRef<HTMLButtonElement>(null);
	const titleBar = useRef<HTMLDivElement>(null);
	const running = useRef<Animation>(undefined);
	const previous = useRef<Mode>("open");
	const [mode, setMode] = useState<Mode>("open");
	/** A janela já terminou de sair: fica invisível, mas montada (guarda a rolagem e a página). */
	const [parked, setParked] = useState(false);
	const [maximized, setMaximized] = useState(false);

	useLayoutEffect(() => {
		if (storedMax()) setMaximized(true);
	}, []);

	// Quem recebe o foco quando a janela some ou volta.
	useEffect(() => {
		const was = previous.current;
		previous.current = mode;
		if (was === mode) return;
		const target =
			mode === "minimized"
				? dockIcon.current
				: mode === "closed"
					? desktopIcon.current
					: win.current;
		target?.focus({ preventScroll: true });
	}, [mode]);

	// Duplo clique no espaço vazio da barra de título zooma, como no macOS (só o próprio fundo da barra, não as abas).
	const zoomRef = useRef<() => void>(() => undefined);
	useEffect(() => {
		const bar = titleBar.current;
		if (!bar) return;
		const onDouble = (event: MouseEvent) => {
			if (event.target === bar) zoomRef.current();
		};
		bar.addEventListener("dblclick", onDouble);
		return () => bar.removeEventListener("dblclick", onDouble);
	}, []);

	const play = (
		el: HTMLElement,
		keyframes: Keyframe[],
		options: KeyframeAnimationOptions,
	) => {
		running.current?.cancel();
		const animation = el.animate(keyframes, options);
		running.current = animation;
		return animation;
	};

	/** Some de vez quando a animação de saída termina (e só se nenhuma outra tomou o lugar). */
	const parkWhenDone = (animation: Animation) =>
		animation.addEventListener("finish", () => {
			if (running.current === animation) setParked(true);
		});

	const leave = (
		el: HTMLElement,
		next: Mode,
		from: ReturnType<typeof snapshot>,
	) => {
		setMode(next);
		const fade = motionOff();
		const animation = play(
			el,
			fade
				? [{ opacity: from.opacity }, { opacity: 0 }]
				: next === "minimized"
					? [
							{ transform: from.transform },
							{ transform: GENIE.mid, offset: 0.45 },
							{ transform: GENIE.end },
						]
					: [
							{ transform: from.transform, opacity: from.opacity },
							{ transform: CLOSED, opacity: 0 },
						],
			fade
				? { duration: 150, easing: "ease-out", fill: "forwards" }
				: next === "minimized"
					? {
							duration: SPRING.duration,
							easing: springEasing(),
							fill: "forwards",
						}
					: { duration: 200, easing: EASE_OUT, fill: "forwards" },
		);
		parkWhenDone(animation);
	};

	const minimize = () => {
		const el = win.current;
		if (!el || mode !== "open") return;
		el.style.transformOrigin = originAt(el, dockIcon.current);
		leave(el, "minimized", snapshot(el));
	};

	const close = () => {
		const el = win.current;
		if (!el || mode !== "open") return;
		el.style.transformOrigin = originAt(el, closeButton.current);
		leave(el, "closed", snapshot(el));
	};

	/** Volta pelo mesmo caminho por onde saiu, a partir de onde a janela estiver agora. */
	const restore = () => {
		const el = win.current;
		if (!el || mode === "open") return;
		const fromClosed = mode === "closed";
		const from = parked
			? fromClosed
				? { transform: CLOSED, opacity: "0" }
				: { transform: GENIE.end, opacity: "1" }
			: snapshot(el);
		el.style.transformOrigin = originAt(
			el,
			fromClosed ? closeButton.current : dockIcon.current,
		);
		// A janela precisa estar visível já no primeiro quadro; o React atualiza os atributos logo depois.
		el.removeAttribute("data-parked");
		el.inert = false;
		setMode("open");
		setParked(false);
		if (motionOff()) {
			play(el, [{ opacity: 0 }, { opacity: 1 }], {
				duration: 150,
				easing: "ease-out",
			});
		} else if (fromClosed) {
			play(
				el,
				[
					{ transform: from.transform, opacity: from.opacity },
					{ transform: "none", opacity: 1 },
				],
				{ duration: 260, easing: EASE_OUT },
			);
		} else {
			play(
				el,
				[
					{ transform: from.transform },
					{ transform: GENIE.mid, offset: 0.55 },
					{ transform: "none" },
				],
				{ duration: SPRING.duration, easing: springEasing() },
			);
		}
	};

	/** Janela <-> maximizada. A geometria anima a partir do retângulo que está na tela (também no meio de outro zoom). */
	const zoom = () => {
		const el = win.current;
		if (!el || mode !== "open" || !wide()) return;
		const from = el.getBoundingClientRect();
		const fromRadius = getComputedStyle(el).borderRadius;
		const next = !maximized;
		running.current?.cancel();
		el.toggleAttribute("data-max", next);
		const to = el.getBoundingClientRect();
		const toRadius = getComputedStyle(el).borderRadius;
		setMaximized(next);
		storeMax(next);
		if (motionOff()) {
			play(el, [{ opacity: 0.4 }, { opacity: 1 }], {
				duration: 150,
				easing: "ease-out",
			});
			return;
		}
		const box = (r: DOMRect, radius: string) => ({
			left: `${r.left}px`,
			top: `${r.top}px`,
			width: `${r.width}px`,
			height: `${r.height}px`,
			borderRadius: radius,
		});
		play(el, [box(from, fromRadius), box(to, toRadius)], {
			duration: SPRING.duration,
			easing: springEasing(),
		});
	};

	useEffect(() => {
		zoomRef.current = zoom;
	});

	return (
		<>
			<div
				className="win"
				data-max={maximized || undefined}
				data-parked={parked || undefined}
				data-window
				inert={mode !== "open"}
				ref={win}
				tabIndex={-1}
			>
				<div
					className="flex shrink-0 items-end gap-4 bg-chrome-bar pt-2 pl-3.5"
					ref={titleBar}
				>
					<div className="mb-3 self-end">
						<TrafficLights
							closeRef={closeButton}
							labels={labels}
							maximized={maximized}
							onClose={close}
							onMinimize={minimize}
							onZoom={zoom}
						/>
					</div>
					<TabStrip label={labels.tabs} tabs={tabs} />
				</div>
				<Toolbar labels={labels}>{controls}</Toolbar>
				<div className="win-body" data-window-body>
					{children}
				</div>
			</div>

			<div className="dock" data-show={mode !== "open" || undefined}>
				<button
					aria-label={labels.open}
					className="dock-icon"
					onClick={restore}
					ref={dockIcon}
					tabIndex={mode === "open" ? -1 : 0}
					type="button"
				>
					<AppIcon />
				</button>
			</div>
			<p
				aria-live="polite"
				className="dock-hint"
				data-show={mode === "minimized" || undefined}
			>
				{mode === "minimized" ? labels.hint : ""}
			</p>
			<button
				aria-label={labels.open}
				className="desktop-icon"
				data-show={mode === "closed" || undefined}
				onClick={restore}
				ref={desktopIcon}
				tabIndex={mode === "closed" ? 0 : -1}
				type="button"
			>
				<AppIcon className="size-16" />
				<span>{labels.desktop}</span>
			</button>
		</>
	);
}
