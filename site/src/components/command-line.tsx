import { CodeCopy } from "@/components/code-copy";
import { cn } from "@/lib/utils";

/** Linha de terminal: `~ $ comando` com botão de copiar (o prompt não vai pra área de transferência). */
export function CommandLine({
	command,
	copy,
	large,
}: {
	command: string;
	copy: { label: string; done: string };
	/** Versão grande, pra seção de instalar. */
	large?: boolean;
}) {
	return (
		<div
			className={cn(
				"flex items-start gap-2 rounded-xl border bg-card py-1 pr-1 pl-4 sm:items-center",
				large && "pl-5 sm:py-3 sm:pr-3 sm:pl-6",
			)}
		>
			<pre
				className={cn(
					"min-w-0 flex-1 whitespace-pre-wrap py-1.5 font-mono text-sm leading-relaxed [overflow-wrap:anywhere] sm:overflow-x-auto sm:whitespace-pre sm:[overflow-wrap:normal]",
					large && "text-[15px] sm:text-xl",
				)}
			>
				<code className="block sm:w-max sm:min-w-full">
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
