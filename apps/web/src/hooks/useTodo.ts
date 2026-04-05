import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodoApps, createTodoApp } from '../api/todo';

export const useTodoApps = () => {
  return useQuery({
    queryKey: ['todoApps'],
    queryFn: getTodoApps,
  });
};

export const useCreateTodoApp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTodoApp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todoApps'] });
    },
  });
};
