import type { InferSelectModel } from 'drizzle-orm';
import { giftsTable, sessionsTable, userTable } from './schema.ts';

export type Gift = InferSelectModel<typeof giftsTable>;
export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionsTable>;