import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { CSSProperties } from "react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { InView } from "./in-view";

export type Bench = {
	max: number;
	total: { without: number; with: number; max: number };
	rows: { task: string; without: number; with: number }[];
};

const cells = (line: string) =>
	line
		.split("|")
		.slice(1, -1)
		.map((cell) => cell.trim());
const num = (cell: string) => Number(cell.replace(/\*/g, ""));

/**
 * Lê a tabela de `bench/<slug>/RESULTS.md` (colunas `baseline` e o nome da skill). Sem arquivo ou com a tabela
 * em outro formato devolve `undefined`: a skill fica sem gráfico, nada é inventado.
 */
export function readBench(slug: string): Bench | undefined {
	const path = join(process.cwd(), "..", "bench", slug, "RESULTS.md");
	if (!existsSync(path)) return;
	const lines = readFileSync(path, "utf8").split(/\r?\n/);
	const head = lines.findIndex((line) => /^\|\s*Task\b/i.test(line));
	if (head < 0) return;
	const names = cells(lines[head]).map((name) => name.toLowerCase());
	const without = names.indexOf("baseline");
	const withSkill = names.indexOf(slug.toLowerCase());
	if (without < 0 || withSkill < 0) return;

	const rows: Bench["rows"] = [];
	let total: Bench["total"] | undefined;
	for (const line of lines.slice(head + 2)) {
		if (!line.startsWith("|")) break;
		const row = cells(line);
		const label = row[0].replace(/\*/g, "");
		const [a, b] = [num(row[without]), num(row[withSkill])];
		if (Number.isNaN(a) || Number.isNaN(b)) return;
		const max = /\(of (\d+)\)/.exec(label)?.[1];
		if (max) total = { without: a, with: b, max: Number(max) };
		else rows.push({ task: label.replace(/^\d+\s+/, ""), without: a, with: b });
	}
	if (!total || rows.length === 0) return;
	return { max: total.max / rows.length, total, rows };
}

type Labels = {
	task: string;
	without: string;
	with: string;
	total: string;
	higher: string;
	more: string;
	caption: string;
	results: string;
};

const style = (value: number, max: number) =>
	({ "--w": value / max }) as CSSProperties;

function Bar({
	value,
	max,
	brand,
}: {
	value: number;
	max: number;
	brand?: boolean;
}) {
	return (
		<span aria-hidden="true" className="mt-1.5 block h-1.5 bg-accent">
			<span
				className={cn(
					"bar block h-full origin-left",
					brand ? "bg-brand" : "bg-muted-foreground/50",
				)}
				style={style(value, max)}
			/>
		</span>
	);
}

/** Com e sem a skill, nota por tarefa. É tabela de verdade (leitor de tela lê as notas) com barras ao lado do número. */
export function BenchTable({
	slug,
	bench,
	labels,
}: {
	slug: string;
	bench: Bench;
	labels: Labels;
}) {
	const { rows, total, max } = bench;
	const delta = total.with - total.without;
	const th =
		"pb-3 text-left font-normal text-muted-foreground text-xs uppercase tracking-[0.14em]";
	const cell = (
		value: number,
		of: number,
		brand: boolean,
		strong?: boolean,
	) => (
		<td className="py-3 pr-4 align-top tabular-nums last:pr-0">
			<span
				className={cn("font-mono", strong ? "font-bold text-xl" : "text-base")}
			>
				{value}
			</span>
			<Bar brand={brand} max={of} value={value} />
		</td>
	);

	return (
		<figure>
			<dl className="grid grid-cols-3 gap-x-4 border-t pt-6 sm:gap-x-8">
				<div>
					<dd className="font-bold font-mono text-[clamp(1.75rem,6vw,4.5rem)] leading-none tracking-[-0.04em]">
						{total.with}
						<span className="text-[0.4em] text-muted-foreground">
							/{total.max}
						</span>
					</dd>
					<dt className="mt-2 font-mono text-brand-foreground text-xs sm:text-sm">
						{labels.with}
					</dt>
				</div>
				<div>
					<dd className="font-bold font-mono text-[clamp(1.75rem,6vw,4.5rem)] text-muted-foreground leading-none tracking-[-0.04em]">
						{total.without}
						<span className="text-[0.4em]">/{total.max}</span>
					</dd>
					<dt className="mt-2 font-mono text-muted-foreground text-xs sm:text-sm">
						{labels.without}
					</dt>
				</div>
				<div>
					<dd className="font-bold font-mono text-[clamp(1.75rem,6vw,4.5rem)] leading-none tracking-[-0.04em]">
						{delta > 0 ? `+${delta}` : delta}
					</dd>
					<dt className="mt-2 font-mono text-muted-foreground text-xs sm:text-sm">
						{labels.more}
					</dt>
				</div>
			</dl>

			<InView className="mt-10">
				<table className="w-full table-fixed border-collapse">
					<caption className="pb-4 text-left font-mono text-muted-foreground text-xs">
						{slug} · {labels.higher}
					</caption>
					<thead>
						<tr>
							<th className={cn(th, "w-[34%] pr-4 sm:w-[28%]")} scope="col">
								{labels.task}
							</th>
							<th className={cn(th, "pr-4")} scope="col">
								{labels.without}
							</th>
							<th className={th} scope="col">
								{labels.with}
							</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((row) => (
							<tr className="border-t" key={row.task}>
								<th
									className="py-3 pr-4 text-left align-top font-mono font-normal text-sm [overflow-wrap:anywhere]"
									scope="row"
								>
									{row.task}
								</th>
								{cell(row.without, max, false)}
								{cell(row.with, max, true)}
							</tr>
						))}
						<tr className="border-t-2">
							<th
								className="py-4 pr-4 text-left align-top font-bold font-mono text-sm"
								scope="row"
							>
								{labels.total}
							</th>
							{cell(total.without, total.max, false, true)}
							{cell(total.with, total.max, true, true)}
						</tr>
					</tbody>
				</table>
			</InView>

			<figcaption className="mt-6 max-w-[62ch] text-muted-foreground">
				{labels.caption}{" "}
				<a
					className="whitespace-nowrap rounded-sm text-foreground underline decoration-muted-foreground/40 underline-offset-4 outline-none hover:decoration-brand focus-visible:ring-2 focus-visible:ring-brand"
					href={`${site.github}/blob/${site.branch}/bench/${slug}/RESULTS.md`}
					rel="noopener noreferrer"
					target="_blank"
				>
					{labels.results}
					<span aria-hidden="true"> ↗</span>
				</a>
			</figcaption>
		</figure>
	);
}
