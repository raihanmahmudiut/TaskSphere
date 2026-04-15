import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { todoApps } from './todoApps';
import { users } from './users';

export const activities = pgTable('activities', {
  id: serial('id').primaryKey(),
  todoAppId: integer('todo_app_id')
    .notNull()
    .references(() => todoApps.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.uuid, { onDelete: 'cascade' }),
  action: varchar('action', { length: 50 }).notNull(),
  entityType: varchar('entity_type', { length: 50 }),
  entityId: varchar('entity_id', { length: 255 }),
  metadata: text('metadata'),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull(),
});
