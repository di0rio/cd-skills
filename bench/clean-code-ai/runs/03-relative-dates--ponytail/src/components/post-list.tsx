type Post = { slug: string; title: string; date: string };

export function PostList({ posts, locale }: { posts: Post[]; locale: "pt" | "en" }) {
	const rtf = new Intl.RelativeTimeFormat(locale === "pt" ? "pt-BR" : "en", { numeric: "auto" });
	// ponytail: days only ("400 days ago"), add week/month/year units if that reads badly
	const ago = (date: string) => rtf.format(Math.round((Date.parse(date) - Date.now()) / 864e5), "day");
	return (
		<ul>
			{posts.map((post) => (
				<li key={post.slug}>
					<a href={`/blog/${post.slug}`}>{post.title}</a>
					<time dateTime={post.date}>{ago(post.date)}</time>
				</li>
			))}
		</ul>
	);
}
