Nothing to delete in `src/lib/reports.ts`, so I changed no code.

`toLegacyTsv` looks dead because nothing imports it by name. But `exports.config.json` references it as a string (`"formatter": "toLegacyTsv"`), and `src/jobs/export.ts` looks the formatter up dynamically with `reports[formatter]`. Deleting it would break the `partner-legacy.tsv` export at runtime, and the type checker wouldn't catch it. `toCsv`, `toJson` and `totalAmount` are used the same way or directly.

If the partner export is retired, remove the config entry and then `toLegacyTsv`.
