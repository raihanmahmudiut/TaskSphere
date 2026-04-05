import apiClient from './client';

export const getTodoApps = async () => {
  const response = await apiClient.get('/todo');
  return response.data;
};

export const createTodoApp = async (data: { title: string; description?: string }) => {
  const response = await apiClient.post('/todo', data);
  return response.data;
};
