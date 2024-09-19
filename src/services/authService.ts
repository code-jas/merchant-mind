import apiClient from './apiClient';
import { LoginCredentials, LoginResponse, User } from '@/types';

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
   const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
   return response.data;
};

export const getProfile = async (): Promise<User> => {
   const response = await apiClient.get<User>('/auth/profile');
   return response.data;
};
