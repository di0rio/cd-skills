# 04-simplify-handler - option A

## diff
```diff
diff -ruN before/src/app/api/profile/route.ts after/src/app/api/profile/route.ts
--- before/src/app/api/profile/route.ts	2026-10-04 20:09:09.283840200 -0300
+++ after/src/app/api/profile/route.ts	2026-10-04 20:10:13.903967000 -0300
@@ -9,42 +9,20 @@
 
 export async function PATCH(request: Request) {
 	const session = await getSession(request);
-	if (session === null) {
-		return new Response(JSON.stringify({ error: "unauthorized" }), {
-			status: 401,
-			headers: { "Content-Type": "application/json" },
-		});
-	}
+	if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });
 
-	let body: unknown;
-	try {
-		body = await request.json();
-	} catch (error) {
-		return new Response(JSON.stringify({ error: "invalid json" }), {
-			status: 400,
-			headers: { "Content-Type": "application/json" },
-		});
-	}
+	const body = await request.json().catch(() => undefined);
+	if (body === undefined) return Response.json({ error: "invalid json" }, { status: 400 });
 
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
Simplified `src/app/api/profile/route.ts`. Behavior is the same: same status codes, error bodies and DB update.

- Replaced every `new Response(JSON.stringify(...), { headers })` with `Response.json(...)`.
- Replaced the try/catch around `request.json()` with `.catch(() => undefined)`.
- Passed `result.data` straight to `db.user.update` instead of copying it into `data`, `name` and `bio` variables first.
- Used early-return one-liners for the guards.

I did not run or type-check it. One edge case: a request body of literal `undefined` can't happen, because JSON can't encode it. A body of `null` still reaches the schema and fails validation as before.
