import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDependencies,
  createDependency,
  deleteDependency,
} from '../api/dependencies';
import { useUIStore } from '@/stores/uiStore';

export const useDependencies = (todoId: string) => {
  return useQuery({
    queryKey: ['dependencies', todoId],
    queryFn: () => getDependencies(todoId),
    enabled: !!todoId,
  });
};

export const useCreateDependency = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: createDependency,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['dependencies', variables.todoId],
      });
      addToast({ type: 'success', message: 'Dependency created.' });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message || 'Failed to create dependency.';
      addToast({ type: 'error', message: msg });
    },
  });
};

export const useDeleteDependency = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: deleteDependency,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['dependencies', variables.todoId],
      });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to delete dependency.' });
    },
  });
};
