# Benchmark results

> These results were measured with the previous version of the skill, `pragmatic-code` (the file was at `skills/pragmatic-code/SKILL.md`, see git history). They have not been re-run for `clean-code-ai`.

Five small tasks, each run three times with the same model (Claude Sonnet) in an isolated copy of the fixture:

- **baseline**: no rules
- **ponytail**: [ponytail](https://ponytail.dev/) SKILL.md, default intensity
- **pragmatic**: `skills/pragmatic-code/SKILL.md` (previous version, see the note above)

A separate judge (Claude Opus) scored the 15 attempts blind: the three attempts of each task were shuffled into options A/B/C, and identifying comments were removed. The full verdict, with justifications, is in [`VERDICT.md`](VERDICT.md); the letter mapping is below. Raw outputs are in [`runs/`](runs/), anonymized inputs to the judge in [`judge/`](judge/).

Score: correctness + minimal & scoped + safety + communication, 0-10 each, total out of 40.

| Task | What it tests | baseline | ponytail | pragmatic |
|---|---|---|---|---|
| 01 featured card | local styling vs new globals, existing tokens | 32 | 36 | **39** |
| 02 price format | fix the shared function, not the one caller in the ticket | **39** | 38 | 38 |
| 03 relative dates | native `Intl` vs a date library, old dates | 33 | 31 | **37** |
| 04 simplify handler | shorter without dropping auth/validation | **37** | 36 | **37** |
| 05 dead code | code that looks unused but is wired by name in config | 36 | 17 | **39** |
| **Total (of 200)** | | 177 | 158 | **190** |

## What happened

- **05**: all three kept `toLegacyTsv` (called by name from `exports.config.json`). Only pragmatic also removed `toJson`, the one export that really was dead. Ponytail changed nothing and told the user `toJson` was in use, which is false.
- **03**: nobody added a dependency. Baseline and ponytail counted only days ("há 400 dias" for old posts) and disclosed it; pragmatic switched to months/years and flagged that `Date.now()` goes stale on cached pages.
- **01**: all used Tailwind classes and the existing `brand` token, none created globals. Baseline and ponytail left `border` and `border-4` on the same element (works only by CSS order).
- **02** and **04**: all three were correct and close; the differences were a test added or not, and how accurate the reply was. Pragmatic misreported a line count in 04 ("45 -> 33", the original had 50).

## Limits

- One run per task and arm. LLM output varies run to run; treat this as a smoke test, not a statistically significant benchmark.
- The judge is also an LLM. It was blind to which rules each attempt used, but it is not a human review.
- Tasks are small, single-file-ish fixtures written by the author of `pragmatic-code`, so they may favor the failure modes it was designed to catch.

## Letter mapping

| Task | A | B | C |
|---|---|---|---|
| 01-featured-card | baseline | pragmatic | ponytail |
| 02-price-format | ponytail | baseline | pragmatic |
| 03-relative-dates | baseline | pragmatic | ponytail |
| 04-simplify-handler | baseline | ponytail | pragmatic |
| 05-dead-code | pragmatic | ponytail | baseline |
