import apiClient from './apiClient';
import { Category, Product } from '@/types';

/**
 * Fetches all categories.
 *
 * API Endpoint: [GET] https://api.escuelajs.co/api/v1/categories
 *
 * @returns Promise resolving to an array of Category objects.
 */
export const getCategories = async (): Promise<Category[]> => {
   const response = await apiClient.get<Category[]>('/categories');
   return response.data;
};

/**
 * Fetches a single category by its ID.
 *
 * API Endpoint: [GET] https://api.escuelajs.co/api/v1/categories/{id}
 *
 * @param id - The ID of the category to retrieve.
 * @returns Promise resolving to a Category object.
 */
export const getCategoryById = async (id: number): Promise<Category> => {
   const response = await apiClient.get<Category>(`/categories/${id}`);
   return response.data;
};

/**
 * Creates a new category.
 *
 * API Endpoint: [POST] https://api.escuelajs.co/api/v1/categories/
 *
 * @param categoryData - Partial Category data to create a new category.
 * @returns Promise resolving to the created Category object.
 */
export const createCategory = async (categoryData: Partial<Category>): Promise<Category> => {
   const response = await apiClient.post<Category>('/categories', categoryData);
   return response.data;
};

/**
 * Updates an existing category by its ID.
 *
 * API Endpoint: [PUT] https://api.escuelajs.co/api/v1/categories/{id}
 *
 * @param id - The ID of the category to update.
 * @param categoryData - Partial Category data with updated fields.
 * @returns Promise resolving to the updated Category object.
 */
export const updateCategory = async (id: number, categoryData: Partial<Category>): Promise<Category> => {
   const response = await apiClient.put<Category>(`/categories/${id}`, categoryData);
   return response.data;
};

/**
 * Deletes a category by its ID.
 *
 * API Endpoint: [DELETE] https://api.escuelajs.co/api/v1/categories/{id}
 *
 * @param id - The ID of the category to delete.
 * @returns Promise resolving to void.
 */
export const deleteCategory = async (id: number): Promise<void> => {
   await apiClient.delete(`/categories/${id}`);
};

/**
 * (Optional) Fetches all products within a specific category.
 *
 * API Endpoint: [GET] https://api.escuelajs.co/api/v1/categories/{categoryID}/products
 *
 * @param categoryId - The ID of the category whose products to retrieve.
 * @returns Promise resolving to an array of Product objects.
 */
export const getProductsByCategory = async (categoryId: number): Promise<Product[]> => {
   const response = await apiClient.get<Product[]>(`/categories/${categoryId}/products`);
   return response.data;
};
