Simplified `src/app/api/profile/route.ts`. Behavior is the same: same status codes, error bodies and DB update.

- Replaced every `new Response(JSON.stringify(...), { headers })` with `Response.json(...)`.
- Replaced the try/catch around `request.json()` with `.catch(() => undefined)`.
- Passed `result.data` straight to `db.user.update` instead of copying it into `data`, `name` and `bio` variables first.
- Used early-return one-liners for the guards.

I did not run or type-check it. One edge case: a request body of literal `undefined` can't happen, because JSON can't encode it. A body of `null` still reaches the schema and fails validation as before.
