# 05-dead-code - option D

## diff
```diff
diff -ruN before/src/lib/reports.ts after/src/lib/reports.ts
--- before/src/lib/reports.ts	2026-10-05 13:03:51.612822800 -0300
+++ after/src/lib/reports.ts	2026-10-05 13:04:34.759509200 -0300
@@ -5,10 +5,6 @@
 	return [header, ...rows.map((r) => `${r.id},${r.amount},${r.createdAt}`)].join("\n");
 }
 
-export function toJson(rows: Row[]): string {
-	return JSON.stringify(rows, null, 2);
-}
-
 // Old formatter from the v1 dashboard.
 export function toLegacyTsv(rows: Row[]): string {
 	return rows.map((r) => [r.id, r.amount, r.createdAt].join("\t")).join("\n");
```

## reply to user
Removed `toJson` from src/lib/reports.ts. Nothing in the project references it by import, by name or in config.

Kept `toLegacyTsv` even though nothing imports it. `exports.config.json` names it as `"formatter": "toLegacyTsv"`, and `src/jobs/export.ts` looks formatters up by string, so it is live. Deleting it would break the `partner-legacy.tsv` export.

I did not run typecheck or lint; none were run.
