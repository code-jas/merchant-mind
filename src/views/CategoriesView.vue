<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { ColumnDef } from '@tanstack/table-core';
import { Category } from '@/types';
import { categoryColumns as columns } from '@/components/categories/columns';
import { useCategoryStore } from '@/stores/categoryStore';

import DataTable from '@/components/common/datatable/DataTable.vue';
import { DataTableEvents, DataTableProps } from '@/components/common/datatable/types';

import ViewModal from '@/components/common/modals/ViewModal.vue';
import CategoryFormModal from '@/components/common/modals/CategoryFormModal.vue';

// Init store
const categoryStore = useCategoryStore();

// Computed properties
const data = computed(() => categoryStore.categories);
const totalItems = computed(() => categoryStore.totalItems);
const offset = computed(() => categoryStore.offset);
const limit = computed(() => categoryStore.limit);
const isLoading = computed(() => categoryStore.isLoading);

// const error = computed(() => categoryStore.error);

// Modal state
const isViewModalOpen = ref(false);
const isFormModalOpen = ref(false);
const modalMode = ref<'create' | 'edit'>('create');
const selectedCategory = ref<Category | null>(null);

const handlePageChange = (newOffset: number) => {
   categoryStore.setOffset(newOffset);
};

const handlePageSizeChange = (newLimit: number) => {
   categoryStore.setLimit(newLimit);
};

// const handleFilterChange = (filters: Record<string, any>) => {};

// Handler to open the create product modal
const openCreateModal = () => {
   console.log('test create modal clicked');
   modalMode.value = 'create';
   selectedCategory.value = null;
   isFormModalOpen.value = true;
};

const openEditModal = (category: Category) => {
   console.log('category :>> ', category);
   modalMode.value = 'edit';
   selectedCategory.value = category;
   isFormModalOpen.value = true;
};

const closeFormModal = () => {
   isFormModalOpen.value = false;
};

const handleView = (category: Category) => {
   selectedCategory.value = category;
   isViewModalOpen.value = true;
};

const handleDelete = async (categoryId: number) => {
   if (confirm(`Are you sure you want to delete product with ID ${categoryId}?`)) {
      try {
         await categoryStore.deleteExistingCategory(categoryId);
         // TODO: Show a toast notification for success
      } catch (error: any) {
         console.error('Delete Product Error:', error.message);
         // TODO: Show a toast notification for error
      }
   }
};
const dataTableProps = computed<DataTableProps<Category>>(() => ({
   data: data.value,
   columns: columns as ColumnDef<Category, any>[],
   totalItems: totalItems.value,
   manualPagination: true,
   offset: offset.value,
   limit: limit.value,
   loading: isLoading.value,
   actions: ['view', 'edit', 'delete'],
}));

const dataTableEvents: DataTableEvents<Category, keyof Category> = {
   'page-change': handlePageChange,
   'page-size-change': handlePageSizeChange,
   create: openCreateModal,
   view: handleView,
   edit: openEditModal,
   delete: handleDelete,
};

// Fetch category and its products on component mount
onMounted(() => {
   categoryStore.fetchCategories();
});
</script>

<template>
   <div>
      <div>
         <div class="flex h-full flex-1 flex-col space-y-8 p-8">
            <DataTable v-bind="dataTableProps" v-on="dataTableEvents" />
         </div>
      </div>

      <CategoryFormModal
         v-if="isFormModalOpen"
         :mode="modalMode"
         :category="selectedCategory"
         :isOpen="isFormModalOpen"
         @close="closeFormModal"
      />

      <ViewModal
         v-if="isViewModalOpen"
         :isOpen="isViewModalOpen"
         :data="selectedCategory"
         viewType="category"
         @close="isViewModalOpen = false"
      />
   </div>
</template>
