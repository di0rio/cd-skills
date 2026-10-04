# 01-featured-card - option A

## diff
```diff
diff -ruN before/src/components/project-card.tsx after/src/components/project-card.tsx
--- before/src/components/project-card.tsx	2026-10-04 20:09:09.273093800 -0300
+++ after/src/components/project-card.tsx	2026-10-04 20:10:10.456595800 -0300
@@ -1,10 +1,12 @@
-type Project = { name: string; description: string; featured?: boolean };
-
-export function ProjectCard({ project }: { project: Project }) {
-	return (
-		<article className="rounded-xl border border-neutral-200 p-4">
-			<h3 className="font-medium">{project.name}</h3>
-			<p className="mt-1 text-muted text-sm">{project.description}</p>
-		</article>
-	);
-}
+type Project = { name: string; description: string; featured?: boolean };
+
+export function ProjectCard({ project }: { project: Project }) {
+	return (
+		<article
+			className={`rounded-xl border p-4 ${project.featured ? "border-4 border-brand" : "border-neutral-200"}`}
+		>
+			<h3 className="font-medium">{project.name}</h3>
+			<p className={`text-muted text-sm ${project.featured ? "mt-3" : "mt-1"}`}>{project.description}</p>
+		</article>
+	);
+}
```

## reply to user
Featured card now has a 4px yellow (brand) border and more space under the title (mt-3 instead of mt-1). Other cards unchanged. Edit is in src/components/project-card.tsx, keyed off project.featured. Not run or visually checked.
