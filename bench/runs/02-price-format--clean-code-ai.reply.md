Fixed. Root cause was in `formatBRL` in `src/lib/money.ts`, which used `toFixed(2)`. That gives no thousands separator and a dot as the decimal mark. It now formats the amount with `toLocaleString("pt-BR", {minimumFractionDigits: 2, maximumFractionDigits: 2})` and keeps the `R$ ` prefix, so 123450 cents gives "R$ 1.234,50".

I fixed it in the shared function, so the checkout total, the cart subtotal (`cart-summary.tsx`) and the receipt email (`receipt.ts`) all pick it up. Its signature is unchanged.

I didn't run anything (no typecheck, lint, tests or browser check), so the new output is untested. I also didn't add a test.

Receipt emails are plain text and will now show "1.234,50" too. That seems right for BRL, but say so if you wanted them left as they were.
