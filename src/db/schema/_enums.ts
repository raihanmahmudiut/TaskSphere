import { pgEnum } from 'drizzle-orm/pg-core';

export const taskStatusEnum = pgEnum('task_status', [
  'TODO',
  'IN_PROGRESS',
  'DONE',
]);

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export const taskPriorityEnum = pgEnum('task_priority', [
  'LOW',
  'MEDIUM',
  'HIGH',
]);

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export const collaboratorRoleEnum = pgEnum('collaborator_role', [
  'VIEWER',
  'EDITOR',
]);

export type CollaboratorRole = 'VIEWER' | 'EDITOR';
