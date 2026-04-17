import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login, registerUser, getProfile } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';

export const useLogin = () => {
  const navigate = useNavigate();
  const authLogin = useAuthStore((s) => s.login);
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.accessToken) {
        authLogin(data.accessToken, data.user);
        addToast({ type: 'success', message: 'Welcome back!' });
        navigate('/dashboard');
      }
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      addToast({
        type: 'success',
        message: 'Account created! Please sign in.',
      });
      navigate('/login');
    },
  });
};

export const useProfile = () => {
  const setUser = useAuthStore((s) => s.setUser);
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const data = await getProfile();
      setUser(data);
      return data;
    },
    retry: false,
  });
};

export const useLogout = () => {
  const logout = useAuthStore((s) => s.logout);
  const addToast = useUIStore((s) => s.addToast);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
    addToast({ type: 'info', message: 'You have been logged out.' });
    navigate('/login');
  };
};
