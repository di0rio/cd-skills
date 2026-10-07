Removed `toJson` from `src/lib/reports.ts`. Nothing imports it, and `exports.config.json` doesn't list it. Grep found no other reference.

I kept `toLegacyTsv`. It looks dead, but `src/jobs/export.ts` looks formatters up by name from `exports.config.json`, and the `partner-legacy.tsv` export uses it. I replaced its misleading "Old formatter from the v1 dashboard" comment with one saying why it stays.

`toCsv` and `totalAmount` are in use. I haven't run a typecheck or tests, because the project has no scripts or tsconfig.
