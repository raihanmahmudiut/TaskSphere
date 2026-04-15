import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  date,
  varchar,
} from 'drizzle-orm/pg-core';
import { todoApps } from './todoApps';
import { taskStatusEnum, taskPriorityEnum } from './_enums';

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: taskStatusEnum('status').default('TODO').notNull(),
  priority: taskPriorityEnum('priority'),
  dueDate: date('due_date', { mode: 'date' }),
  position: integer('position').default(0).notNull(),
  todoAppId: integer('todo_app_id')
    .notNull()
    .references(() => todoApps.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull(),
});
