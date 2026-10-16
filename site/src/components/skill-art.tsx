import type { Locale } from "@/i18n/generated";
import { type Idea, pick } from "@/lib/content";
import { Live } from "./live";

type Labels = { before: string; after: string };

/** Fundo comum das ilustrações: poço fundo, tamanho fixo pra nada pular, e `cq` pra o cursor andar em % da largura. */
function Well({ children }: { children: React.ReactNode }) {
	return (
		<Live className="@container h-36 overflow-hidden rounded-lg border bg-accent/60 p-4 font-mono text-[12px] leading-relaxed">
			{children}
		</Live>
	);
}

/** clean-code-ai e qualquer skill com `diff`: as linhas riscam e a que sobra aparece. */
function DiffArt({ idea }: { idea: Idea }) {
	const removed = idea.lines.filter(([sign]) => sign === "-").slice(0, 4);
	const added = idea.lines.find(([sign]) => sign === "+");
	return (
		<Well>
			{removed.map(([, line], i) => (
				<p
					className="a-dim truncate text-muted-foreground opacity-45"
					key={line}
					style={{ "--i": i } as React.CSSProperties}
				>
					<span
						className="a-x truncate"
						data-on=""
						style={{ "--i": i } as React.CSSProperties}
					>
						{line}
					</span>
				</p>
			))}
			{added && (
				<p className="a-show mt-2 truncate">
					<span className="text-brand-foreground">+ </span>
					{added[1]}
				</p>
			)}
		</Well>
	);
}

/** humanizar e skills de texto: o antes some e o depois entra no mesmo lugar. */
function RewriteArt({
	idea,
	locale,
	labels,
}: {
	idea: Idea;
	locale: Locale;
	labels: Labels;
}) {
	const block = "col-start-1 row-start-1 min-w-0";
	return (
		<Well>
			<div className="grid font-sans text-[13px] leading-snug">
				<p className={`a-before text-muted-foreground opacity-0 ${block}`}>
					<span className="mb-1 block font-mono text-[11px] uppercase tracking-[0.18em]">
						{labels.before}
					</span>
					<span className="line-clamp-4">
						{pick(idea.before ?? { pt: "" }, locale)}
					</span>
				</p>
				<p className={`a-after ${block}`}>
					<span className="mb-1 block font-mono text-[11px] text-brand-foreground uppercase tracking-[0.18em]">
						{labels.after}
					</span>
					<span className="line-clamp-4">
						{pick(idea.after ?? { pt: "" }, locale)}
					</span>
				</p>
			</div>
		</Well>
	);
}

/** portfolio-demo: um gravador de tela minúsculo, com o cursor passeando e a linha do tempo enchendo. */
function RecorderArt() {
	return (
		<Well>
			<div className="relative flex h-full flex-col gap-3">
				<div className="flex items-center gap-2 text-muted-foreground">
					<span className="a-rec size-2 rounded-full bg-destructive" />
					rec
				</div>
				<div className="relative flex-1 rounded-md border bg-card">
					<span className="absolute top-2 left-2 h-2 w-1/3 rounded-full bg-accent" />
					<span className="absolute top-6 left-2 h-2 w-1/2 rounded-full bg-accent" />
					<span className="absolute top-2 right-2 h-6 w-1/5 rounded-md border border-brand-foreground/50" />
					<span className="a-cursor absolute top-0 left-0 size-2.5 rotate-[-20deg] rounded-[2px_8px_8px_8px] bg-brand ring-1 ring-black/60 [translate:62cqw_16cqw]" />
				</div>
				<span className="h-1 rounded-full bg-accent">
					<span className="a-fill block h-full origin-left rounded-full bg-brand" />
				</span>
			</div>
		</Well>
	);
}

const bySlug: Record<string, () => React.ReactElement> = {
	"portfolio-demo": RecorderArt,
};

/** Ilustração pequena e viva de uma skill. Skill nova sem ilustração própria usa a do tipo da `idea`. */
export function SkillArt({
	slug,
	idea,
	locale,
	labels,
}: {
	slug: string;
	idea: Idea;
	locale: Locale;
	labels: Labels;
}) {
	const Special = bySlug[slug];
	return (
		<div aria-hidden="true">
			{Special ? (
				<Special />
			) : idea.kind === "diff" ? (
				<DiffArt idea={idea} />
			) : (
				<RewriteArt idea={idea} labels={labels} locale={locale} />
			)}
		</div>
	);
}
