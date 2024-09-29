import { defineStore } from 'pinia';
import { Category } from '@/types';
import {
   getCategories,
   getCategoryById,
   createCategory,
   updateCategory,
   deleteCategory,
} from '../services/categoryService';

interface CategoryState {
   categories: Category[];
   currentCategory: Category | null;
   isLoading: boolean;
   error: string | null;
   offset: number;
   limit: number;
   totalItems: number;
}

export const useCategoryStore = defineStore('category', {
   state: (): CategoryState => ({
      categories: [],
      currentCategory: null,
      isLoading: false,
      error: null,
      offset: 0,
      limit: 10,
      totalItems: 0,
   }),

   getters: {
      /**
       * Calculates the current page number based on offset and limit.
       */
      currentPage(state): number {
         return Math.floor(state.offset / state.limit) + 1;
      },

      /**
       * Calculates the total number of pages based on totalItems and limit.
       */
      totalPages(state): number {
         return Math.ceil(state.totalItems / state.limit);
      },

      /**
       * Retrieves the categories for the current page by slicing the categories array.
       */
      paginatedCategories(state): Category[] {
         return state.categories.slice(state.offset, state.offset + state.limit);
      },
   },

   actions: {
      /**
       * Fetches all categories from the API and updates the state.
       * Since the API doesn't support pagination, fetch all categories and handle pagination on the frontend.
       */
      async fetchCategories() {
         this.isLoading = true;
         this.error = null;
         try {
            const data = await getCategories();
            this.categories = data;
            this.totalItems = data.length; // Set totalItems based on fetched data
         } catch (err) {
            this.error = 'Failed to fetch categories.';
            console.error('Error fetching categories:', err);
         } finally {
            this.isLoading = false;
         }
      },

      /**
       * Fetches a single category by ID from the API and updates the currentCategory state.
       * @param id - The ID of the category to fetch.
       */
      async fetchCategoryById(id: number) {
         this.isLoading = true;
         this.error = null;
         try {
            const category = await getCategoryById(id);
            this.currentCategory = category;
         } catch (err) {
            this.error = `Failed to fetch category with ID ${id}.`;
            console.error(`Error fetching category with ID ${id}:`, err);
         } finally {
            this.isLoading = false;
         }
      },

      /**
       * Creates a new category using the API and updates the state.
       * @param categoryData - The data for the new category.
       */
      async createNewCategory(categoryData: Partial<Category>) {
         this.isLoading = true;
         this.error = null;
         try {
            const newCategory = await createCategory(categoryData);
            console.log('newCategory :>> ', newCategory);
            this.categories.unshift(newCategory);
            console.log('this.categories :>> ', this.categories);
            this.totalItems += 1;
         } catch (err) {
            this.error = 'Failed to create category.';
            console.error('Error creating category:', err);
         } finally {
            this.isLoading = false;
         }
      },

      /**
       * Updates an existing category using the API and updates the state.
       * @param id - The ID of the category to update.
       * @param categoryData - The updated data for the category.
       */
      async updateExistingCategory(id: number, categoryData: Partial<Category>) {
         this.isLoading = true;
         this.error = null;
         try {
            const updatedCategory = await updateCategory(id, categoryData);
            const index = this.categories.findIndex((cat) => cat.id === id);

            console.log(`Index found: ${index}`);

            if (index !== -1) {
               console.log(`Category found at index ${index}:`, this.categories[index]);
               this.categories[index] = updatedCategory;
               console.log(`Category updated to:`, this.categories[index]);
            }
            if (this.currentCategory?.id === id) {
               this.currentCategory = updatedCategory;
            }
         } catch (err) {
            this.error = `Failed to update category with ID ${id}.`;
            console.error(`Error updating category with ID ${id}:`, err);
         } finally {
            this.isLoading = false;
         }
      },

      /**
       * Deletes a category using the API and updates the state.
       * @param id - The ID of the category to delete.
       */
      async deleteExistingCategory(id: number) {
         this.isLoading = true;
         this.error = null;
         try {
            await deleteCategory(id);
            this.categories = this.categories.filter((cat) => cat.id !== id);
            this.totalItems -= 1; // Decrement totalItems
            if (this.currentCategory?.id === id) {
               this.currentCategory = null;
            }
            // Adjust offset if necessary to prevent out-of-bound pages
            if (this.offset >= this.totalItems && this.offset > 0) {
               this.offset -= this.limit;
            }
         } catch (err) {
            this.error = `Failed to delete category with ID ${id}.`;
            console.error(`Error deleting category with ID ${id}:`, err);
         } finally {
            this.isLoading = false;
         }
      },

      /**
       * Sets a new offset for pagination and ensures it's within valid bounds.
       * @param newOffset - The new offset value.
       */
      setOffset(newOffset: number) {
         // Ensure the newOffset is within bounds
         const maxOffset = Math.max(this.totalItems - this.limit, 0);
         this.offset = Math.min(Math.max(newOffset, 0), maxOffset);
      },

      /**
       * Sets a new limit for pagination and resets the offset to 0.
       * @param newLimit - The new limit value.
       */
      setLimit(newLimit: number) {
         this.limit = newLimit;
         this.offset = 0; // Reset to first page
      },
   },
});
