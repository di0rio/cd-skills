# 03-relative-dates - option C

## diff
```diff
diff -ruN before/src/components/post-list.tsx after/src/components/post-list.tsx
--- before/src/components/post-list.tsx	2026-10-05 13:03:51.413153600 -0300
+++ after/src/components/post-list.tsx	2026-10-05 13:04:33.027614200 -0300
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
Done. The blog list now shows relative dates ("há 3 dias" / "3 days ago") instead of the full date. I didn't run or test it: the work folder has no scripts, tests or node_modules.

I replaced `Intl.DateTimeFormat` with `Intl.RelativeTimeFormat` in `post-list.tsx`, built from the same locale mapping (`pt-BR` / `en`). It uses `numeric: "auto"`, so you get "ontem" / "yesterday" and "hoje" / "today" for the nearest days. A small helper in the component shows days under 30, months under 365 and years beyond that, so old posts read "há 2 anos" instead of "há 700 dias".

The `<time dateTime>` attribute is unchanged, so the exact date is still in the markup.

Skipped: a hover tooltip with the full date, a title attribute, and live updating. Add them if you want them.

If the component ever becomes a client component, "now" differs between server and browser, which can cause a hydration mismatch (`suppressHydrationWarning` on `<time>`). It's fine as is, since it has no `"use client"`.
