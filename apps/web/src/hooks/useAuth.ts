import { useMutation, useQuery } from '@tanstack/react-query';
import { login, registerUser, getProfile } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        navigate('/dashboard');
      }
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      navigate('/login');
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    retry: false, // Don't retry if token is invalid/missing
  });
};
