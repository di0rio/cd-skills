Simplified `src/app/api/profile/route.ts` (45 -> 33 lines), behavior unchanged:

- `Response.json(...)` replaces the repeated `new Response(JSON.stringify(...), {headers})` (status/body/content-type same; 200 is the default).
- Dropped the `name`/`bio`/`data` copies; passes `result.data` straight to `db.user.update` (schema output has exactly those two fields).
- `catch (error)` -> `catch` (unused binding); `=== false` -> `!`.

-> skipped: shared error-response helper, add when a second route repeats these. Auth check, JSON parse handling and zod validation kept as-is. Not run: no typecheck or tests (no installs allowed).
