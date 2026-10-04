import { formatBRL } from "../lib/money";

export function CheckoutTotal({ total }: { total: number }) {
	return <strong>Total: {formatBRL(total)}</strong>;
}
