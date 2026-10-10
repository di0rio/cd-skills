/** Semáforo do macOS: vermelho, amarelo e verde de 12px. Só enfeite por enquanto. */
export function TrafficLights() {
	return (
		<div aria-hidden="true" className="flex shrink-0 items-center gap-2">
			<span className="size-3 rounded-full border border-black/15 bg-[#ff5f57]" />
			<span className="size-3 rounded-full border border-black/15 bg-[#febc2e]" />
			<span className="size-3 rounded-full border border-black/15 bg-[#28c840] max-md:hidden" />
		</div>
	);
}
