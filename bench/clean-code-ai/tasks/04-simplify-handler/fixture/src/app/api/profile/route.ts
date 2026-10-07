import { z } from "zod";
import { getSession } from "../../../lib/auth";
import { db } from "../../../lib/db";

const ProfileSchema = z.object({
	name: z.string().trim().min(1).max(80),
	bio: z.string().trim().max(500).nullable(),
});

export async function PATCH(request: Request) {
	const session = await getSession(request);
	if (session === null) {
		return new Response(JSON.stringify({ error: "unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch (error) {
		return new Response(JSON.stringify({ error: "invalid json" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	const result = ProfileSchema.safeParse(body);
	if (result.success === false) {
		return new Response(JSON.stringify({ error: "invalid body", issues: result.error.issues }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	const data = result.data;
	const name = data.name;
	const bio = data.bio;

	const updated = await db.user.update({
		where: { id: session.userId },
		data: { name: name, bio: bio },
	});

	return new Response(JSON.stringify(updated), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}
