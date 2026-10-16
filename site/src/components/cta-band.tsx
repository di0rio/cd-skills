import { Avatar } from "./avatar";
import { CommandLine } from "./command-line";
import { Corners } from "./corners";
import { Decode } from "./decode";
import { Rich } from "./rich";
import { Button } from "./ui/button";

/** Faixa final: a linha de instalação de novo (quem chegou até aqui já decidiu) e o link do repositório. */
export function CtaBand({
	label,
	title,
	text,
	command,
	copy,
	github,
	githubUrl,
	avatarAlt,
}: {
	label: string;
	title: string;
	text: string;
	command: string;
	copy: { label: string; done: string };
	github: string;
	githubUrl: string;
	avatarAlt: string;
}) {
	return (
		<section aria-labelledby="cta-title" className="wrap pt-24 pb-12 sm:pt-32">
			<div className="relative grid gap-8 border px-5 py-10 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-14">
				<Corners />
				<div className="min-w-0">
					<p className="font-mono text-muted-foreground text-xs uppercase tracking-[0.18em]">
						{"// "}
						{label}
					</p>
					<h2
						className="display mt-4 text-[clamp(2rem,4.6vw,3.75rem)]"
						id="cta-title"
					>
						<Decode text={title} />
					</h2>
					<p className="mt-5 max-w-[48ch] text-lg text-muted-foreground">
						<Rich text={text} />
					</p>
					<div className="mt-8 max-w-[44rem]">
						<CommandLine command={command} copy={copy} />
					</div>
					<div className="mt-5">
						<Button
							nativeButton={false}
							render={
								<a href={githubUrl} rel="noopener noreferrer" target="_blank" />
							}
							variant="outline"
						>
							{github}
							<span aria-hidden="true">↗</span>
						</Button>
					</div>
				</div>
				<Avatar alt={avatarAlt} className="hidden size-32 lg:block" />
			</div>
		</section>
	);
}
