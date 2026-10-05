/** Formats an amount in cents as Brazilian reais. */
export function formatBRL(cents: number): string {
	const amount = (cents / 100).toLocaleString("pt-BR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
	return `R$ ${amount}`;
}
