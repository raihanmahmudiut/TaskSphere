import * as usersSchema from './schema/users';
import * as todoAppsSchema from './schema/todoApps';
import * as tasksSchema from './schema/tasks';
import * as todoAppCollaboratorsSchema from './schema/todoAppCollaborators';
import * as enumsSchema from './schema/_enums';

export const users = usersSchema.users;
export const tasks = tasksSchema.tasks;
export const todoApps = todoAppsSchema.todoApps;
export const todoAppCollaborators =
  todoAppCollaboratorsSchema.todoAppCollaborators;

export const taskStatusEnum = enumsSchema.taskStatusEnum;
export const taskPriorityEnum = enumsSchema.taskPriorityEnum;
export const collaboratorRoleEnum = enumsSchema.collaboratorRoleEnum;

export const schema = {
  ...usersSchema,
  ...todoAppsSchema,
  ...tasksSchema,
  ...todoAppCollaboratorsSchema,
  ...enumsSchema,
};

export default schema;
