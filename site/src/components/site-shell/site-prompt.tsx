"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/generated";
import { localePath, stripLocale } from "@/i18n/path";

/**
 * Topo do site como um prompt: `cd/skills ~/humanizar $▍` mostra onde você está
 * e o clique leva pro começo.
 */
export function SitePrompt({
	locale,
	label,
}: {
	locale: Locale;
	label: string;
}) {
	const segment = stripLocale(usePathname() ?? "/").split("/")[1] ?? "";

	return (
		<Link
			aria-label={label}
			className="group flex items-baseline gap-2 justify-self-start rounded-md font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand"
			href={localePath(locale, "/")}
		>
			<span className="font-bold text-base text-foreground">
				cd<span className="text-brand-foreground">/</span>skills
			</span>
			<span aria-hidden="true" className="text-muted-foreground">
				~{segment ? `/${segment}` : ""} ${" "}
				<span className="inline-block h-[1em] w-[0.5em] translate-y-[0.15em] animate-caret bg-brand motion-reduce:animate-none" />
			</span>
		</Link>
	);
}
