import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTodoApp,
  addCollaborator,
  updateCollaboratorRole,
  removeCollaborator,
} from '../api/collaborators';
import { useUIStore } from '@/stores/uiStore';

export const useTodoApp = (todoId: string) => {
  return useQuery({
    queryKey: ['todoApp', todoId],
    queryFn: () => getTodoApp(todoId),
    enabled: !!todoId,
  });
};

export const useAddCollaborator = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  return useMutation({
    mutationFn: addCollaborator,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['todoApp', variables.todoId],
      });
      addToast({ type: 'success', message: 'Collaborator added.' });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to add collaborator.' });
    },
  });
};

export const useUpdateCollaboratorRole = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  return useMutation({
    mutationFn: updateCollaboratorRole,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['todoApp', variables.todoId],
      });
      addToast({ type: 'success', message: 'Role updated.' });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to update role.' });
    },
  });
};

export const useRemoveCollaborator = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  return useMutation({
    mutationFn: removeCollaborator,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['todoApp', variables.todoId],
      });
      addToast({ type: 'info', message: 'Collaborator removed.' });
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to remove collaborator.' });
    },
  });
};
