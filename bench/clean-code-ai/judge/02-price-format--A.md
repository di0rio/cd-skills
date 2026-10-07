# 02-price-format - option A

## diff
```diff
diff -ruN before/src/lib/money.ts after/src/lib/money.ts
--- before/src/lib/money.ts	2026-10-04 20:09:09.275130900 -0300
+++ after/src/lib/money.ts	2026-10-04 20:10:15.722818300 -0300
@@ -1,4 +1,8 @@
 /** Formats an amount in cents as Brazilian reais. */
 export function formatBRL(cents: number): string {
-	return `R$ ${(cents / 100).toFixed(2)}`;
+	const n = (cents / 100).toLocaleString("pt-BR", {
+		minimumFractionDigits: 2,
+		maximumFractionDigits: 2,
+	});
+	return `R$ ${n}`;
 }
```

## reply to user
Fixed `formatBRL` in `src/lib/money.ts` so it formats with Brazilian separators: 123450 cents now gives "R$ 1.234,50". It used `toFixed(2)`, which gives "1234.50".

The checkout total, cart subtotal and receipt email all use this function, so all three are fixed. I ran it on 123450, 5 and 100000000 cents and got "R$ 1.234,50", "R$ 0,05" and "R$ 1.000.000,00". There were no existing tests, so I did not add any.
