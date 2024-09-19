// src/services/categoryService.ts

import apiClient from './apiClient';
import { Category } from '@/types';

export const getCategories = async (): Promise<Category[]> => {
   const response = await apiClient.get<Category[]>('/categories');
   return response.data;
};

export const getCategoryById = async (id: number): Promise<Category> => {
   const response = await apiClient.get<Category>(`/categories/${id}`);
   return response.data;
};

export const createCategory = async (categoryData: Partial<Category>): Promise<Category> => {
   const response = await apiClient.post<Category>('/categories', categoryData);
   return response.data;
};

export const updateCategory = async (id: number, categoryData: Partial<Category>): Promise<Category> => {
   const response = await apiClient.put<Category>(`/categories/${id}`, categoryData);
   return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
   await apiClient.delete(`/categories/${id}`);
};
