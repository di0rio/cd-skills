Removed `toJson` from `src/lib/reports.ts`. It was the only dead code: nothing imports it, and `exports.config.json` doesn't name it.

I kept `toLegacyTsv`. It looks dead because nothing imports it and the "Old formatter" comment suggests it's leftover. But `src/jobs/export.ts` looks formatters up by name from `exports.config.json`, and the `partner-legacy.tsv` export uses `toLegacyTsv`. Removing it would break that export at runtime, and the type checker wouldn't catch it. `toCsv` is used the same way, and `totalAmount` is imported in `src/index.ts`.

I didn't run a build or tests.
