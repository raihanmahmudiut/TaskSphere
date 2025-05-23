import * as usersSchema from './schema/users';
import * as todoAppsSchema from './schema/todoApps';
import * as tasksSchema from './schema/tasks';
import * as todoAppCollaboratorsSchema from './schema/todoAppCollaborators';
// Enums are typically not spread like this but imported directly where needed
// import * as enums from './schema/_enums';

// Combine all schemas and relations
export const schema = {
  ...usersSchema,
  ...todoAppsSchema,
  ...tasksSchema,
  ...todoAppCollaboratorsSchema,
  // ...enums, // Not strictly necessary to spread enums here
};

// You can also export individual schemas if preferred
// export * from './schema/users';
// export * from './schema/todoApps';
// etc.

export default schema;
