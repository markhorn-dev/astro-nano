import { text, sqliteTable, integer } from 'drizzle-orm/sqlite-core';

export const giftsTable = sqliteTable('gifts', {
  id: integer('id').primaryKey(),
  dateAdded: text('date_added').default(new Date().toISOString()).notNull(),
  name: text('name').notNull(),
  link: text('link').notNull(),
  assignee: text('assignee').notNull().default("Unassigned"),
  bought: text('bought?').notNull().default('No'),
  notes: text('notes')
});

export const userTable = sqliteTable("user", {
	id: integer("id").primaryKey(),
  githubId: integer("githubId").notNull().unique(),
  username: text('username').notNull().unique()
});

export const sessionsTable = sqliteTable('sessions', {
  id: text("id").primaryKey(),
	userId: integer("user_id").notNull().references(() => userTable.id),
	expiresAt: integer("expires_at", {
		mode: "timestamp"
	}).notNull()
})