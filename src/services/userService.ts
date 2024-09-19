// src/services/userService.ts

import apiClient from './apiClient';
import { User } from '@/types';

export const getUsers = async (): Promise<User[]> => {
   const response = await apiClient.get<User[]>('/users');
   return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
   const response = await apiClient.get<User>(`/users/${id}`);
   return response.data;
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
   const response = await apiClient.post<User>('/users', userData);
   return response.data;
};

export const updateUser = async (
   id: number,
   userData: Partial<User>
): Promise<User> => {
   const response = await apiClient.put<User>(`/users/${id}`, userData);
   return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
   await apiClient.delete(`/users/${id}`);
};
