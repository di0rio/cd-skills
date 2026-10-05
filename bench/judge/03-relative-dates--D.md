# 03-relative-dates - option D

## diff
```diff
diff -ruN before/src/components/post-list.tsx after/src/components/post-list.tsx
--- before/src/components/post-list.tsx	2026-10-04 20:09:09.279467400 -0300
+++ after/src/components/post-list.tsx	2026-10-04 20:10:16.875547300 -0300
@@ -1,13 +1,15 @@
 type Post = { slug: string; title: string; date: string };
 
 export function PostList({ posts, locale }: { posts: Post[]; locale: "pt" | "en" }) {
-	const fmt = new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en", { dateStyle: "long" });
+	const rtf = new Intl.RelativeTimeFormat(locale === "pt" ? "pt-BR" : "en", { numeric: "auto" });
+	const relative = (date: string) =>
+		rtf.format(-Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000), "day");
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
Post dates in `src/components/post-list.tsx` now show as relative time, using the built-in `Intl.RelativeTimeFormat` and the locale the component already receives. Nothing was added to package.json and I haven't run it.

- Examples: "há 3 dias" in Portuguese, "3 days ago" in English.
- It always counts in days, so a post from months ago reads "há 90 dias" instead of switching to months.
- Because I used `numeric: "auto"`, today and yesterday come out as words: "hoje" / "ontem" and "today" / "yesterday". If you want "há 1 dia" and "1 day ago" there, change it to `numeric: "always"`.
- The `<time dateTime>` attribute still holds the full date.
