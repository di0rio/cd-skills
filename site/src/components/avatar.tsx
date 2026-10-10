import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * O cartoon como adesivo, igual ao do portfólio: borda de 2px, sombra amarela dura e inclinado -3°.
 * A sombra é um bloco atrás (não box-shadow) pra o giro não deixar fresta. Só o avatar tem essa sombra.
 */
export function Avatar({
	alt,
	className,
}: {
	alt: string;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"relative size-16 -rotate-3 transition-transform duration-200 ease-out motion-safe:hover:rotate-0",
				className,
			)}
		>
			<span
				aria-hidden="true"
				className="absolute inset-0 translate-x-[6%] translate-y-[6%] rounded-[25%] bg-brand"
			/>
			<Image
				alt={alt}
				className="relative size-full rounded-[25%] bg-white dark:bg-[#1c1c1c]"
				height={256}
				priority
				src="/avatar-cartoon.svg"
				unoptimized
				width={256}
			/>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 rounded-[25%] border-2 border-black"
			/>
		</div>
	);
}
