import {
  pgTable,
  text,
  varchar,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { todoApps } from './todoApps';
import { todoAppCollaborators } from './todoAppCollaborators';

export const users = pgTable(
  'users',
  {
    uuid: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull().unique(),
    hashedPassword: text('hashed_password').notNull(),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      emailIdx: uniqueIndex('email_idx').on(table.email),
    };
  },
);

export const usersRelations = relations(users, ({ many }) => ({
  ownedTodoApps: many(todoApps, { relationName: 'ownedApps' }), // Apps this user owns
  collaborations: many(todoAppCollaborators), // Apps this user is a collaborator on
}));
