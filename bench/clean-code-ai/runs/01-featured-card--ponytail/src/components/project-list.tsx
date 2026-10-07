import { ProjectCard } from "./project-card";

const projects = [
	{ name: "cd/ui", description: "Small React components.", featured: true },
	{ name: "converter-hub", description: "Convert files in the browser." },
	{ name: "sentinel-forge", description: "Detection rules in Go." },
];

export function ProjectList() {
	return (
		<div className="grid gap-4">
			{projects.map((project) => (
				<ProjectCard key={project.name} project={project} />
			))}
		</div>
	);
}
