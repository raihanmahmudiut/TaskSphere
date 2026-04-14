import { relations } from 'drizzle-orm';
import { users } from './users';
import { todoApps } from './todoApps';
import { tasks } from './tasks';
import { todoAppCollaborators } from './todoAppCollaborators';
import { activities } from './activities';
import { taskDependencies } from './taskDependencies';

export const usersRelations = relations(users, ({ many }) => ({
  ownedTodoApps: many(todoApps, { relationName: 'ownedApps' }),
  collaborations: many(todoAppCollaborators),
  activities: many(activities),
}));

export const todoAppsRelations = relations(todoApps, ({ one, many }) => ({
  owner: one(users, {
    fields: [todoApps.ownerId],
    references: [users.uuid],
    relationName: 'ownedApps',
  }),
  tasks: many(tasks),
  collaborators: many(todoAppCollaborators),
  activities: many(activities),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  todoApp: one(todoApps, {
    fields: [tasks.todoAppId],
    references: [todoApps.id],
  }),
  dependenciesAsSource: many(taskDependencies, {
    relationName: 'sourceTask',
  }),
  dependenciesAsTarget: many(taskDependencies, {
    relationName: 'targetTask',
  }),
}));

export const taskDependenciesRelations = relations(
  taskDependencies,
  ({ one }) => ({
    sourceTask: one(tasks, {
      fields: [taskDependencies.sourceTaskId],
      references: [tasks.id],
      relationName: 'sourceTask',
    }),
    targetTask: one(tasks, {
      fields: [taskDependencies.targetTaskId],
      references: [tasks.id],
      relationName: 'targetTask',
    }),
    todoApp: one(todoApps, {
      fields: [taskDependencies.todoAppId],
      references: [todoApps.id],
    }),
  }),
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

export const activitiesRelations = relations(activities, ({ one }) => ({
  todoApp: one(todoApps, {
    fields: [activities.todoAppId],
    references: [todoApps.id],
  }),
  user: one(users, {
    fields: [activities.userId],
    references: [users.uuid],
  }),
}));
