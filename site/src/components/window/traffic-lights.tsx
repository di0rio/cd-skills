"use client";

import { Maximize2Icon, MinusIcon, XIcon } from "lucide-react";
import type { Ref } from "react";
import { cn } from "@/lib/utils";

type Labels = {
	close: string;
	minimize: string;
	zoom: string;
	unzoom: string;
};

const light =
	"relative flex size-3 items-center justify-center rounded-full border border-black/15 outline-none before:absolute before:-inset-1 before:content-[''] focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-chrome-bar";
const glyph =
	"size-2 stroke-[3] opacity-0 transition-opacity duration-100 group-focus-within/lights:opacity-100 group-hover/lights:opacity-100";

/**
 * Semáforo do macOS: vermelho (fechar), amarelo (minimizar pro dock) e verde (zoom), de 12px com 8px entre eles.
 * Os símbolos só aparecem com o mouse (ou o foco) no grupo, como no macOS. O verde some no celular, onde a janela
 * já é sempre maximizada.
 */
export function TrafficLights({
	labels,
	maximized,
	closeRef,
	onClose,
	onMinimize,
	onZoom,
}: {
	labels: Labels;
	maximized: boolean;
	closeRef: Ref<HTMLButtonElement>;
	onClose: () => void;
	onMinimize: () => void;
	onZoom: () => void;
}) {
	return (
		<div className="group/lights flex shrink-0 items-center gap-2">
			<button
				aria-label={labels.close}
				className={cn(light, "bg-[#ff5f57] text-[#4d0000]")}
				onClick={onClose}
				ref={closeRef}
				type="button"
			>
				<XIcon aria-hidden="true" className={glyph} />
			</button>
			<button
				aria-label={labels.minimize}
				className={cn(light, "bg-[#febc2e] text-[#995700]")}
				onClick={onMinimize}
				type="button"
			>
				<MinusIcon aria-hidden="true" className={glyph} />
			</button>
			<button
				aria-label={maximized ? labels.unzoom : labels.zoom}
				className={cn(light, "bg-[#28c840] text-[#006500] max-md:hidden")}
				onClick={onZoom}
				type="button"
			>
				<Maximize2Icon
					aria-hidden="true"
					className={cn(glyph, "size-[7px] stroke-[3.5]")}
				/>
			</button>
		</div>
	);
}
