Rewrote `src/app/api/profile/route.ts`: 50 lines down to 24, same behavior.

- `Response.json(...)` replaces the hand-built `JSON.stringify` and Content-Type headers (status 200 is the default).
- The try/catch around `request.json()` is now `.catch(() => undefined)`.
- `result.data` goes straight to `db.user.update`, so the `data`/`name`/`bio` temp variables are gone. Zod strips unknown keys, so nothing extra reaches the DB.

I kept the auth check, JSON parse check and schema validation, since they sit at the trust boundary. I didn't run it or the type-checker.

One difference: a request body of literal `undefined` can't happen from JSON, so the parse-failure check is safe.
