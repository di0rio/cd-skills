# 05-dead-code - option C

## diff
```diff
diff -ruN before/src/lib/reports.ts after/src/lib/reports.ts
--- before/src/lib/reports.ts	2026-10-04 20:09:09.286579100 -0300
+++ after/src/lib/reports.ts	2026-10-04 20:10:13.439896200 -0300
@@ -1,19 +1,15 @@
-export type Row = { id: string; amount: number; createdAt: string };
-
-export function toCsv(rows: Row[]): string {
-	const header = "id,amount,createdAt";
-	return [header, ...rows.map((r) => `${r.id},${r.amount},${r.createdAt}`)].join("\n");
-}
-
-export function toJson(rows: Row[]): string {
-	return JSON.stringify(rows, null, 2);
-}
-
-// Old formatter from the v1 dashboard.
-export function toLegacyTsv(rows: Row[]): string {
-	return rows.map((r) => [r.id, r.amount, r.createdAt].join("\t")).join("\n");
-}
-
-export function totalAmount(rows: Row[]): number {
-	return rows.reduce((sum, r) => sum + r.amount, 0);
-}
+export type Row = { id: string; amount: number; createdAt: string };
+
+export function toCsv(rows: Row[]): string {
+	const header = "id,amount,createdAt";
+	return [header, ...rows.map((r) => `${r.id},${r.amount},${r.createdAt}`)].join("\n");
+}
+
+// Old formatter from the v1 dashboard.
+export function toLegacyTsv(rows: Row[]): string {
+	return rows.map((r) => [r.id, r.amount, r.createdAt].join("\t")).join("\n");
+}
+
+export function totalAmount(rows: Row[]): number {
+	return rows.reduce((sum, r) => sum + r.amount, 0);
+}
```

## reply to user
Removed `toJson` from `src/lib/reports.ts`. It was the only dead code: nothing imports it, and `exports.config.json` doesn't name it.

I kept `toLegacyTsv`. It looks dead because nothing imports it and the "Old formatter" comment suggests it's leftover. But `src/jobs/export.ts` looks formatters up by name from `exports.config.json`, and the `partner-legacy.tsv` export uses `toLegacyTsv`. Removing it would break that export at runtime, and the type checker wouldn't catch it. `toCsv` is used the same way, and `totalAmount` is imported in `src/index.ts`.

I didn't run a build or tests.
