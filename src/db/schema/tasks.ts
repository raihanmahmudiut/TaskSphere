import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  date,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { todoApps } from './todoApps';
import { taskStatusEnum, taskPriorityEnum } from './_enums';

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(), // Or uuid
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: taskStatusEnum('status').default('TODO').notNull(),
  priority: taskPriorityEnum('priority'), // Optional
  dueDate: date('due_date', { mode: 'date' }), // Optional
  todoAppId: integer('todo_app_id')
    .notNull()
    .references(() => todoApps.id, { onDelete: 'cascade' }), // If todoApp is deleted, its tasks are deleted
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  todoApp: one(todoApps, {
    fields: [tasks.todoAppId],
    references: [todoApps.id],
  }),
}));
