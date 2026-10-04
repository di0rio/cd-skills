# Blind benchmark verdict

Scale 0-10 per criterion, total out of 40. Judged only from `tasks/*` (TASK.md + fixture) and `judge/*`; `runs/` was not opened to keep it blind.

## 01-featured-card

| Option | Correctness | Minimal | Safety | Communication | Total |
|---|---|---|---|---|---|
| A | 9 | 6 | 9 | 8 | **32** |
| B | 10 | 10 | 10 | 9 | **39** |
| C | 9 | 9 | 10 | 8 | **36** |

- **A**: The logic is right: `border-brand` exists as a Tailwind v4 color token (`--color-brand` in `globals.css`), and only `featured` changes. But the diff replaces the whole of `project-card.tsx`. The fixture uses LF line endings, so this is almost certainly line-ending churn. The featured branch also ends up with both `border` and `border-4`, which conflict. It works only because v4 happens to emit `border-4` later in the CSS. The reply is honest ("Not run or visually checked").
- **B (best)**: This is the cleanest version. It uses `border border-neutral-200` for normal cards and `border-4 border-brand` for the featured one, so no conflicting classes. The diff is minimal and uses existing tokens. The reply is accurate and says what was skipped and what was not run.
- **C**: Same as B, except the `border` + `border-4` overlap from A remains in `project-card.tsx` (L6). The reply is accurate but does not say the change was not run or checked visually.

## 02-price-format

| Option | Correctness | Minimal | Safety | Communication | Total |
|---|---|---|---|---|---|
| A | 10 | 9 | 10 | 9 | **38** |
| B | 10 | 10 | 10 | 9 | **39** |
| C | 10 | 9 | 10 | 9 | **38** |

- All three fix the shared `formatBRL` in `src/lib/money.ts`, so the cart, checkout and receipt email are all fixed. All three use `toLocaleString("pt-BR", {min/maxFractionDigits: 2})` and keep the literal `"R$ "` prefix. Because they avoided `style: "currency"`, there is no U+00A0 non-breaking space, and the output matches the bug report exactly. I checked: `"1.234,50"`. Negative amounts keep the earlier `R$ -x` shape, so no behavior change there.
- **A**: Correct, and adds a regression test that fits the existing `bun test` script. The function body is a long one-liner (~120 chars) that Biome/Prettier would wrap. The "bun test passes" claim is plausible (bun is installed and the output checks out) but I did not re-run it.
- **B (best, narrowly)**: Smallest diff, and the reply reports concrete ad-hoc checks (123450, 5, 1e8 cents). It skipped adding a test even though a `test` script exists, which is defensible but a slightly missed opportunity for a reported bug.
- **C**: Same fix as B plus a test with a `0` case. Equal quality to A and better formatted. Effectively tied with B; which one wins depends on whether you count the test as scope creep.

## 03-relative-dates

| Option | Correctness | Minimal | Safety | Communication | Total |
|---|---|---|---|---|---|
| A | 6 | 9 | 9 | 9 | **33** |
| B | 9 | 9 | 9 | 10 | **37** |
| C | 6 | 8 | 9 | 8 | **31** |

- **A**: Counts in days only, so old posts read "há 400 dias". That is a real UX defect for a blog list. To its credit, the reply says so openly. `-Math.floor(...)` is fine, and `numeric: "auto"` gives "hoje"/"ontem". The `<time dateTime>` attribute is kept.
- **B (best)**: Picks the unit (days < 30, then months, then years), which is the edge case this task tests. It approximates a month as 30 days, so for example 350 days gives "12 months ago" rather than "last year", and it has no week unit. Both are minor. B is the only reply to flag that `Date.now()` at render goes stale on cached or static pages. That also covers the hydration-mismatch risk if the component is ever rendered on the client.
- **C**: Same days-only defect as A. It also adds an inline TODO-style comment (`// note: days only...`) and the cryptic `864e5` literal, both small readability costs. The limitation is disclosed in the reply.
- None of the three mention a hydration mismatch explicitly. None added dependencies, which is good.

