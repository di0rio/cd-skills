# Benchmark results

Five small tasks, each run four times with the same model (Claude Sonnet) in an isolated copy of the fixture:

- **baseline**: no rules
- **ponytail**: [ponytail](https://ponytail.dev/) SKILL.md, default intensity
- **pragmatic**: `pragmatic-code`, the previous version of this skill (it lived at `skills/pragmatic-code/SKILL.md`, see git history)
- **clean-code-ai**: [`skills/clean-code-ai/SKILL.md`](../../skills/clean-code-ai/SKILL.md), default level (full)

The baseline, ponytail and pragmatic runs are from 2026-10-04; the clean-code-ai runs are from 2026-10-05. On 2026-10-05 a separate judge (Claude Opus) re-scored all 20 attempts blind, together: the four attempts of each task were shuffled into options A/B/C/D, and identifying comments were removed. The full verdict, with justifications, is in [`VERDICT.md`](VERDICT.md); the letter mapping is below. Raw outputs are in [`runs/`](runs/), anonymized inputs to the judge in [`judge/`](judge/). The first 3-arm verdict is in git history.

Score: correctness + minimal & scoped + safety + communication, 0-10 each, total out of 40.

| Task | What it tests | baseline | ponytail | pragmatic | clean-code-ai |
|---|---|---|---|---|---|
| 01 featured card | local styling vs new globals, existing tokens | 30 | 36 | **39** | 38 |
| 02 price format | fix the shared function, not the one caller in the ticket | **40** | 37 | 38 | 39 |
| 03 relative dates | native `Intl` vs a date library, old dates | 37 | 36 | **38** | **38** |
| 04 simplify handler | shorter without dropping auth/validation | **38** | 36 | 37 | 37 |
| 05 dead code | code that looks unused but is wired by name in config | 31 | 21 | 38 | **39** |
| **Total (of 200)** | | 176 | 166 | 190 | **191** |

## What happened

- **clean-code-ai vs pragmatic**: practically a tie (191 vs 190). Neither fell into a trap in any task; the differences are small diff and reply details.
- **05**: clean-code-ai and pragmatic removed only `toJson` (really dead) and kept `toLegacyTsv` (called by name from `exports.config.json`). clean-code-ai did it in the exact 4-line removal; pragmatic also rewrote the misleading comment. Baseline got it right but rewrote the whole file (line-ending churn). Ponytail changed nothing and claimed `toJson` was in use, which is false.
- **03**: clean-code-ai produced the same code as pragmatic (days, then months, then years) and flagged the hydration risk if the component ever runs on the client. Baseline and ponytail counted only days ("há 400 dias") and disclosed it.
- **01**: clean-code-ai used `border-2 border-brand` and `mt-2` without conflicting border classes, but left a long unwrapped line and a slightly wordy reply. Baseline and ponytail left `border` and `border-4` on the same element.
- **02**: all four fixed the shared `formatBRL`. Baseline won with the smallest diff and an exact reply; clean-code-ai made the same 4-line fix and flagged that the receipt email output changes too.
- **04**: all four kept auth and validation. Three replies gave wrong line counts, clean-code-ai included ("50 to 36", the result has 35).

## Limits

- One run per task and arm. LLM output varies run to run; treat this as a smoke test, not a statistically significant benchmark. A one-point gap (191 vs 190) is noise.
- The clean-code-ai runs happened one day after the others, with the same task prompts but possibly a different model snapshot.
- The judge is also an LLM. It was blind to which rules each attempt used, but it is not a human review. Re-scoring changed some old scores by 1-4 points (baseline 177 to 176, ponytail 158 to 166, pragmatic stayed at 190).
- Tasks are small, single-file-ish fixtures written by the author of these skills, so they may favor the failure modes they were designed to catch.

## Letter mapping

| Task | A | B | C | D |
|---|---|---|---|---|
| 01-featured-card | baseline | pragmatic | clean-code-ai | ponytail |
| 02-price-format | baseline | pragmatic | ponytail | clean-code-ai |
| 03-relative-dates | pragmatic | ponytail | clean-code-ai | baseline |
| 04-simplify-handler | baseline | ponytail | clean-code-ai | pragmatic |
| 05-dead-code | pragmatic | ponytail | baseline | clean-code-ai |
