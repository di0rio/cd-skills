"use client";

import { Tabs } from "@base-ui/react/tabs";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { CommandLine } from "./command-line";

type Copy = { label: string; done: string };

/** "setup pra agente": copia um prompt pronto pra colar no agente, que roda a instalação sozinho. */
function AgentPrompt({
	label,
	done,
	prompt,
}: {
	label: string;
	done: string;
	prompt: string;
}) {
	const [copied, setCopied] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
	useEffect(() => () => clearTimeout(timer.current), []);
	return (
		<button
			className="rounded-sm font-mono text-muted-foreground text-sm underline decoration-muted-foreground/40 underline-offset-4 outline-none transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand"
			onClick={async () => {
				try {
					await navigator.clipboard.writeText(prompt);
				} catch {
					return; // sem permissão de área de transferência: não finge que copiou
				}
				setCopied(true);
				clearTimeout(timer.current);
				timer.current = setTimeout(() => setCopied(false), 1500);
			}}
			type="button"
		>
			{copied ? done : label}
		</button>
	);
}

/**
 * Instalação em abas de texto, como o `typescript python go` do hero de referência: uma aba por comando (todas,
 * uma skill) e uma "na mão" opcional com texto. O comando mostrado é o que o botão copia.
 */
export function InstallPanel({
	label,
	tabs,
	manual,
	copy,
	large,
	agents,
	aside,
}: {
	label: string;
	tabs: { id: string; label: string; command: string }[];
	manual?: { label: string; body: ReactNode };
	copy: Copy;
	large?: boolean;
	agents?: { label: string; done: string; prompt: string };
	/** Links extras na linha de baixo, ao lado do "setup pra agente". */
	aside?: ReactNode;
}) {
	return (
		<Tabs.Root
			className="flex min-w-0 flex-col gap-4"
			defaultValue={tabs[0].id}
		>
			<Tabs.List
				aria-label={label}
				className="relative -mx-1 flex gap-x-5 overflow-x-auto px-1 pb-2 font-mono text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				{[
					...tabs,
					...(manual ? [{ id: "manual", label: manual.label }] : []),
				].map(({ id, label: text }) => (
					<Tabs.Tab
						className="shrink-0 rounded-sm py-1 text-muted-foreground outline-none transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand data-active:text-foreground"
						key={id}
						value={id}
					>
						{text}
					</Tabs.Tab>
				))}
				<Tabs.Indicator className="absolute bottom-0 left-0 h-0.5 w-(--active-tab-width) translate-x-(--active-tab-left) bg-brand transition-[translate,width] duration-base ease-in-out" />
			</Tabs.List>
			{tabs.map(({ id, command }) => (
				<Tabs.Panel className="outline-none" key={id} value={id}>
					<CommandLine command={command} copy={copy} large={large} />
				</Tabs.Panel>
			))}
			{manual && (
				<Tabs.Panel className="outline-none" value="manual">
					<div className="flex flex-col gap-3 rounded-xl border bg-card p-5 text-muted-foreground sm:p-6">
						{manual.body}
					</div>
				</Tabs.Panel>
			)}
			{(agents || aside) && (
				<div className="flex flex-wrap items-center gap-x-6 gap-y-2">
					{agents && <AgentPrompt {...agents} />}
					{aside}
				</div>
			)}
		</Tabs.Root>
	);
}
