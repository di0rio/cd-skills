"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { applyPause, storedPause, storePause } from "@/lib/motion";

/** Botão fixo "pausar movimento": vale pro site todo, fica salvo no navegador e soma com o `prefers-reduced-motion`. */
export function MotionToggle({
	labels,
}: {
	labels: { pause: string; play: string };
}) {
	const [paused, setPaused] = useState(false);

	// A pausa guardada só é conhecida no cliente.
	useEffect(() => {
		const stored = storedPause();
		setPaused(stored);
		applyPause(stored);
	}, []);

	const Icon = paused ? PlayIcon : PauseIcon;

	return (
		<button
			aria-pressed={paused}
			className="fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full border bg-background/80 py-2 pr-4 pl-3 font-mono text-muted-foreground text-xs outline-none backdrop-blur-md transition-[color,transform] duration-150 ease-out hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand motion-safe:active:scale-[0.97]"
			onClick={() => {
				setPaused(!paused);
				applyPause(!paused);
				storePause(!paused);
			}}
			type="button"
		>
			<Icon aria-hidden="true" className="size-3.5" />
			{paused ? labels.play : labels.pause}
		</button>
	);
}
