Post dates in `src/components/post-list.tsx` now show as relative time, using the built-in `Intl.RelativeTimeFormat` and the locale the component already receives. Nothing was added to package.json and I haven't run it.

- Examples: "há 3 dias" in Portuguese, "3 days ago" in English.
- It always counts in days, so a post from months ago reads "há 90 dias" instead of switching to months.
- Because I used `numeric: "auto"`, today and yesterday come out as words: "hoje" / "ontem" and "today" / "yesterday". If you want "há 1 dia" and "1 day ago" there, change it to `numeric: "always"`.
- The `<time dateTime>` attribute still holds the full date.
