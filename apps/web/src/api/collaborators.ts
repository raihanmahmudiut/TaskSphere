import apiClient from './client';

export const getTodoApp = async (todoId: string) => {
  const response = await apiClient.get(`/todo/${todoId}`);
  return response.data;
};

export const searchUserByEmail = async (email: string) => {
  const response = await apiClient.get(`/users/search`, { params: { email } });
  return response.data;
};

export const addCollaborator = async ({
  todoId,
  userId,
  role,
}: {
  todoId: string;
  userId: string;
  role: 'VIEWER' | 'EDITOR';
}) => {
  const response = await apiClient.post(`/todo/${todoId}/collaborators`, {
    userId,
    role,
  });
  return response.data;
};

export const updateCollaboratorRole = async ({
  todoId,
  userId,
  role,
}: {
  todoId: string;
  userId: string;
  role: 'VIEWER' | 'EDITOR';
}) => {
  const response = await apiClient.patch(
    `/todo/${todoId}/collaborators/${userId}`,
    { role },
  );
  return response.data;
};

export const removeCollaborator = async ({
  todoId,
  userId,
}: {
  todoId: string;
  userId: string;
}) => {
  const response = await apiClient.delete(
    `/todo/${todoId}/collaborators/${userId}`,
  );
  return response.data;
};
