# 02-price-format - option C

## diff
```diff
diff -ruN before/src/lib/money.test.ts after/src/lib/money.test.ts
--- before/src/lib/money.test.ts	1969-12-31 21:00:00.000000000 -0300
+++ after/src/lib/money.test.ts	2026-10-04 20:10:15.859731400 -0300
@@ -0,0 +1,8 @@
+import { expect, test } from "bun:test";
+import { formatBRL } from "./money";
+
+test("formats cents as BRL with thousands and decimal separators", () => {
+	expect(formatBRL(123450)).toBe("R$ 1.234,50");
+	expect(formatBRL(5)).toBe("R$ 0,05");
+	expect(formatBRL(0)).toBe("R$ 0,00");
+});
diff -ruN before/src/lib/money.ts after/src/lib/money.ts
--- before/src/lib/money.ts	2026-10-04 20:09:09.275130900 -0300
+++ after/src/lib/money.ts	2026-10-04 20:10:15.832908600 -0300
@@ -1,4 +1,8 @@
 /** Formats an amount in cents as Brazilian reais. */
 export function formatBRL(cents: number): string {
-	return `R$ ${(cents / 100).toFixed(2)}`;
+	const amount = (cents / 100).toLocaleString("pt-BR", {
+		minimumFractionDigits: 2,
+		maximumFractionDigits: 2,
+	});
+	return `R$ ${amount}`;
 }
```

## reply to user
Fixed in `src/lib/money.ts`: `formatBRL` now uses `toLocaleString("pt-BR")` with 2 fraction digits, so 123450 cents gives "R$ 1.234,50". The checkout total, cart subtotal and receipt email all call this one function, so all three are fixed. I added `src/lib/money.test.ts` and `bun test` passes. -> skipped: negative amounts and other currencies, add when the app needs them.
