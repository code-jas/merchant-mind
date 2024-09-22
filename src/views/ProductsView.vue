<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { Product } from '@/types';
import { useProductStore } from '@/stores/productStore';
// import DataTablePagination from '@/components/products/DataTablePagination.vue';
// import DataTableToolbar from '@/components/products/DataTableToolbar.vue';
import { columns } from '@/components/products/columns';
import DataTable from '@/components/products/DataTable.vue';
import FormModal from '@/components/products/FormModal.vue';
import ViewModal from '@/components/products/ViewModal.vue';

// store
const productStore = useProductStore();

// computed
const data = computed(() => productStore.products);
const totalItems = computed(() => productStore.totalItems);
const offset = computed(() => productStore.offset);
const limit = computed(() => productStore.limit);
const filters = computed(() => productStore.filters);

const isViewModalOpen = ref(false);
const isFormModalOpen = ref(false);
const modalMode = ref<'create' | 'edit'>('create');
const selectedProduct = ref<Product | null>(null);

const handlePageChange = (newOffset: number) => {
   productStore.setOffset(newOffset);
};

const handlePageSizeChange = (newLimit: number) => {
   productStore.setLimit(newLimit);
};

const handleFilterChange = (filters: Record<string, any>) => {
   console.log('filters :>> ', filters);
   productStore.setFilters(filters);
};

// const clearAllFilters = () => {
//    productStore.clearFilters();
// };

const openCreateModal = () => {
   console.log('test create modal clicked');
   modalMode.value = 'create';
   selectedProduct.value = null;
   isFormModalOpen.value = true;
};
const openEditModal = (product: Product) => {
   modalMode.value = 'edit';
   selectedProduct.value = product;
   isFormModalOpen.value = true;
};

const closeFormModal = () => {
   isFormModalOpen.value = false;
};

const handleView = (product: Product) => {
   selectedProduct.value = product;
   isViewModalOpen.value = true;
};

const handleCopy = async (product: Product) => {
   try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...productData } = product;
      productData.categoryId = productData.category.id;
      await productStore.createProduct(productData);
      // TODO: show a toast notification
   } catch (error: any) {
      console.error('Copy Product Error:', error.message);
   }
};

const handleDelete = async (productId: number) => {
   if (confirm(`Are you sure you want to delete product with ID ${productId}?`)) {
      try {
         await productStore.deleteProduct(productId);
         // TODO: show a toast notification
      } catch (error: any) {
         console.error('Delete Product Error:', error.message);
      }
   }
};

// const saveProduct = async (updatedProduct: Product) => {
//    await productStore.updateProduct(updatedProduct.id, updatedProduct);
//    isEditModalOpen.value = false;
// };
onMounted(() => {
   productStore.initialize();
});
</script>

<template>
   <div>
      <div>
         <div class="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <DataTable
               :data="data"
               :columns="columns"
               :filters="filters"
               :totalItems="totalItems"
               :offset="offset"
               :limit="limit"
               :loading="productStore.isLoading"
               @page-change="handlePageChange"
               @page-size-change="handlePageSizeChange"
               @filter-change="handleFilterChange"
               @create="openCreateModal"
               @view="handleView"
               @edit="openEditModal"
               @copy="handleCopy"
               @delete="handleDelete"
            />
         </div>
      </div>

      <!-- FormModal for Create and Edit -->
      <FormModal
         v-if="isFormModalOpen"
         :mode="modalMode"
         :product="selectedProduct"
         :isOpen="isFormModalOpen"
         @close="closeFormModal"
      />

      <ViewModal
         v-if="isViewModalOpen"
         :isOpen="isViewModalOpen"
         :product="selectedProduct"
         @close="isViewModalOpen = false"
      />
   </div>
</template>
