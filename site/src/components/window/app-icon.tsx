import Image from "next/image";
import { cn } from "@/lib/utils";

/** Ícone do app (dock e mesa): o cartoon num quadrado arredondado, com a mesma borda do adesivo. Sem a sombra amarela, que é só do avatar. */
export function AppIcon({ className }: { className?: string }) {
	return (
		<span
			className={cn(
				"relative block size-14 overflow-hidden rounded-[22%] border-2 border-black bg-white shadow-[0_6px_14px_rgb(0_0_0/0.35)] dark:bg-[#1c1c1c]",
				className,
			)}
		>
			<Image
				alt=""
				className="size-full"
				height={128}
				src="/avatar-cartoon.svg"
				unoptimized
				width={128}
			/>
		</span>
	);
}
