type Post = { slug: string; title: string; date: string };

export function PostList({ posts, locale }: { posts: Post[]; locale: "pt" | "en" }) {
	const rtf = new Intl.RelativeTimeFormat(locale === "pt" ? "pt-BR" : "en", { numeric: "auto" });
	const relative = (date: string) =>
		rtf.format(-Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000), "day");
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
