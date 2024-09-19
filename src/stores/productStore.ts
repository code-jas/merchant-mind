import { defineStore } from 'pinia';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '@/services/productService';
import { Product } from '@/types';

export const useProductStore = defineStore('product', {
   state: () => ({
      products: [] as Product[],
      isLoading: false,
      error: null as string | null,
   }),

   actions: {
      async fetchProducts() {
         this.isLoading = true;
         this.error = null;
         try {
            this.products = await getProducts();
         } catch (err: any) {
            this.error = err.message || 'Failed to fetch products';
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

      async addProduct(productData: Partial<Product>) {
         this.isLoading = true;
         this.error = null;
         try {
            const newProduct = await createProduct(productData);
            this.products.push(newProduct);
         } catch (err: any) {
            this.error = err.message || 'Failed to add product';
         } finally {
            this.isLoading = false;
         }
      },

      async updateProduct(id: number, productData: Partial<Product>) {
         this.isLoading = true;
         this.error = null;
         try {
            const updatedProduct = await updateProduct(id, productData);
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
         } catch (err: any) {
            this.error = err.message || 'Failed to delete product';
         } finally {
            this.isLoading = false;
         }
      },
   },
});
