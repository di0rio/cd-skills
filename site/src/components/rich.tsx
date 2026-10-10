/** Texto entre crases vira código mono; o resto passa direto. Mantém a copy num string só por idioma. */
export function Rich({ text }: { text: string }) {
	return text.split("`").map((part, i) =>
		i % 2 ? (
			<code
				className="rounded-md bg-accent px-1.5 font-mono text-foreground text-sm"
				key={part}
			>
				{part}
			</code>
		) : (
			part
		),
	);
}
