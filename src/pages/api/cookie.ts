import {
	validateSessionToken,
	setSessionTokenCookie,
	deleteSessionTokenCookie
} from "../../lib/server/session";

import type { APIContext } from "astro";

export async function GET(context: APIContext): Promise<Response | void> {
	const token = context.cookies.get("session")?.value ?? null;
	if (token === null) {
		return new Response(null, {
			status: 401
		});
	}

	const { session } = await validateSessionToken(token);
	if (session === null) {
		deleteSessionTokenCookie(context);
		return new Response(null, {
			status: 401
		});
	}

	setSessionTokenCookie(context, token, session.expiresAt);
}