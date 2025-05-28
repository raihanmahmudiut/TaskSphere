export const TODO_API_ENDPOINTS = {
    CREATE: '/todo',
    GET_ALL_FOR_USER: '/todo',
    GET_BY_ID: '/todo/{id}',
    UPDATE: '/todo/{id}',
    DELETE: '/todo/{id}',
    ADD_COLLABORATOR: '/todo/{id}/collaborators',
    ASSIGN_ROLE: '/todo/{id}/collaborators/{userId}',
    REMOVE_COLLABORATOR: '/todo/{id}/collaborators/{userId}',
    CREATE_TASK: '/todo/{todoId}/tasks',
    GET_TASKS_FOR_APP: '/todo/{todoId}/tasks',
    UPDATE_TASK: '/todo/{todoId}/tasks/{taskId}',
    DELETE_TASK: '/todo/{todoId}/tasks/{taskId}',
};