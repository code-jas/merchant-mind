import apiClient from './apiClient';
import { Product } from '@/types';

export const getProducts = async (): Promise<Product[]> => {
   const response = await apiClient.get<Product[]>('/products');
   return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
   const response = await apiClient.get<Product>(`/products/${id}`);
   return response.data;
};

export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
   const response = await apiClient.post<Product>('/products', productData);
   return response.data;
};

export const updateProduct = async (id: number, productData: Partial<Product>): Promise<Product> => {
   const response = await apiClient.put<Product>(`/products/${id}`, productData);
   return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
   await apiClient.delete(`/products/${id}`);
};
