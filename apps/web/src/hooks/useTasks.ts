import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
  getActivities,
  type TaskFilters,
} from '../api/tasks';
import { useUIStore } from '@/stores/uiStore';

export const useTasks = (todoId: string, filters?: TaskFilters) => {
  return useQuery({
    queryKey: ['tasks', todoId, filters],
    queryFn: () => getTasks(todoId, filters),
    enabled: !!todoId,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: createTask,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ['tasks', variables.todoId],
      });
      const queries = queryClient.getQueriesData<any[]>({
        queryKey: ['tasks', variables.todoId],
      });
      const [queryKey, previous] = queries[0] || [null, null];
      if (queryKey && previous) {
        const optimistic = [
          ...previous,
          {
            id: -Date.now(),
            ...variables.data,
            todoAppId: variables.todoId,
            createdAt: new Date().toISOString(),
          },
        ];
        queryClient.setQueryData(queryKey, optimistic);
      }
      return { queries };
    },
    onError: (_err, _vars, context) => {
      context?.queries?.forEach(([key, data]) => {
        if (key) queryClient.setQueryData(key, data);
      });
      addToast({ type: 'error', message: 'Failed to create task.' });
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.todoId] });
    },
    onSuccess: () => {
      addToast({ type: 'success', message: 'Task created.' });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: updateTask,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ['tasks', variables.todoId],
      });
      const queries = queryClient.getQueriesData<any[]>({
        queryKey: ['tasks', variables.todoId],
      });
      const [queryKey, previous] = queries[0] || [null, null];
      if (queryKey && previous) {
        const updated = previous.map((t: any) =>
          t.id === variables.taskId ? { ...t, ...variables.data } : t,
        );
        queryClient.setQueryData(queryKey, updated);
      }
      return { queries };
    },
    onError: (_err, _vars, context) => {
      context?.queries?.forEach(([key, data]) => {
        if (key) queryClient.setQueryData(key, data);
      });
      addToast({ type: 'error', message: 'Failed to update task.' });
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.todoId] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: deleteTask,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ['tasks', variables.todoId],
      });
      const queries = queryClient.getQueriesData<any[]>({
        queryKey: ['tasks', variables.todoId],
      });
      const [queryKey, previous] = queries[0] || [null, null];
      if (queryKey && previous) {
        queryClient.setQueryData(
          queryKey,
          previous.filter((t: any) => t.id !== variables.taskId),
        );
      }
      return { queries };
    },
    onError: (_err, _vars, context) => {
      context?.queries?.forEach(([key, data]) => {
        if (key) queryClient.setQueryData(key, data);
      });
      addToast({ type: 'error', message: 'Failed to delete task.' });
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.todoId] });
    },
    onSuccess: () => {
      addToast({ type: 'info', message: 'Task deleted.' });
    },
  });
};

export const useReorderTasks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reorderTasks,
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.todoId] });
    },
  });
};

export const useActivities = (todoId: string, page = 1) => {
  return useQuery({
    queryKey: ['activities', todoId, page],
    queryFn: () => getActivities(todoId, page),
    enabled: !!todoId,
  });
};
