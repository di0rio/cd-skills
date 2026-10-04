Blog list now shows relative time ("há 3 dias" / "3 days ago") via built-in `Intl.RelativeTimeFormat`, using the existing `locale` prop. Change is in `src/components/post-list.tsx`.

- It uses days under 30 days, then months, then years, so old posts don't read "há 700 dias". `numeric: "auto"` gives "ontem"/"yesterday" and "hoje"/"today".
- The `<time dateTime>` attribute is unchanged, so the full date is still available to machines.
- Skipped: a tooltip with the full date, a dependency, and a shared helper. Add the tooltip if readers need the exact date, and extract the helper when a second component needs relative dates.
- Not run: no typecheck or build, since the project has no scripts or installed dependencies. Relative time is computed at render time, so a statically cached page will go stale. Re-render or revalidate periodically if that matters.
