type Post = { slug: string; title: string; date: string };

export function PostList({ posts, locale }: { posts: Post[]; locale: "pt" | "en" }) {
	const rtf = new Intl.RelativeTimeFormat(locale === "pt" ? "pt-BR" : "en", { numeric: "auto" });
	const relative = (date: string) => {
		const days = Math.round((new Date(date).getTime() - Date.now()) / 86_400_000);
		if (Math.abs(days) < 30) return rtf.format(days, "day");
		if (Math.abs(days) < 365) return rtf.format(Math.round(days / 30), "month");
		return rtf.format(Math.round(days / 365), "year");
	};
	return (
		<ul>
			{posts.map((post) => (
				<li key={post.slug}>
					<a href={`/blog/${post.slug}`}>{post.title}</a>
					<time dateTime={post.date}>{relative(post.date)}</time>
				</li>
			))}
		</ul>
	);
}
