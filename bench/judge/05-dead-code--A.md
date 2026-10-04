# 05-dead-code - option A

## diff
```diff
diff -ruN before/src/lib/reports.ts after/src/lib/reports.ts
--- before/src/lib/reports.ts	2026-10-04 20:09:09.286579100 -0300
+++ after/src/lib/reports.ts	2026-10-04 20:10:19.699259900 -0300
@@ -5,11 +5,7 @@
 	return [header, ...rows.map((r) => `${r.id},${r.amount},${r.createdAt}`)].join("\n");
 }
 
-export function toJson(rows: Row[]): string {
-	return JSON.stringify(rows, null, 2);
-}
-
-// Old formatter from the v1 dashboard.
+// Still used: referenced by name from exports.config.json (partner-legacy.tsv).
 export function toLegacyTsv(rows: Row[]): string {
 	return rows.map((r) => [r.id, r.amount, r.createdAt].join("\t")).join("\n");
 }
```

## reply to user
Removed `toJson` from `src/lib/reports.ts`. Nothing imports it, and `exports.config.json` doesn't list it. Grep found no other reference.

I kept `toLegacyTsv`. It looks dead, but `src/jobs/export.ts` looks formatters up by name from `exports.config.json`, and the `partner-legacy.tsv` export uses it. I replaced its misleading "Old formatter from the v1 dashboard" comment with one saying why it stays.

`toCsv` and `totalAmount` are in use. I haven't run a typecheck or tests, because the project has no scripts or tsconfig.
