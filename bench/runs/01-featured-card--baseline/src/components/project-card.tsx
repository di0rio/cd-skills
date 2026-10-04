type Project = { name: string; description: string; featured?: boolean };

export function ProjectCard({ project }: { project: Project }) {
	return (
		<article
			className={`rounded-xl border p-4 ${project.featured ? "border-4 border-brand" : "border-neutral-200"}`}
		>
			<h3 className="font-medium">{project.name}</h3>
			<p className={`text-muted text-sm ${project.featured ? "mt-3" : "mt-1"}`}>{project.description}</p>
		</article>
	);
}
