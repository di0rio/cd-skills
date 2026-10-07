type Post = { slug: string; title: string; date: string };

export function PostList({ posts, locale }: { posts: Post[]; locale: "pt" | "en" }) {
	const fmt = new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en", { dateStyle: "long" });
	return (
		<ul>
			{posts.map((post) => (
				<li key={post.slug}>
					<a href={`/blog/${post.slug}`}>{post.title}</a>
					<time dateTime={post.date}>{fmt.format(new Date(post.date))}</time>
				</li>
			))}
		</ul>
	);
}
