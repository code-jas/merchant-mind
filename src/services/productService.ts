import apiClient from './apiClient';
import { Product } from '@/types';

export interface ProductRequests {
   data: Product[];
   total: number;
   offset: number;
   limit: number;
}

/**
 * Formats the query parameters based on provided filters.
 *
 * @param filters - Object containing optional title and price range filters.
 * @returns An object with formatted query parameters.
 */
const formatParams = (filters: {
   title?: string;
   priceRange?: { min?: number; max?: number };
}): Record<string, any> => {
   const params: Record<string, any> = {};

   // Filter by title if provided
   if (filters.title) {
      params['title'] = filters.title;
   }

   // Filter by minimum price if provided
   if (filters.priceRange?.min !== undefined) {
      params['price_min'] = filters.priceRange.min;
   }

   // Filter by maximum price if provided
   if (filters.priceRange?.max !== undefined) {
      params['price_max'] = filters.priceRange.max;
   }

   return params;
};

/**
 * Fetches products based on provided offset, limit, and optional filters.
 *
 * API Endpoint: [GET] https://api.escuelajs.co/api/v1/products
 *
 * @param options - Object containing offset, limit, and optional filters (title, priceRange).
 * @returns A promise that resolves to a `ProductRequests` object containing the fetched products and pagination metadata.
 */
export const getProducts = async (options: Record<string, any>): Promise<ProductRequests> => {
   const formattedFilters = formatParams({
      title: options.title,
      priceRange: options.priceRange,
   });

   const params = {
      offset: options.offset,
      limit: options.limit,
      ...formattedFilters, // Spread the formatted filters into the params object
   };

   console.log(`API Call - /products with params:`, params);

   const response = await apiClient.get<Product[]>('/products', {
      params: params,
   });

   // Placeholder for total count as the API does not provide it directly
   return {
      data: response.data,
      total: 0,
      offset: options.offset,
      limit: options.limit,
   };
};

/**
 * Fetches the total number of products available.
 *
 * API Endpoint: [GET] https://api.escuelajs.co/api/v1/products?offset=0&limit=100000
 *
 * Note: The API does not provide total count information in the response headers or via a dedicated endpoint.
 * Therefore, this function fetches a large number of products to determine the total count.
 *
 * @returns A promise that resolves to the total number of products.
 */
export const getTotalProducts = async (): Promise<number> => {
   console.log('API Call - /products?offset=0&limit=100000');
   const response = await apiClient.get<Product[]>('/products', {
      params: {
         offset: 0,
         limit: 100000,
      },
   });
   return response.data.length;
};

/**
 * Fetches a single product by its ID.
 *
 * API Endpoint: [GET] https://api.escuelajs.co/api/v1/products/{id}
 *
 * @param id - The ID of the product to retrieve.
 * @returns A promise that resolves to the requested `Product` object.
 */
export const getProductById = async (id: number): Promise<Product> => {
   const response = await apiClient.get<Product>(`/products/${id}`);
   return response.data;
};

/**
 * Creates a new product.
 *
 * API Endpoint: [POST] https://api.escuelajs.co/api/v1/products/
 *
 * @param productData - Partial `Product` data required to create a new product.
 * @returns A promise that resolves to the created `Product` object.
 */
export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
   const response = await apiClient.post<Product>('/products', productData);
   return response.data;
};

/**
 * Updates an existing product by its ID.
 *
 * API Endpoint: [PUT] https://api.escuelajs.co/api/v1/products/{id}
 *
 * @param id - The ID of the product to update.
 * @param productData - Partial `Product` data containing the fields to be updated.
 * @returns A promise that resolves to the updated `Product` object.
 */
export const updateProduct = async (id: number, productData: Partial<Product>): Promise<Product> => {
   const response = await apiClient.put<Product>(`/products/${id}`, productData);
   return response.data;
};

/**
 * Deletes a product by its ID.
 *
 * API Endpoint: [DELETE] https://api.escuelajs.co/api/v1/products/{id}
 *
 * @param id - The ID of the product to delete.
 * @returns A promise that resolves to void upon successful deletion.
 */
export const deleteProduct = async (id: number): Promise<void> => {
   await apiClient.delete(`/products/${id}`);
};
