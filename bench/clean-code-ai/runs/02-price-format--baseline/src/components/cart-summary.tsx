import { formatBRL } from "../lib/money";

export function CartSummary({ subtotal }: { subtotal: number }) {
	return <p>Subtotal: {formatBRL(subtotal)}</p>;
}
