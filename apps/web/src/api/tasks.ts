import apiClient from './client';

export const getTasks = async (todoId: string) => {
  const response = await apiClient.get(`/todo/${todoId}/tasks`);
  return response.data;
};

export const createTask = async ({ todoId, data }: { todoId: string; data: { title: string; description?: string; status: string; priority: string } }) => {
  const response = await apiClient.post(`/todo/${todoId}/tasks`, data);
  return response.data;
};

export const updateTask = async ({ todoId, taskId, data }: { todoId: string; taskId: number; data: Partial<{ title: string; description: string; status: string; priority: string }> }) => {
  const response = await apiClient.patch(`/todo/${todoId}/tasks/${taskId}`, data);
  return response.data;
};

export const deleteTask = async ({ todoId, taskId }: { todoId: string; taskId: number }) => {
  const response = await apiClient.delete(`/todo/${todoId}/tasks/${taskId}`);
  return response.data;
};
