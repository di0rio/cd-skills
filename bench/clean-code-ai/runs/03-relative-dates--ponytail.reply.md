Swapped `Intl.DateTimeFormat` for `Intl.RelativeTimeFormat` in `src/components/post-list.tsx`. It gives "há 3 dias" in pt and "3 days ago" in en. With `numeric: "auto"`, today and yesterday read "hoje"/"ontem" and "today"/"yesterday". No dependency added, and the `<time dateTime>` attribute still carries the full date.

Skipped: weeks, months and years. Old posts show "há 400 dias". Add unit steps if that reads badly. I did not run it.
