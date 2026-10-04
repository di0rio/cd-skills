/** Formats an amount in cents as Brazilian reais. */
export function formatBRL(cents: number): string {
	return `R$ ${(cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
