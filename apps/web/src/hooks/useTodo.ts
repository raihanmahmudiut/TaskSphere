import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodoApps, createTodoApp } from '../api/todo';
import { useUIStore } from '@/stores/uiStore';

export const useTodoApps = () => {
  return useQuery({
    queryKey: ['todoApps'],
    queryFn: getTodoApps,
  });
};

export const useCreateTodoApp = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: createTodoApp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todoApps'] });
      addToast({ type: 'success', message: 'App created!' });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to create app.' });
    },
  });
};
