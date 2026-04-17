import apiClient from './client';

export const login = async (credentials: any) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (credentials: any) => {
  const response = await apiClient.post('/auth/register', credentials);
  return response.data;
};

export const getProfile = async () => {
  const response = await apiClient.get('/auth/profile');
  return response.data;
};

export const updateProfile = async (data: {
  name?: string;
  password?: string;
}) => {
  const response = await apiClient.patch('/users/me', data);
  return response.data;
};

export const deleteAccount = async () => {
  const response = await apiClient.delete('/users/me');
  return response.data;
};
