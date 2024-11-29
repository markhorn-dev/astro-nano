import type { User, Session } from "@models/type";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { db } from "@lib/server/db";
import { sessionsTable, userTable } from "@models/schema";
import type { APIContext } from "astro";
import { eq } from "drizzle-orm";

export const generateSessionToken = (): string => {
  const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export const createSession = async (token: string, userId: number): Promise<Session> => {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};
	await db.insert(sessionsTable).values(session);
	return session;
}

export const validateSessionToken = async (token: string): Promise<SessionValidationResult> => {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const result = await db
		.select({ user: userTable, session: sessionsTable })
		.from(sessionsTable)
		.innerJoin(userTable, eq(sessionsTable.userId, userTable.id))
		.where(eq(sessionsTable.id, sessionId));
	if (result.length < 1) {
		return { session: null, user: null };
	}
	const { user, session } = result[0];
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessionsTable).where(eq(sessionsTable.id, session.id));
		return { session: null, user: null };
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await db
			.update(sessionsTable)
			.set({
				expiresAt: session.expiresAt
			})
			.where(eq(sessionsTable.id, session.id));
	}
	return { session, user };
}

export const invalidateSession = async (sessionId: string): Promise<void> => {
	await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
}

export const setSessionTokenCookie = (context: APIContext, token: string, expiresAt: Date): void => {
	context.cookies.set("session", token, {
		httpOnly: true,
		sameSite: "lax",
		secure: import.meta.env.PROD,
		expires: expiresAt,
		path: "/"
	});
}

export const deleteSessionTokenCookie = (context: APIContext): void => {
	context.cookies.set("session", "", {
		httpOnly: true,
		sameSite: "lax",
		secure: import.meta.env.PROD,
		maxAge: 0,
		path: "/"
	});
}


export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };