# 02-price-format - option D

## diff
```diff
diff -ruN before/src/lib/money.ts after/src/lib/money.ts
--- before/src/lib/money.ts	2026-10-05 13:03:51.311959400 -0300
+++ after/src/lib/money.ts	2026-10-05 13:04:31.394946500 -0300
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
Fixed. Root cause was in `formatBRL` in `src/lib/money.ts`, which used `toFixed(2)`. That gives no thousands separator and a dot as the decimal mark. It now formats the amount with `toLocaleString("pt-BR", {minimumFractionDigits: 2, maximumFractionDigits: 2})` and keeps the `R$ ` prefix, so 123450 cents gives "R$ 1.234,50".

I fixed it in the shared function, so the checkout total, the cart subtotal (`cart-summary.tsx`) and the receipt email (`receipt.ts`) all pick it up. Its signature is unchanged.

I didn't run anything (no typecheck, lint, tests or browser check), so the new output is untested. I also didn't add a test.

Receipt emails are plain text and will now show "1.234,50" too. That seems right for BRL, but say so if you wanted them left as they were.
