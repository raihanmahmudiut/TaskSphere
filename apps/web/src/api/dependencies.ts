import apiClient from './client';

export interface TaskDependency {
  id: number;
  sourceTaskId: number;
  targetTaskId: number;
  todoAppId: number;
  createdAt: string;
}

export const getDependencies = async (
  todoId: string,
): Promise<TaskDependency[]> => {
  const response = await apiClient.get(`/todo/${todoId}/dependencies`);
  return response.data;
};

export const createDependency = async ({
  todoId,
  sourceTaskId,
  targetTaskId,
}: {
  todoId: string;
  sourceTaskId: number;
  targetTaskId: number;
}): Promise<TaskDependency> => {
  const response = await apiClient.post(`/todo/${todoId}/dependencies`, {
    sourceTaskId,
    targetTaskId,
  });
  return response.data;
};

export const deleteDependency = async ({
  todoId,
  depId,
}: {
  todoId: string;
  depId: number;
}) => {
  const response = await apiClient.delete(
    `/todo/${todoId}/dependencies/${depId}`,
  );
  return response.data;
};
