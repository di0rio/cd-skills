Fixed `formatBRL` in `src/lib/money.ts` so it formats with Brazilian separators: 123450 cents now gives "R$ 1.234,50". It used `toFixed(2)`, which gives "1234.50".

The checkout total, cart subtotal and receipt email all use this function, so all three are fixed. I ran it on 123450, 5 and 100000000 cents and got "R$ 1.234,50", "R$ 0,05" and "R$ 1.000.000,00". There were no existing tests, so I did not add any.
