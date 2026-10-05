Removed `toJson` from src/lib/reports.ts. Nothing in the project references it by import, by name or in config.

Kept `toLegacyTsv` even though nothing imports it. `exports.config.json` names it as `"formatter": "toLegacyTsv"`, and `src/jobs/export.ts` looks formatters up by string, so it is live. Deleting it would break the `partner-legacy.tsv` export.

I did not run typecheck or lint; none were run.
