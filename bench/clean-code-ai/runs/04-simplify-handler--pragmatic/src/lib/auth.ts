export type Session = { userId: string };
export async function getSession(_req: Request): Promise<Session | null> {
	return null; // real implementation reads a signed cookie
}
