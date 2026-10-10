"use client";

import type { ReactNode } from "react";
import { type Tab, TabStrip } from "./tab-strip";
import { Toolbar } from "./toolbar";
import { TrafficLights } from "./traffic-lights";

type Labels = {
	tabs: string;
	back: string;
	forward: string;
	address: string;
	copied: string;
};

/**
 * O site dentro de uma janela do macOS: semáforo e abas em cima, barra de ferramentas embaixo e o corpo, que é
 * quem rola. A aba ativa tem a mesma cor da barra de ferramentas, então as duas se emendam.
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
	return (
		<div className="win" data-window>
			<div className="flex shrink-0 items-end gap-4 bg-chrome-bar pt-2 pl-3.5">
				<div className="mb-3 self-end">
					<TrafficLights />
				</div>
				<TabStrip label={labels.tabs} tabs={tabs} />
			</div>
			<Toolbar labels={labels}>{controls}</Toolbar>
			<div className="win-body" data-window-body>
				{children}
			</div>
		</div>
	);
}
