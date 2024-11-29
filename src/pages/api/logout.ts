import { deleteSessionTokenCookie, invalidateSession } from "@lib/server/session";

import type { APIContext } from "astro";

export function POST(context: APIContext): Response {
	if (context.locals.session === null) {
		return new Response(null, { status: 401 });
	}
	invalidateSession(context.locals.session.id);
	deleteSessionTokenCookie(context);
	return new Response();
}