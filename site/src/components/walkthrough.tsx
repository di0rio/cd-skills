"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { motionOff } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type WalkItem = {
	slug: string;
	name: string;
	/** Nome do arquivo na barra do painel (`total.ts`) ou o nome da skill. */
	title: string;
	/** `-` = o que sai, `+` = o que fica. Pra texto, uma linha de cada. */
	lines: readonly (readonly ["-" | "+", string])[];
	code: boolean;
};

export type WalkLabels = {
	steps: string;
	pick: string;
	removed: string;
	added: string;
	list: { title: string; text: ReactNode }[];
};

const INTERVAL = 3200;

/**
 * Passo a passo de uma skill aplicada a um exemplo real: 01 o pedido, 02 a skill marca o que sai, 03 o resultado.
 * Os três estados usam as mesmas linhas (nada muda de lugar, só opacidade e o riscado). Toca sozinho enquanto está na
 * tela, até a pessoa clicar num passo ou numa skill. Com movimento pausado ou reduzido não toca.
 */
export function Walkthrough({
	items,
	labels,
}: {
	items: WalkItem[];
	labels: WalkLabels;
}) {
	const [pick, setPick] = useState(0);
	const [step, setStep] = useState(0);
	const auto = useRef(true);
	const root = useRef<HTMLDivElement>(null);
	const item = items[pick];
	const total = labels.list.length;

	useEffect(() => {
		const el = root.current;
		if (!el || motionOff()) return;
		let seen = false;
		const observer = new IntersectionObserver(([entry]) => {
			seen = entry.isIntersecting;
		});
		observer.observe(el);
		const id = setInterval(() => {
			if (
				auto.current &&
				seen &&
				!document.hidden &&
				!document.documentElement.hasAttribute("data-motion-paused")
			)
				setStep((s) => (s + 1) % total);
		}, INTERVAL);
		return () => {
			clearInterval(id);
			observer.disconnect();
		};
	}, [total]);

	const go = (next: number) => {
		auto.current = false;
		setStep(next);
	};
	const marked = step >= 1;
	const done = step >= 2;

	return (
		<div
			className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-12"
			data-no-stepper=""
			ref={root}
		>
			<div className="flex flex-col gap-6">
				{items.length > 1 && (
					<fieldset
						aria-label={labels.pick}
						className="m-0 flex min-w-0 flex-wrap gap-x-5 gap-y-2 border-0 p-0 font-mono text-sm"
					>
						{items.map((it, i) => (
							<button
								aria-pressed={i === pick}
								className={cn(
									"rounded-sm underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-brand",
									i === pick
										? "text-foreground underline decoration-brand decoration-2"
										: "text-muted-foreground hover:text-foreground",
								)}
								key={it.slug}
								onClick={() => {
									auto.current = false;
									setPick(i);
									setStep(0);
								}}
								type="button"
							>
								{it.name}
							</button>
						))}
					</fieldset>
				)}
				<ol aria-label={labels.steps} className="border-b">
					{labels.list.map((entry, i) => (
						<li className="border-t" key={entry.title}>
							<button
								aria-current={i === step ? "step" : undefined}
								className="grid w-full grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 rounded-sm py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand"
								onClick={() => go(i)}
								type="button"
							>
								<span
									className={cn(
										"font-bold font-mono text-lg tabular-nums transition-colors duration-200",
										i === step
											? "text-brand-foreground"
											: "text-muted-foreground",
									)}
								>
									{String(i + 1).padStart(2, "0")}
								</span>
								<span>
									<span
										className={cn(
											"block font-mono font-bold transition-colors duration-200",
											i !== step && "text-muted-foreground",
										)}
									>
										{entry.title}
									</span>
									<span
										className={cn(
											"mt-1 block text-muted-foreground text-sm transition-opacity duration-200",
											i !== step && "opacity-60",
										)}
									>
										{entry.text}
									</span>
								</span>
							</button>
						</li>
					))}
				</ol>
			</div>

			<div className="relative min-w-0 self-start rounded-xl border bg-card">
				<div className="flex items-center justify-between border-b px-4 py-2 font-mono text-muted-foreground text-xs">
					<span>{item.title}</span>
					<span className="tabular-nums">
						{String(step + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
					</span>
				</div>
				<div
					className={cn(
						"min-h-60 overflow-x-auto py-4 text-[13px] leading-relaxed sm:text-[15px]",
						item.code ? "font-mono" : "text-base",
					)}
				>
					<div className="w-max min-w-full">
						{item.lines.map(([sign, line]) => {
							const removed = sign === "-";
							return (
								<p
									className={cn(
										"flex px-4 transition-opacity duration-300 ease-out",
										item.code
											? "whitespace-pre"
											: "max-w-[60ch] pb-3 last:pb-0",
										removed
											? done
												? "text-muted-foreground opacity-50"
												: marked
													? "text-muted-foreground"
													: ""
											: done
												? "opacity-100"
												: "opacity-0",
									)}
									key={`${sign}${line}`}
								>
									<span
										aria-hidden="true"
										className={cn(
											"w-4 shrink-0 select-none transition-opacity duration-200",
											removed
												? marked
													? "opacity-100"
													: "opacity-0"
												: "text-brand-foreground",
										)}
									>
										{sign}
									</span>
									<span
										className={cn(
											"min-w-0",
											item.code
												? "a-x"
												: removed &&
														marked &&
														"line-through decoration-muted-foreground/50",
										)}
										data-on={item.code && removed && marked ? "" : undefined}
									>
										<span className="sr-only">
											{removed ? labels.removed : labels.added}:{" "}
										</span>
										{line}
									</span>
								</p>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
