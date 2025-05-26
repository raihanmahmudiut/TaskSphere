import { pgTable, integer, primaryKey, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { todoApps } from './todoApps';
import { collaboratorRoleEnum } from './_enums';

export const todoAppCollaborators = pgTable(
  'todo_app_collaborators',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => users.uuid, { onDelete: 'cascade' }),
    todoAppId: integer('todo_app_id')
      .notNull()
      .references(() => todoApps.id, { onDelete: 'cascade' }),
    role: collaboratorRoleEnum('role').notNull().default('VIEWER'),
    assignedAt: timestamp('assigned_at', { mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.todoAppId] }), // Ensures a user has only one role per app
    };
  },
);

export const todoAppCollaboratorsRelations = relations(
  todoAppCollaborators,
  ({ one }) => ({
    user: one(users, {
      fields: [todoAppCollaborators.userId],
      references: [users.uuid],
    }),
    todoApp: one(todoApps, {
      fields: [todoAppCollaborators.todoAppId],
      references: [todoApps.id],
    }),
  }),
);
