import { publicApiClient, protectedApiClient, standardizeApiResult } from '@/common/services/api.service';
import { API_ENDPOINTS } from '@/common/constants/api.constant';

export const fetchTodos = async () => {
    const result = await protectedApiClient({
        endpoint: API_ENDPOINTS.TODO.GET_ALL_FOR_USER,
        method: 'GET',
        signal: undefined,
    });
    return standardizeApiResult(result).data;
};

export const createTodo = async (data) => {
    const result = await protectedApiClient({
        endpoint: API_ENDPOINTS.TODO.CREATE,
        method: 'POST',
        data,
        signal: undefined,
    });
    return standardizeApiResult(result).data;
};

export const updateTodo = async (id, data) => {
    const result = await protectedApiClient({
        endpoint: API_ENDPOINTS.TODO.UPDATE.replace('{id}', id),
        method: 'PATCH',
        data,
        signal: undefined,
    });
    return standardizeApiResult(result).data;
};

export const deleteTodo = async (id) => {
    const result = await protectedApiClient({
        endpoint: API_ENDPOINTS.TODO.DELETE.replace('{id}', id),
        method: 'DELETE',
        signal: undefined,
    });
    return standardizeApiResult(result).data;
};

export const addCollaborator = async (id, data) => {
    const result = await protectedApiClient({
        endpoint: API_ENDPOINTS.TODO.ADD_COLLABORATOR.replace('{id}', id),
        method: 'POST',
        data,
        signal: undefined,
    });
    return standardizeApiResult(result).data;
};

export const assignRole = async (id, userId, data) => {
    const result = await protectedApiClient({
        endpoint: API_ENDPOINTS.TODO.ASSIGN_ROLE.replace('{id}', id).replace('{userId}', userId),
        method: 'PATCH',
        data,
        signal: undefined,
    });
    return standardizeApiResult(result).data;
};

export const removeCollaborator = async (id, userId) => {
    const result = await protectedApiClient({
        endpoint: API_ENDPOINTS.TODO.REMOVE_COLLABORATOR.replace('{id}', id).replace('{userId}', userId),
        method: 'DELETE',
        signal: undefined,
    });
    return standardizeApiResult(result).data;
};

export const createTask = async (todoId, data) => {
    const result = await protectedApiClient({
        endpoint: API_ENDPOINTS.TODO.CREATE_TASK.replace('{todoId}', todoId),
        method: 'POST',
        data,
        signal: undefined,
    });
    return standardizeApiResult(result).data;
};

export const getTasksForApp = async (todoId) => {
    const result = await protectedApiClient({
        endpoint: API_ENDPOINTS.TODO.GET_TASKS_FOR_APP.replace('{todoId}', todoId),
        method: 'GET',
        signal: undefined,
    });
    return standardizeApiResult(result).data;
};

export const updateTask = async (todoId, taskId, data) => {
    const result = await protectedApiClient({
        endpoint: API_ENDPOINTS.TODO.UPDATE_TASK.replace('{todoId}', todoId).replace('{taskId}', taskId),
        method: 'PATCH',
        data,
        signal: undefined,
    });
    return standardizeApiResult(result).data;
};

export const deleteTask = async (todoId, taskId) => {
    const result = await protectedApiClient({
        endpoint: API_ENDPOINTS.TODO.DELETE_TASK.replace('{todoId}', todoId).replace('{taskId}', taskId),
        method: 'DELETE',
        signal: undefined,
    });
    return standardizeApiResult(result).data;
};