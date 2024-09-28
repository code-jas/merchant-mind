import { defineStore } from 'pinia';
import {
   getProducts,
   getProductById,
   createProduct,
   updateProduct,
   deleteProduct,
   ProductRequests,
   getTotalProducts,
} from '@/services/productService';

import { getCategories } from '@/services/categoryService';
import { getUsers } from '@/services/userService';
import { Category, DashboardSummary, Filters, Product } from '@/types';

export const useProductStore = defineStore('product', {
   state: () => ({
      products: [] as Product[],
      categories: [] as Category[],
      isLoading: false,
      error: null as string | null,
      offset: 0,
      limit: 10,
      totalItems: 0,
      filters: {} as Filters,
   }),

   getters: {
      currentPage(state): number {
         return Math.floor(state.offset / state.limit) + 1;
      },
      totalPages(state): number {
         return Math.ceil(state.totalItems / state.limit);
      },
   },

   actions: {
      async initialize() {
         await Promise.all([this.fetchProducts(), this.fetchTotalItems()]);
      },

      async fetchProducts() {
         this.isLoading = true;
         this.error = null;
         try {
            const params = {
               offset: this.offset,
               limit: this.limit,
               ...this.filters,
            };
            const dataResponse: ProductRequests = await getProducts(params);

            this.products = dataResponse.data;
         } catch (err: any) {
            this.error = err.message || 'Failed to fetch products';
         } finally {
            this.isLoading = false;
         }
      },

      async fetchTotalItems() {
         try {
            // The API lacks total count info in headers or dedicated endpoints,
            // so I'm aggregating paginated data to determine the total number of products.
            const total = await getTotalProducts();
            this.totalItems = total;
         } catch (err: any) {
            this.error = err.message || 'Failed to fetch total items';
         }
      },

      async fetchCategories() {
         this.isLoading = true;
         this.error = null;
         try {
            const response = await getCategories();
            this.categories = response;
         } catch (err: any) {
            this.error = err.message || 'Failed to fetch categories';
         } finally {
            this.isLoading = false;
         }
      },

      async fetchProduct(id: number) {
         this.isLoading = true;
         this.error = null;
         try {
            const product = await getProductById(id);
            const index = this.products.findIndex((p) => p.id === id);
            if (index !== -1) {
               this.products[index] = product;
            } else {
               this.products.push(product);
            }
         } catch (err: any) {
            this.error = err.message || 'Failed to fetch product';
         } finally {
            this.isLoading = false;
         }
      },

      async createProduct(productData: Partial<Product>) {
         this.isLoading = true;
         this.error = null;
         try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { category, ...payload } = productData;
            const newProduct = await createProduct(payload);
            this.products.unshift(newProduct); // Add to the beginning
            this.totalItems += 1;
         } catch (err: any) {
            this.error = err.message || 'Failed to create product';
            throw err; // Re-throw to handle in the component
         } finally {
            this.isLoading = false;
         }
      },

      async updateProduct(id: number, productData: Partial<Product>) {
         this.isLoading = true;
         this.error = null;
         try {
            const updatedProduct = await updateProduct(id, productData);
            console.log('updateProduct :>> ', updateProduct);
            const index = this.products.findIndex((p) => p.id === id);
            if (index !== -1) {
               this.products[index] = updatedProduct;
            }
         } catch (err: any) {
            this.error = err.message || 'Failed to update product';
         } finally {
            this.isLoading = false;
         }
      },

      async deleteProduct(id: number) {
         this.isLoading = true;
         this.error = null;
         try {
            await deleteProduct(id);
            this.products = this.products.filter((p) => p.id !== id);
            this.totalItems -= 1;
         } catch (err: any) {
            this.error = err.message || 'Failed to delete product';
         } finally {
            this.isLoading = false;
         }
      },

      async getSummary(): Promise<DashboardSummary | null> {
         this.isLoading = true;
         this.error = null;
         try {
            // Fetch products, categories, and users concurrently
            const [productsResponse, categoriesResponse, usersResponse] = await Promise.all([
               getProducts({ offset: this.offset, limit: 99999, ...this.filters }),
               getCategories(),
               getUsers(),
            ]);

            // console.log('productsResponse :>> ', productsResponse);
            // console.log('categoriesResponse :>> ', categoriesResponse);
            // console.log('usersResponse :>> ', usersResponse);

            // Calculate total products, categories, and users
            const totalProducts = productsResponse.data.length;
            const totalCategories = categoriesResponse.length;
            const totalUsers = usersResponse.length;
            this.products = productsResponse.data;

            // Calculate total potential revenue by summing up all product prices
            const potentialRevenue = productsResponse.data.reduce((acc, product) => {
               // Ensure that product.price exists and is a number
               return acc + (typeof product.price === 'number' ? product.price : 0);
            }, 0);

            // Return the summary object
            const summary: DashboardSummary = {
               potentialRevenue,
               products: totalProducts,
               categories: totalCategories,
               users: totalUsers,
            };

            return summary;
         } catch (err: any) {
            console.error('Error fetching summary data:', err);
            this.error = err.message || 'Failed to fetch summary data';
            return null;
         } finally {
            this.isLoading = false;
         }
      },

      setOffset(newOffset: number) {
         this.offset = newOffset;
         this.fetchProducts();
      },

      setLimit(newLimit: number) {
         this.limit = newLimit;
         this.offset = 0;
         this.fetchProducts();
      },

      setFilters(newFilters: Filters) {
         // Check if newFilters are different from current filters
         const filtersChanged = JSON.stringify(this.filters) !== JSON.stringify(newFilters);

         if (filtersChanged) {
            console.log('product store newFilters :>> ', newFilters);
            this.filters = newFilters;
            this.offset = 0; // Reset to start when filters change
            this.fetchProducts();
         } else {
            console.log('Filters unchanged. No API call made.');
         }
      },

      clearFilters() {
         this.filters = {};
         this.offset = 0;
         this.fetchProducts();
      },
   },
});
