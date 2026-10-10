"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { stripLocale } from "@/i18n/path";

/**
 * Campo de endereço da janela, como prompt: `cd/skills ~/humanizar $▍` mostra onde você está e, ao clicar,
 * copia o endereço da página (o mesmo ícone de copiar dos blocos de código).
 */
export function SitePrompt({
	label,
	done,
}: {
	/** Rótulo do botão: "Copiar o endereço da página". */
	label: string;
	done: string;
}) {
	const segment = stripLocale(usePathname() ?? "/").split("/")[1] ?? "";
	const [copied, setCopied] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

	useEffect(() => () => clearTimeout(timer.current), []);

	const icon =
		"absolute inset-0 m-auto size-3.5 transition-[opacity,filter] duration-200 ease-out motion-reduce:transition-opacity";

	return (
		<>
			<button
				aria-label={copied ? done : label}
				className="group flex h-8 min-w-0 flex-1 items-center gap-2 rounded-lg border bg-background/60 pr-2 pl-3 text-left font-mono text-sm outline-none transition-colors duration-150 hover:bg-background focus-visible:ring-2 focus-visible:ring-brand sm:max-w-[34rem]"
				onClick={async () => {
					try {
						await navigator.clipboard.writeText(window.location.href);
					} catch {
						return; // sem permissão de área de transferência: não finge que copiou
					}
					setCopied(true);
					clearTimeout(timer.current);
					timer.current = setTimeout(() => setCopied(false), 1500);
				}}
				type="button"
			>
				<span className="min-w-0 flex-1 truncate">
					<span className="font-bold text-foreground">
						cd<span className="text-brand-foreground">/</span>skills
					</span>{" "}
					<span aria-hidden="true" className="text-muted-foreground">
						~{segment ? `/${segment}` : ""} ${" "}
						<span className="inline-block h-[1em] w-[0.5em] translate-y-[0.15em] animate-caret bg-brand motion-reduce:animate-none" />
					</span>
				</span>
				<span className="relative size-5 shrink-0 text-muted-foreground group-hover:text-foreground">
					<CopyIcon
						aria-hidden="true"
						className={`${icon} ${copied ? "opacity-0 blur-[2px]" : "opacity-100"}`}
					/>
					<CheckIcon
						aria-hidden="true"
						className={`${icon} text-brand-foreground ${copied ? "opacity-100" : "opacity-0 blur-[2px]"}`}
					/>
				</span>
			</button>
			<span aria-live="polite" className="sr-only">
				{copied ? done : ""}
			</span>
		</>
	);
}
