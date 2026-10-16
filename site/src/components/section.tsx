import type { ReactNode } from "react";
import { Decode } from "./decode";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Seção numerada: linha fina em cima, número e rótulo numa coluna estreita, título grande ao lado.
 * No celular as duas colunas viram uma.
 */
export function Section({
	n,
	label,
	id,
	title,
	intro,
	children,
}: {
	n: number;
	label: string;
	id: string;
	title: string;
	intro?: ReactNode;
	children: ReactNode;
}) {
	return (
		<section
			aria-labelledby={`${id}-title`}
			className="scroll-mt-4 pt-20 sm:pt-32"
			id={id}
		>
			<div className="wrap">
				<div className="relative grid gap-x-14 gap-y-6 border-t pt-8 md:grid-cols-[150px_minmax(0,1fr)]">
					<i
						aria-hidden="true"
						className="xh top-0 left-0 -translate-x-1/2 -translate-y-1/2"
					/>
					<i
						aria-hidden="true"
						className="xh top-0 right-0 translate-x-1/2 -translate-y-1/2"
					/>
					<p className="font-mono text-muted-foreground text-xs uppercase tracking-[0.18em]">
						<span className="text-brand-foreground tabular-nums">{pad(n)}</span>
						<span className="mt-1 block">
							{"// "}
							{label}
						</span>
					</p>
					<div className="min-w-0">
						<h2
							className="display text-[clamp(2rem,4.6vw,3.75rem)]"
							id={`${id}-title`}
						>
							<Decode text={title} />
						</h2>
						{intro && (
							<p className="mt-5 max-w-[56ch] text-lg text-muted-foreground">
								{intro}
							</p>
						)}
						<div className="mt-10 sm:mt-14">{children}</div>
					</div>
				</div>
			</div>
		</section>
	);
}
