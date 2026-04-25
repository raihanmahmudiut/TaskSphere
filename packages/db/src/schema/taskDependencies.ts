import {
  pgTable,
  serial,
  integer,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { tasks } from './tasks';
import { todoApps } from './todoApps';

export const taskDependencies = pgTable(
  'task_dependencies',
  {
    id: serial('id').primaryKey(),
    sourceTaskId: integer('source_task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    targetTaskId: integer('target_task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    todoAppId: integer('todo_app_id')
      .notNull()
      .references(() => todoApps.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [unique().on(t.sourceTaskId, t.targetTaskId)],
);
