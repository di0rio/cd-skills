# 04-simplify-handler - option B

## diff
```diff
diff -ruN before/src/app/api/profile/route.ts after/src/app/api/profile/route.ts
--- before/src/app/api/profile/route.ts	2026-10-04 20:09:09.283840200 -0300
+++ after/src/app/api/profile/route.ts	2026-10-04 20:10:15.301074300 -0300
@@ -9,42 +9,15 @@
 
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
-	const updated = await db.user.update({
-		where: { id: session.userId },
-		data: { name: name, bio: bio },
-	});
-
-	return new Response(JSON.stringify(updated), {
-		status: 200,
-		headers: { "Content-Type": "application/json" },
-	});
+	return Response.json(await db.user.update({ where: { id: session.userId }, data: result.data }));
 }
```

## reply to user
Rewrote `src/app/api/profile/route.ts`: 50 lines down to 24, same behavior.

- `Response.json(...)` replaces the hand-built `JSON.stringify` and Content-Type headers (status 200 is the default).
- The try/catch around `request.json()` is now `.catch(() => undefined)`.
- `result.data` goes straight to `db.user.update`, so the `data`/`name`/`bio` temp variables are gone. Zod strips unknown keys, so nothing extra reaches the DB.

I kept the auth check, JSON parse check and schema validation, since they sit at the trust boundary. I didn't run it or the type-checker.

One difference: a request body of literal `undefined` can't happen from JSON, so the parse-failure check is safe.
