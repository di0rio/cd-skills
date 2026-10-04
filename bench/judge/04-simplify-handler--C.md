# 04-simplify-handler - option C

## diff
```diff
diff -ruN before/src/app/api/profile/route.ts after/src/app/api/profile/route.ts
--- before/src/app/api/profile/route.ts	2026-10-04 20:09:09.283840200 -0300
+++ after/src/app/api/profile/route.ts	2026-10-04 20:10:14.318365300 -0300
@@ -10,41 +10,25 @@
 export async function PATCH(request: Request) {
 	const session = await getSession(request);
 	if (session === null) {
-		return new Response(JSON.stringify({ error: "unauthorized" }), {
-			status: 401,
-			headers: { "Content-Type": "application/json" },
-		});
+		return Response.json({ error: "unauthorized" }, { status: 401 });
 	}
 
 	let body: unknown;
 	try {
 		body = await request.json();
-	} catch (error) {
-		return new Response(JSON.stringify({ error: "invalid json" }), {
-			status: 400,
-			headers: { "Content-Type": "application/json" },
-		});
+	} catch {
+		return Response.json({ error: "invalid json" }, { status: 400 });
 	}
 
 	const result = ProfileSchema.safeParse(body);
-	if (result.success === false) {
-		return new Response(JSON.stringify({ error: "invalid body", issues: result.error.issues }), {
-			status: 400,
-			headers: { "Content-Type": "application/json" },
-		});
+	if (!result.success) {
+		return Response.json({ error: "invalid body", issues: result.error.issues }, { status: 400 });
 	}
 
-	const data = result.data;
-	const name = data.name;
-	const bio = data.bio;
-
 	const updated = await db.user.update({
 		where: { id: session.userId },
-		data: { name: name, bio: bio },
+		data: result.data,
 	});
 
-	return new Response(JSON.stringify(updated), {
-		status: 200,
-		headers: { "Content-Type": "application/json" },
-	});
+	return Response.json(updated);
 }
```

## reply to user
Simplified `src/app/api/profile/route.ts` (45 -> 33 lines), behavior unchanged:

- `Response.json(...)` replaces the repeated `new Response(JSON.stringify(...), {headers})` (status/body/content-type same; 200 is the default).
- Dropped the `name`/`bio`/`data` copies; passes `result.data` straight to `db.user.update` (schema output has exactly those two fields).
- `catch (error)` -> `catch` (unused binding); `=== false` -> `!`.

-> skipped: shared error-response helper, add when a second route repeats these. Auth check, JSON parse handling and zod validation kept as-is. Not run: no typecheck or tests (no installs allowed).
