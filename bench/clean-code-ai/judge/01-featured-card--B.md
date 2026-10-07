# 01-featured-card - option B

## diff
```diff
diff -ruN before/src/components/project-card.tsx after/src/components/project-card.tsx
--- before/src/components/project-card.tsx	2026-10-04 20:09:09.273093800 -0300
+++ after/src/components/project-card.tsx	2026-10-04 20:10:14.855088500 -0300
@@ -2,9 +2,13 @@
 
 export function ProjectCard({ project }: { project: Project }) {
 	return (
-		<article className="rounded-xl border border-neutral-200 p-4">
+		<article
+			className={`rounded-xl p-4 ${project.featured ? "border-4 border-brand" : "border border-neutral-200"}`}
+		>
 			<h3 className="font-medium">{project.name}</h3>
-			<p className="mt-1 text-muted text-sm">{project.description}</p>
+			<p className={`text-muted text-sm ${project.featured ? "mt-3" : "mt-1"}`}>
+				{project.description}
+			</p>
 		</article>
 	);
 }
```

## reply to user
Featured card (`featured: true`, i.e. cd/ui) now has a 4px `border-brand` border and `mt-3` between title and description (was `mt-1`). Other cards are unchanged.

Edited only `src/components/project-card.tsx`, using the existing `featured` flag and the existing `brand` token -> skipped: new CSS/variant prop/helper, add when a second variant appears. Not run: no typecheck/build (no installs allowed).
