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
		return Response.json({ error: "unauthorized" }, { status: 401 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return Response.json({ error: "invalid json" }, { status: 400 });
	}

	const result = ProfileSchema.safeParse(body);
	if (!result.success) {
		return Response.json({ error: "invalid body", issues: result.error.issues }, { status: 400 });
	}

	const updated = await db.user.update({
		where: { id: session.userId },
		data: result.data,
	});

	return Response.json(updated);
}
