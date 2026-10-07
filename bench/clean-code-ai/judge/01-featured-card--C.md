# 01-featured-card - option C

## diff
```diff
diff -ruN before/src/components/project-card.tsx after/src/components/project-card.tsx
--- before/src/components/project-card.tsx	2026-10-05 13:03:51.165135100 -0300
+++ after/src/components/project-card.tsx	2026-10-05 13:04:37.264409700 -0300
@@ -2,9 +2,11 @@
 
 export function ProjectCard({ project }: { project: Project }) {
 	return (
-		<article className="rounded-xl border border-neutral-200 p-4">
+		<article
+			className={`rounded-xl p-4 ${project.featured ? "border-2 border-brand" : "border border-neutral-200"}`}
+		>
 			<h3 className="font-medium">{project.name}</h3>
-			<p className="mt-1 text-muted text-sm">{project.description}</p>
+			<p className={`${project.featured ? "mt-2" : "mt-1"} text-muted text-sm`}>{project.description}</p>
 		</article>
 	);
 }
```

## reply to user
Done. In `src/components/project-card.tsx` the featured card (`project.featured`) now gets `border-2 border-brand` (yellow, from the existing `--color-brand` token) instead of the 1px neutral border. Its description margin is `mt-2` instead of `mt-1`. Non-featured cards keep their exact classes, so only `cd/ui` changes. The edit is two className lines, no new files or CSS, and LF and tab indentation are preserved. I did not run lint, typecheck or the app. The only check was `cat -A` on the file to confirm the line endings and tabs.
