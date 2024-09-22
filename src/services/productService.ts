import apiClient from './apiClient';
import { Product } from '@/types';

export interface ProductRequests {
   data: Product[];
   total: number;
   offset: number;
   limit: number;
}

/**
 * Fetch products based on offset and limit.
 * @param options Object containing offset and limit.
 * @returns PaginatedProducts containing data and metadata.
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

   // console.log('response :>> ', response);
   return {
      data: response.data,
      total: 0, // Placeholder only
      offset: options.offset,
      limit: options.limit,
   };
};

const formatParams = (filters: { title?: string; priceRange?: { min?: number; max?: number } }) => {
   const params: Record<string, any> = {};

   // filter title if exists
   if (filters.title) {
      params['title'] = filters.title;
   }

   // filter price min if exists
   if (filters.priceRange?.min !== undefined) {
      params['price_min'] = filters.priceRange.min;
   }

   // filter price max if exists
   if (filters.priceRange?.max !== undefined) {
      params['price_max'] = filters.priceRange.max;
   }

   return params;
};

/**
 * Fetch all products to determine the total count.
 * @returns Total number of products.
 */
export const getTotalProducts = async (): Promise<number> => {
   // The API does not provide total count information in the response headers or via a dedicated endpoint.
   // As a result, I am using this approach to fetch paginated data and aggregate it to determine the total number of products.
   console.log('API Call - /products?offset=0&limit=100000');
   const response = await apiClient.get<Product[]>('/products', {
      params: {
         offset: 0,
         limit: 100000,
      },
   });
   return response.data.length;
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
