import type { Locale } from "@/i18n/generated";
import { type Idea, pick, type SkillContent, type Text } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Rich } from "./rich";

type Labels = { removed: string; added: string; before: string; after: string };
type Row = readonly ["-" | "+", string];

/** Linhas de um diff: removida apagada e riscada, adicionada com o `+` amarelo. O sinal vai em texto pra leitor de tela. */
function DiffLines({
	rows,
	labels,
	clamp,
}: {
	rows: readonly Row[];
	labels: Labels;
	clamp?: boolean;
}) {
	return rows.map(([sign, line]) => {
		const removed = sign === "-";
		const Tag = removed ? "del" : "ins";
		return (
			<Tag
				className={cn(
					"flex px-4 no-underline",
					removed &&
						"text-muted-foreground line-through decoration-muted-foreground/50",
				)}
				key={`${sign}${line}`}
			>
				<span className="sr-only">
					{removed ? labels.removed : labels.added}:{" "}
				</span>
				<span
					aria-hidden="true"
					className={cn(
						"w-4 shrink-0 select-none no-underline",
						!removed && "text-brand-foreground",
					)}
				>
					{sign}
				</span>
				<span className={cn(clamp ? "truncate" : "whitespace-pre")}>
					{line}
				</span>
			</Tag>
		);
	});
}

/** O diff como cartão de código de verdade: nome do arquivo, contador e as linhas. */
export function DiffCard({
	idea,
	locale,
	labels,
}: {
	idea: Idea;
	locale: Locale;
	labels: Labels;
}) {
	return (
		<figure>
			<div className="overflow-hidden rounded-xl border bg-card">
				<div className="flex items-center justify-between border-b px-4 py-2 font-mono text-muted-foreground text-xs">
					<span>{idea.file}</span>
					<span className="tabular-nums">{idea.counter}</span>
				</div>
				<pre className="overflow-x-auto py-4 text-[13px] leading-relaxed sm:text-[15px]">
					<code className="block w-max min-w-full">
						<DiffLines labels={labels} rows={idea.lines} />
					</code>
				</pre>
			</div>
			<Caption locale={locale} text={idea.caption} />
		</figure>
	);
}

/** Antes e depois lado a lado: o antes apagado, o depois com a linha amarela. */
export function BeforeAfter({
	idea,
	locale,
	labels,
}: {
	idea: Idea;
	locale: Locale;
	labels: Labels;
}) {
	if (!idea.before || !idea.after) return null;
	return (
		<figure>
			<div className="grid gap-4 md:grid-cols-2">
				<div className="rounded-xl border bg-card p-5 sm:p-6">
					<p className="font-mono text-muted-foreground text-xs uppercase tracking-[0.18em]">
						{labels.before}
					</p>
					<p className="mt-4 text-lg text-muted-foreground leading-relaxed">
						{pick(idea.before, locale)}
					</p>
				</div>
				<div className="rounded-xl border border-brand-foreground/60 bg-card p-5 sm:p-6">
					<p className="font-mono text-brand-foreground text-xs uppercase tracking-[0.18em]">
						{labels.after}
					</p>
					<p className="mt-4 text-lg leading-relaxed">
						{pick(idea.after, locale)}
					</p>
				</div>
			</div>
			<Caption locale={locale} text={idea.caption} />
		</figure>
	);
}

function Caption({ text, locale }: { text: Text; locale: Locale }) {
	return (
		<figcaption className="mt-5 max-w-[62ch] text-muted-foreground">
			{pick(text, locale)}
		</figcaption>
	);
}

export function IdeaBlock(props: {
	idea: Idea;
	locale: Locale;
	labels: Labels;
}) {
	return props.idea.kind === "diff" ? (
		<DiffCard {...props} />
	) : (
		<BeforeAfter {...props} />
	);
}

/** Versão compacta da ideia pra linha da skill na home: no máximo 3 linhas, cada uma cortada em uma. */
export function MiniDemo({
	idea,
	locale,
	labels,
}: {
	idea: Idea;
	locale: Locale;
	labels: Labels;
}) {
	const rows: Row[] =
		idea.kind === "diff"
			? [
					...idea.lines.filter(([sign]) => sign === "-").slice(0, 2),
					...idea.lines.filter(([sign]) => sign === "+").slice(0, 1),
				]
			: [
					["-", pick(idea.before ?? { pt: "" }, locale)],
					["+", pick(idea.after ?? { pt: "" }, locale)],
				];
	return (
		<div className="min-w-0 overflow-hidden rounded-lg border bg-card py-3 font-mono text-[13px] leading-relaxed">
			<DiffLines clamp labels={labels} rows={rows} />
		</div>
	);
}

export function Ladder({ items, locale }: { items: Text[]; locale: Locale }) {
	return (
		<ol className="border-b">
			{items.map((item, i) => (
				<li
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
					<div key={item.value}>
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
								style={{ transform: `scaleX(${ratios[i]})` }}
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
