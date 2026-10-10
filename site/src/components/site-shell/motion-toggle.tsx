"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";
import { applyPause, storedPause, storePause } from "@/lib/motion";

/** "Pausar movimento" no pill do topo: vale pro site todo, fica salvo no navegador e soma com o `prefers-reduced-motion`. */
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
	const label = paused ? labels.play : labels.pause;

	return (
		<Tooltip>
			<TooltipTrigger
				aria-label={label}
				aria-pressed={paused}
				onClick={() => {
					setPaused(!paused);
					applyPause(!paused);
					storePause(!paused);
				}}
				render={<Button size="icon-sm" type="button" variant="outline" />}
			>
				<Icon aria-hidden="true" />
			</TooltipTrigger>
			<TooltipPopup>{label}</TooltipPopup>
		</Tooltip>
	);
}
