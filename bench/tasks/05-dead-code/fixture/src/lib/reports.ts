export type Row = { id: string; amount: number; createdAt: string };

export function toCsv(rows: Row[]): string {
	const header = "id,amount,createdAt";
	return [header, ...rows.map((r) => `${r.id},${r.amount},${r.createdAt}`)].join("\n");
}

export function toJson(rows: Row[]): string {
	return JSON.stringify(rows, null, 2);
}

// Old formatter from the v1 dashboard.
export function toLegacyTsv(rows: Row[]): string {
	return rows.map((r) => [r.id, r.amount, r.createdAt].join("\t")).join("\n");
}

export function totalAmount(rows: Row[]): number {
	return rows.reduce((sum, r) => sum + r.amount, 0);
}
