import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { tasks } from './tasks';
import { todoAppCollaborators } from './todoAppCollaborators';

export const todoApps = pgTable('todo_apps', {
  id: serial('id').primaryKey(), // Or uuid
  name: varchar('name', { length: 255 }).notNull(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.uuid, { onDelete: 'cascade' }), // If owner is deleted, their apps are deleted
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const todoAppsRelations = relations(todoApps, ({ one, many }) => ({
  owner: one(users, {
    fields: [todoApps.ownerId],
    references: [users.uuid],
    relationName: 'ownedApps',
  }),
  tasks: many(tasks),
  collaborators: many(todoAppCollaborators),
}));
