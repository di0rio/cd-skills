Done. The blog list now shows relative dates ("há 3 dias" / "3 days ago") instead of the full date. I didn't run or test it: the work folder has no scripts, tests or node_modules.

I replaced `Intl.DateTimeFormat` with `Intl.RelativeTimeFormat` in `post-list.tsx`, built from the same locale mapping (`pt-BR` / `en`). It uses `numeric: "auto"`, so you get "ontem" / "yesterday" and "hoje" / "today" for the nearest days. A small helper in the component shows days under 30, months under 365 and years beyond that, so old posts read "há 2 anos" instead of "há 700 dias".

The `<time dateTime>` attribute is unchanged, so the exact date is still in the markup.

Skipped: a hover tooltip with the full date, a title attribute, and live updating. Add them if you want them.

If the component ever becomes a client component, "now" differs between server and browser, which can cause a hydration mismatch (`suppressHydrationWarning` on `<time>`). It's fine as is, since it has no `"use client"`.
