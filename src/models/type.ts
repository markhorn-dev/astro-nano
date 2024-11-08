import type { InferSelectModel } from 'drizzle-orm';
import { gifts } from './schema.ts';

export type Gift = InferSelectModel<typeof gifts>;