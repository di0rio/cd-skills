# 01-featured-card - option C

## diff
```diff
diff -ruN before/src/components/project-card.tsx after/src/components/project-card.tsx
--- before/src/components/project-card.tsx	2026-10-04 20:09:09.273093800 -0300
+++ after/src/components/project-card.tsx	2026-10-04 20:10:14.450230200 -0300
@@ -2,9 +2,13 @@
 
 export function ProjectCard({ project }: { project: Project }) {
 	return (
-		<article className="rounded-xl border border-neutral-200 p-4">
+		<article
+			className={`rounded-xl border p-4 ${project.featured ? "border-4 border-brand" : "border-neutral-200"}`}
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
Edited `src/components/project-card.tsx`: when `project.featured` is set, the card gets `border-4 border-brand` (yellow, 4px) and the description margin goes from `mt-1` to `mt-3`. Other cards are unchanged.

Skipped: no new prop, CSS or helper, since `featured` was already on the data. Add a class-merging helper if more variants show up.
