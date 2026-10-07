Simplified `src/app/api/profile/route.ts` from 50 to 36 lines. Behavior is the same: same status codes, same JSON bodies, same Content-Type, and the auth and zod validation are still in place.

- Replaced the hand-built `new Response(JSON.stringify(...), { headers })` with the native `Response.json(body, { status })`.
- Replaced the `data`/`name`/`bio` temporaries with `const { name, bio } = result.data` and `data: { name, bio }`.
- Removed the unused `error` binding in the `catch` and changed `result.success === false` to `!result.success`.

I couldn't typecheck or lint. The work folder has no tsconfig or dependencies, so `npx tsc` has nothing to run against. `Response.json` needs a runtime that supports it, which Next on Node 18+ does.
