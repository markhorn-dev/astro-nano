import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../models/schema.ts';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

const isProduction = process.env.NODE_ENV === 'production';
const dbPath = isProduction ? '/data/db.sqlite3' : './db.sqlite3';

const sqlite = new Database(dbPath);

export const db = drizzle(sqlite, { schema });

migrate(db, { migrationsFolder: './drizzle' });