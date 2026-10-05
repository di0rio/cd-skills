type Project = { name: string; description: string; featured?: boolean };

export function ProjectCard({ project }: { project: Project }) {
	return (
		<article
			className={`rounded-xl p-4 ${project.featured ? "border-2 border-brand" : "border border-neutral-200"}`}
		>
			<h3 className="font-medium">{project.name}</h3>
			<p className={`${project.featured ? "mt-2" : "mt-1"} text-muted text-sm`}>{project.description}</p>
		</article>
	);
}
