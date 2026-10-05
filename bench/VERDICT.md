# Blind benchmark verdict
Scale: 0-10 per criterion, 40 max per option; judged only from `tasks/*` (TASK.md + fixture) and `judge/*`; `runs/` was not opened to keep it blind.

## 01-featured-card
| Option | Correctness | Minimal | Safety | Communication | Total |
|---|---|---|---|---|---|
| A | 9 | 4 | 10 | 7 | **30** |
| B | 10 | 10 | 10 | 9 | **39** |
| C | 10 | 9 | 10 | 9 | **38** |
| D | 9 | 10 | 10 | 7 | **36** |
- **A**: Uses the brand token and keys off `project.featured`, but keeps `border` together with `border-4` (two border-width utilities, relies on Tailwind ordering). The diff rewrites all 10 lines of the file (line-ending churn) for a 2-line change, and the reply does not mention it. It does say it was not run.
- **B** (best): Smallest clean diff. The featured branch swaps `border border-neutral-200` for `border-4 border-brand`, so no conflicting width classes, and the description goes `mt-1` to `mt-3`. The long `<p>` is wrapped. Reply is accurate and says no typecheck/build was run.
- **C**: Same structure as B with `border-2` and `mt-2`, both valid readings of "thicker" and "a bit more". The `<p>` line is left unwrapped (long line). Reply is honest about what was checked, though a bit wordy (the `cat -A` detail).
- **D**: Minimal, wrapped diff, but has the same `border` + `border-4` overlap as A. Reply is accurate but never says it was not run or checked.

## 02-price-format
| Option | Correctness | Minimal | Safety | Communication | Total |
|---|---|---|---|---|---|
| A | 10 | 10 | 10 | 10 | **40** |
| B | 10 | 9 | 10 | 9 | **38** |
| C | 10 | 8 | 10 | 9 | **37** |
| D | 10 | 10 | 10 | 9 | **39** |
- **A** (best): Fixes the root cause in the shared `formatBRL` with `toLocaleString("pt-BR")` and 2 fraction digits. I verified it gives "R$ 1.234,50", "R$ 0,05" and "R$ 1.000.000,00", which matches the values it reports. It correctly notes that all three callers are fixed and no test was added.
- **B**: Same fix as A, plus a new `money.test.ts`. The test is reasonable since the project has `bun test`, but nobody asked for it. Reply is accurate and notes the scope it skipped.
- **C**: Same fix, but crammed onto one long line, plus an unrequested test. Reply is accurate and short, though it leaves the checkout total out of the list of fixed places.
- **D**: Same 4-line fix as A. Reply is honest that nothing was run and flags that the receipt email output also changes. Good, if a bit long.

## 03-relative-dates
| Option | Correctness | Minimal | Safety | Communication | Total |
|---|---|---|---|---|---|
| A | 10 | 9 | 10 | 9 | **38** |
| B | 8 | 9 | 10 | 9 | **36** |
| C | 10 | 9 | 10 | 9 | **38** |
| D | 8 | 10 | 10 | 9 | **37** |
- **A** (best, tied with C): Uses `Intl.RelativeTimeFormat` with `numeric: "auto"` and switches days to months to years, so old posts read naturally. I verified the output: "há 3 dias", "ontem", "hoje". It keeps `<time dateTime>`. Reply is accurate, says it was not run, and flags that static caching makes the text go stale.
- **B**: Days only, so old posts read "há 400 dias", which is weaker for a blog list. It does disclose this, both in a code comment and in the reply. The one-line helper is long. Reply is honest that it was not run.
- **C** (best, tied with A): Diff is identical to A. Reply is accurate and honest that it was not run, and its hydration note is correct (the component is a server component).
- **D**: Days only, like B, but with a cleanly wrapped helper. `-Math.floor` works: -0 gives "hoje" and it never rounds up to a later day. Reply discloses the days-only limit, the `numeric` option and that it was not run.

## 04-simplify-handler
| Option | Correctness | Minimal | Safety | Communication | Total |
|---|---|---|---|---|---|
| A | 10 | 9 | 10 | 9 | **38** |
| B | 10 | 8 | 10 | 8 | **36** |
| C | 10 | 9 | 10 | 8 | **37** |
| D | 10 | 10 | 10 | 7 | **37** |
- **A** (best): `Response.json` everywhere, and `result.data` is passed straight to the DB. The `.catch(() => undefined)` parse guard is safe because JSON cannot encode `undefined`. Status codes, error bodies, auth and zod validation are all kept. Reply makes no wrong numeric claims and says it was not type-checked.
- **B**: Same as A, but folds the update and the response into one long nested-await line, which hurts readability. Claims "50 lines down to 24", but the result is 23 lines (fixture 50, -42 +15).
- **C**: A conservative, correct cleanup that keeps the try/catch and keeps an unnecessary `{ name, bio }` destructure. Claims "50 to 36", but the result is 35 lines (-41 +26).
- **D**: The cleanest change: keeps the try/catch structure, uses `Response.json`, passes `result.data` straight through and drops the dead binding. The reply's "45 -> 33 lines" is wrong on both ends: the fixture has 50 lines and the result has 34.

## 05-dead-code
| Option | Correctness | Minimal | Safety | Communication | Total |
|---|---|---|---|---|---|
| A | 10 | 9 | 10 | 9 | **38** |
| B | 3 | 5 | 10 | 3 | **21** |
| C | 10 | 4 | 10 | 7 | **31** |
| D | 10 | 10 | 10 | 9 | **39** |
- **A**: Removes `toJson`, which is truly dead: not imported, not in `exports.config.json`, not re-exported from `index.ts`. It correctly keeps `toLegacyTsv`, which is found by name at runtime. It also replaces the misleading comment, a small but justified extra. Reply is accurate and says nothing was run.
- **B**: Changes nothing. It correctly protects `toLegacyTsv` but misses `toJson`, and falsely claims `toJson` is "used the same way or directly". That leaves the request undone, and the claim is wrong.
- **C**: Correct removal of `toJson` with `toLegacyTsv` kept, but the diff rewrites the whole file (line-ending churn). The reply does not mention the rewrite. Otherwise the explanation is accurate and says no build was run.
- **D** (best): The exact 4-line removal of `toJson`, with the dynamically used `toLegacyTsv` kept and its reason explained correctly. Reply is short, accurate and says nothing was run.

## Patterns observed (letters reshuffled per task)
- 01-featured-card: All four used the brand token and the `featured` flag. The differences were the `border` + `border-N` overlap (A, D) and one whole-file line-ending rewrite (A).
- 02-price-format: All four made the same correct root-cause fix in `formatBRL`. Two added unrequested tests (B, C). The only real difference was how well the output was verified and reported.
- 03-relative-dates: The split was unit handling. A and C (identical diffs) step to months and years. B and D stay in days but say so openly.
- 04-simplify-handler: Every option kept auth, parse and validation behavior. Three of four replies misstated line counts (B and C by one, D by more), the main communication flaw.
- 05-dead-code: Three of four found the trap (`toLegacyTsv` used by name at runtime) and removed only `toJson`. B over-corrected into doing nothing, with a false claim. C repeated the whole-file churn pattern.
- Across all tasks: No option weakened safety. Scores were separated by whole-file line-ending churn that the replies never disclosed, unverified numeric claims (line counts) and over-caution or over-compression, not by functional bugs. The most consistent options made the narrowest edit and said plainly what was not run.
