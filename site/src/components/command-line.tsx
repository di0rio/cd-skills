import { CodeCopy } from "@/components/code-copy";

/** Linha de terminal: `~ $ comando` com botão de copiar (o prompt não vai pra área de transferência). */
export function CommandLine({
	command,
	copy,
}: {
	command: string;
	copy: { label: string; done: string };
}) {
	return (
		<div className="flex items-center gap-2 rounded-xl border bg-card py-1 pr-1 pl-4">
			<pre className="min-w-0 flex-1 overflow-x-auto py-1.5 font-mono text-sm leading-relaxed">
				<code className="block w-max min-w-full">
					<span aria-hidden="true" className="select-none">
						<span className="text-brand-foreground">~</span>{" "}
						<span className="text-muted-foreground">$</span>{" "}
					</span>
					{command}
				</code>
			</pre>
			<CodeCopy done={copy.done} label={copy.label} text={command} />
		</div>
	);
}
