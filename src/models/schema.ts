import { text, sqliteTable, integer } from 'drizzle-orm/sqlite-core';

export const gifts = sqliteTable('gifts', {
  id: integer('id').primaryKey(),
  dateAdded: text('date_added').default(new Date().toISOString()).notNull(),
  name: text('name').notNull(),
  link: text('link').notNull(),
  assignee: text('assignee').notNull().default("Unassigned"),
  bought: text('bought?').notNull().default('No'),
  notes: text('notes')
});