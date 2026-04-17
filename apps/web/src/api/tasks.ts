import apiClient from './client';

export interface TaskFilters {
  status?: string;
  priority?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const getTasks = async (todoId: string, filters?: TaskFilters) => {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.priority) params.set('priority', filters.priority);
  if (filters?.search) params.set('search', filters.search);
  if (filters?.sortBy) params.set('sortBy', filters.sortBy);
  if (filters?.sortOrder) params.set('sortOrder', filters.sortOrder);
  const response = await apiClient.get(`/todo/${todoId}/tasks`, { params });
  return response.data;
};

export const createTask = async ({
  todoId,
  data,
}: {
  todoId: string;
  data: {
    title: string;
    description?: string;
    status: string;
    priority: string;
  };
}) => {
  const response = await apiClient.post(`/todo/${todoId}/tasks`, data);
  return response.data;
};

export const updateTask = async ({
  todoId,
  taskId,
  data,
}: {
  todoId: string;
  taskId: number;
  data: Partial<{
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string | null;
  }>;
}) => {
  const response = await apiClient.patch(
    `/todo/${todoId}/tasks/${taskId}`,
    data,
  );
  return response.data;
};

export const deleteTask = async ({
  todoId,
  taskId,
}: {
  todoId: string;
  taskId: number;
}) => {
  const response = await apiClient.delete(`/todo/${todoId}/tasks/${taskId}`);
  return response.data;
};

export const reorderTasks = async ({
  todoId,
  tasks,
}: {
  todoId: string;
  tasks: { id: number; position: number }[];
}) => {
  const response = await apiClient.patch(`/todo/${todoId}/tasks/reorder`, {
    tasks,
  });
  return response.data;
};

export const getActivities = async (todoId: string, page = 1, limit = 20) => {
  const response = await apiClient.get(`/todo/${todoId}/activities`, {
    params: { page, limit },
  });
  return response.data;
};
