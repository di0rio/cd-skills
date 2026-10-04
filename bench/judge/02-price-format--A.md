# 02-price-format - option A

## diff
```diff
diff -ruN before/src/lib/money.test.ts after/src/lib/money.test.ts
--- before/src/lib/money.test.ts	1969-12-31 21:00:00.000000000 -0300
+++ after/src/lib/money.test.ts	2026-10-04 20:10:16.476864400 -0300
@@ -0,0 +1,7 @@
+import { expect, test } from "bun:test";
+import { formatBRL } from "./money";
+
+test("formatBRL", () => {
+	expect(formatBRL(123450)).toBe("R$ 1.234,50");
+	expect(formatBRL(5)).toBe("R$ 0,05");
+});
diff -ruN before/src/lib/money.ts after/src/lib/money.ts
--- before/src/lib/money.ts	2026-10-04 20:09:09.275130900 -0300
+++ after/src/lib/money.ts	2026-10-04 20:10:16.440182400 -0300
@@ -1,4 +1,4 @@
 /** Formats an amount in cents as Brazilian reais. */
 export function formatBRL(cents: number): string {
-	return `R$ ${(cents / 100).toFixed(2)}`;
+	return `R$ ${(cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
 }
```

## reply to user
Fixed in `src/lib/money.ts`: `formatBRL` now uses `toLocaleString("pt-BR", 2 decimals)`, so 123450 cents gives "R$ 1.234,50". It was the shared formatter, so the cart summary and receipt email are fixed too. Added `src/lib/money.test.ts` as a regression check; `bun test` passes.
