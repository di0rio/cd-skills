# 03-relative-dates - option B

## diff
```diff
diff -ruN before/src/components/post-list.tsx after/src/components/post-list.tsx
--- before/src/components/post-list.tsx	2026-10-04 20:09:09.279467400 -0300
+++ after/src/components/post-list.tsx	2026-10-04 20:10:17.491615500 -0300
@@ -1,13 +1,19 @@
 type Post = { slug: string; title: string; date: string };
 
 export function PostList({ posts, locale }: { posts: Post[]; locale: "pt" | "en" }) {
-	const fmt = new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en", { dateStyle: "long" });
+	const rtf = new Intl.RelativeTimeFormat(locale === "pt" ? "pt-BR" : "en", { numeric: "auto" });
+	const relative = (date: string) => {
+		const days = Math.round((new Date(date).getTime() - Date.now()) / 86_400_000);
+		if (Math.abs(days) < 30) return rtf.format(days, "day");
+		if (Math.abs(days) < 365) return rtf.format(Math.round(days / 30), "month");
+		return rtf.format(Math.round(days / 365), "year");
+	};
 	return (
 		<ul>
 			{posts.map((post) => (
 				<li key={post.slug}>
 					<a href={`/blog/${post.slug}`}>{post.title}</a>
-					<time dateTime={post.date}>{fmt.format(new Date(post.date))}</time>
+					<time dateTime={post.date}>{relative(post.date)}</time>
 				</li>
 			))}
 		</ul>
```

## reply to user
Blog list now shows relative time ("há 3 dias" / "3 days ago") via built-in `Intl.RelativeTimeFormat`, using the existing `locale` prop. Change is in `src/components/post-list.tsx`.

- It uses days under 30 days, then months, then years, so old posts don't read "há 700 dias". `numeric: "auto"` gives "ontem"/"yesterday" and "hoje"/"today".
- The `<time dateTime>` attribute is unchanged, so the full date is still available to machines.
- Skipped: a tooltip with the full date, a dependency, and a shared helper. Add the tooltip if readers need the exact date, and extract the helper when a second component needs relative dates.
- Not run: no typecheck or build, since the project has no scripts or installed dependencies. Relative time is computed at render time, so a statically cached page will go stale. Re-render or revalidate periodically if that matters.
