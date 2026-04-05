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
