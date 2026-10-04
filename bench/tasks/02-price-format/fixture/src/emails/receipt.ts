import { formatBRL } from "../lib/money";

export function receiptText(items: { name: string; cents: number }[]) {
	return items.map((item) => `${item.name}: ${formatBRL(item.cents)}`).join("\n");
}
