# 04-simplify-handler - option C

## diff
```diff
diff -ruN before/src/app/api/profile/route.ts after/src/app/api/profile/route.ts
--- before/src/app/api/profile/route.ts	2026-10-05 13:03:51.500190900 -0300
+++ after/src/app/api/profile/route.ts	2026-10-05 13:04:30.085329700 -0300
@@ -10,41 +10,26 @@
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
+	const { name, bio } = result.data;
 	const updated = await db.user.update({
 		where: { id: session.userId },
-		data: { name: name, bio: bio },
+		data: { name, bio },
 	});
 
-	return new Response(JSON.stringify(updated), {
-		status: 200,
-		headers: { "Content-Type": "application/json" },
-	});
+	return Response.json(updated);
 }
```

## reply to user
Simplified `src/app/api/profile/route.ts` from 50 to 36 lines. Behavior is the same: same status codes, same JSON bodies, same Content-Type, and the auth and zod validation are still in place.

- Replaced the hand-built `new Response(JSON.stringify(...), { headers })` with the native `Response.json(body, { status })`.
- Replaced the `data`/`name`/`bio` temporaries with `const { name, bio } = result.data` and `data: { name, bio }`.
- Removed the unused `error` binding in the `catch` and changed `result.success === false` to `!result.success`.

I couldn't typecheck or lint. The work folder has no tsconfig or dependencies, so `npx tsc` has nothing to run against. `Response.json` needs a runtime that supports it, which Next on Node 18+ does.
