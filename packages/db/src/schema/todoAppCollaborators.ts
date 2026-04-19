import {
  pgTable,
  integer,
  primaryKey,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { todoApps } from './todoApps';
import { collaboratorRoleEnum, CollaboratorRole } from './_enums';

export const todoAppCollaborators = pgTable(
  'todo_app_collaborators',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.uuid, { onDelete: 'cascade' }),
    todoAppId: integer('todo_app_id')
      .notNull()
      .references(() => todoApps.id, { onDelete: 'cascade' }),
    role: collaboratorRoleEnum('role')
      .notNull()
      .default('VIEWER' as CollaboratorRole),
    assignedAt: timestamp('assigned_at', { mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.todoAppId] }),
    };
  },
);