## 04-simplify-handler

| Option | Correctness | Minimal | Safety | Communication | Total |
|---|---|---|---|---|---|
| A | 10 | 9 | 10 | 8 | **37** |
| B | 10 | 8 | 10 | 8 | **36** |
| C | 10 | 10 | 10 | 7 | **37** |

- All three keep auth (401), the invalid JSON response (400), and zod validation with `issues` (400). `Response.json` sends `Content-Type: application/json` and status 200 by default, so the response contract is preserved. Passing `result.data` is type-equivalent, and zod strips unknown keys.
- **A**: `.catch(() => undefined)` with an `=== undefined` sentinel is sound, since JSON can never parse to `undefined`, and the reply explains this correctly. `!session` instead of `=== null` is fine here because `Session` is an object.
- **B**: Same as A, but it inlines `await db.user.update(...)` into the `return` (L21), which hurts readability and debuggability for 3 lines saved. "50 lines down to 24" is close: by the hunk, the result is about 23 lines. The trust-boundary note in the reply is good.
- **C (tied best for safety and conservatism)**: Keeps the `try/catch` and `=== null`, drops only the redundant copies, and uses `catch {}` with no binding. This is the least clever version and the easiest to review. The reply's "45 -> 33 lines" is wrong: the original is 50 lines and the result is about 34.

## 05-dead-code

| Option | Correctness | Minimal | Safety | Communication | Total |
|---|---|---|---|---|---|
| A | 10 | 9 | 10 | 10 | **39** |
| B | 2 | 3 | 10 | 2 | **17** |
| C | 10 | 7 | 10 | 9 | **36** |

- The ground truth comes from the fixture. `toJson` is dead: it is not in `exports.config.json`, not imported anywhere, and not re-exported from `index.ts`. `toLegacyTsv` is live, because `jobs/export.ts` looks it up by its string name from the config. `toCsv` is live through the config, and `totalAmount` is live through `index.ts`.
- **A (best)**: Removes `toJson`, keeps `toLegacyTsv`, and replaces the misleading "Old formatter from the v1 dashboard" comment with one that explains why it is still referenced. Replacing that comment goes slightly past the request, but it directly prevents the next person from making the wrong deletion. The reply is accurate and states that nothing was run.
- **B (wrong)**: Changed nothing. It says `toJson` is "used the same way or directly", which is false: no config entry or import references it. It correctly avoided the `toLegacyTsv` trap but missed the actual dead code. Doing less than needed is not minimal, and the reply makes an incorrect claim with confidence.
- **C**: Correct result (removes only `toJson`), but the diff replaces the whole file. The fixture is LF, so this is almost certainly line-ending churn, and it makes review harder. The reply is good and accurate.

## Patterns observed (letters reshuffled per task)

- **01**: All three used existing tokens and Tailwind utilities, with no new CSS and no new props. The differences come down to diff hygiene: A rewrote the whole file, and A/C leave overlapping `border`/`border-4` classes, which only B avoided.
- **02**: All three got the same correct fix at the root cause, and none fell into the NBSP trap. They differ only in whether they added a test (A and C did) and in how they formatted the code.
- **03**: This task separated the attempts most clearly. Only B handled unit selection for old dates. A and C took a simpler days-only approach and said so honestly, which counts in their favor but does not fix the defect.
- **04**: All three are behavior-preserving. B leans toward terseness (inlined await), C toward conservative minimal edits, and A sits between. Two replies gave line counts, and both were off: C's clearly so (45 vs the actual 50), B's only by about one line.
- **05**: This is the only task with an outright failure: B left the dead code in place and justified that with a false claim. C repeats the whole-file churn seen in 01-A, which suggests the same agent produced both and has a tooling or line-ending habit.
- **Across all tasks**: The replies were generally honest about not running builds. The real failures were the inaccurate claims: 05-B on usage, and the line counts in 04-B and 04-C.
