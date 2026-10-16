import type { CSSProperties } from "react";
import type { Locale } from "@/i18n/generated";
import { type Idea, pick, type SkillContent, type Text } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Rich } from "./rich";
import type { WalkItem } from "./walkthrough";

/** A `idea` de uma skill vira o exemplo do passo a passo: o diff como está, ou o antes (sai) e o depois (fica). */
export function walkItem(
	skill: { slug: string; name: string },
	idea: Idea,
	locale: Locale,
): WalkItem {
	const code = idea.kind === "diff";
	return {
		slug: skill.slug,
		name: skill.name,
		title: (code && idea.file) || skill.name,
		code,
		lines: code
			? idea.lines
			: [
					["-", pick(idea.before ?? { pt: "" }, locale)],
					["+", pick(idea.after ?? { pt: "" }, locale)],
				],
	};
}

export function Ladder({ items, locale }: { items: Text[]; locale: Locale }) {
	return (
		<ol className="border-b">
			{items.map((item, i) => (
				<li
					data-reveal
					className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-4 border-t py-4 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:py-5"
					key={item.pt}
				>
					<span className="font-bold font-mono text-2xl text-muted-foreground tabular-nums sm:text-4xl">
						{String(i + 1).padStart(2, "0")}
					</span>
					<span className="text-lg sm:text-2xl">{pick(item, locale)}</span>
				</li>
			))}
		</ol>
	);
}

const ratio = (value: string) => {
	const [, a, b] = /^(\d+)\/(\d+)$/.exec(value) ?? [];
	return b ? Number(a) / Number(b) : undefined;
};

/** Números grandes. Valores no formato `191/200` ganham uma barra; o maior fica amarelo. */
export function Stats({
	items,
	locale,
}: {
	items: NonNullable<SkillContent["stats"]>["items"];
	locale: Locale;
}) {
	const ratios = items.map((item) => ratio(item.value));
	const bars = ratios.every((r) => r !== undefined);
	const top = Math.max(...ratios.map((r) => r ?? 0));

	if (!bars)
		return (
			<dl className="grid gap-x-8 gap-y-10 sm:grid-cols-3">
				{items.map((item) => (
					<div data-reveal key={item.value}>
						<dd className="font-bold font-mono text-[clamp(2.75rem,6vw,4.5rem)] leading-none tracking-[-0.04em]">
							{item.value}
						</dd>
						<dt className="mt-3 text-muted-foreground">
							{pick(item.label, locale)}
						</dt>
					</div>
				))}
			</dl>
		);

	return (
		<dl className="border-b">
			{items.map((item, i) => (
				<div
					data-reveal
					className="grid items-center gap-x-10 gap-y-3 border-t py-6 sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] sm:py-8"
					key={item.value}
				>
					<dd
						className={cn(
							"font-bold font-mono text-[clamp(2.5rem,6vw,4.5rem)] leading-none tracking-[-0.04em] tabular-nums",
							ratios[i] === top ? "text-foreground" : "text-muted-foreground",
						)}
					>
						{item.value}
					</dd>
					<dt className="min-w-0">
						<span
							className={cn(
								"block font-mono",
								ratios[i] === top && "text-brand-foreground",
							)}
						>
							{pick(item.label, locale)}
						</span>
						<span
							aria-hidden="true"
							className="mt-3 block h-2 w-full bg-accent"
						>
							<span
								className={cn(
									"bar block h-full origin-left",
									ratios[i] === top ? "bg-brand" : "bg-muted-foreground/50",
								)}
								style={{ "--w": ratios[i] } as CSSProperties}
							/>
						</span>
					</dt>
				</div>
			))}
		</dl>
	);
}

export function Modes({
	items,
	locale,
}: {
	items: NonNullable<SkillContent["modes"]>["items"];
	locale: Locale;
}) {
	return (
		<dl className="border-b">
			{items.map((item) => (
				<div
					data-reveal
					className="grid gap-x-10 gap-y-2 border-t py-6 sm:grid-cols-[11rem_minmax(0,1fr)] sm:py-7"
					key={item.term.pt}
				>
					<dt className="font-bold font-mono text-brand-foreground text-2xl">
						{pick(item.term, locale)}
					</dt>
					<dd className="max-w-[60ch] text-lg">
						<Rich text={pick(item.text, locale)} />
					</dd>
				</div>
			))}
		</dl>
	);
}
