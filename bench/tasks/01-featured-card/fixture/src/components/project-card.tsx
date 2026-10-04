type Project = { name: string; description: string; featured?: boolean };

export function ProjectCard({ project }: { project: Project }) {
	return (
		<article className="rounded-xl border border-neutral-200 p-4">
			<h3 className="font-medium">{project.name}</h3>
			<p className="mt-1 text-muted text-sm">{project.description}</p>
		</article>
	);
}
