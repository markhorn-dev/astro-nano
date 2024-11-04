import type { InferSelectModel } from 'drizzle-orm';
import { gifts } from './schema.ts';

export type Comment = InferSelectModel<typeof gifts>;