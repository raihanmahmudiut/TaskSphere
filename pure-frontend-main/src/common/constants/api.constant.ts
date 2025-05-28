export const API_ENDPOINTS = {
    // Root endpoints
    ROOT: {
        HELLO: '/',
        USER: '/user',
    },
    
    // Authentication endpoints
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        PROFILE: '/auth/profile',
    },
    
    // User endpoints
    USERS: {
        ME: '/users/me',
    },
    
    // Todo app management endpoints
    TODO: {
        // Todo app CRUD
        CREATE: '/todo',
        GET_ALL_FOR_USER: '/todo',
        GET_BY_ID: '/todo/{id}',
        UPDATE: '/todo/{id}',
        DELETE: '/todo/{id}',
        
        // Collaborator management
        ADD_COLLABORATOR: '/todo/{id}/collaborators',
        ASSIGN_ROLE: '/todo/{id}/collaborators/{userId}',
        REMOVE_COLLABORATOR: '/todo/{id}/collaborators/{userId}',
        
        // Task management
        CREATE_TASK: '/todo/{todoId}/tasks',
        GET_TASKS_FOR_APP: '/todo/{todoId}/tasks',
        UPDATE_TASK: '/todo/{todoId}/tasks/{taskId}',
        DELETE_TASK: '/todo/{todoId}/tasks/{taskId}',
    },
};

export const REQUEST_METHOD = {
    POST: 'POST',
    GET: 'GET',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
    PUT: 'PUT',
} as const;