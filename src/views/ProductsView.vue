<script setup lang="ts">
import { useProductStore } from '@/stores/productStore';
import { computed, onMounted } from 'vue';
import DataTable from '@/components/products/DataTable.vue';
// import DataTablePagination from '@/components/products/DataTablePagination.vue';
// import DataTableToolbar from '@/components/products/DataTableToolbar.vue';
import { columns } from '@/components/products/columns';

const productStore = useProductStore();

const data = computed(() => productStore.products);
const totalItems = computed(() => productStore.totalItems);
const offset = computed(() => productStore.offset);
const limit = computed(() => productStore.limit);
// const currentPage = computed(() => productStore.currentPage);
// const totalPages = computed(() => productStore.totalPages);

const handlePageChange = (newOffset: number) => {
   productStore.setOffset(newOffset);
};

const handlePageSizeChange = (newLimit: number) => {
   productStore.setLimit(newLimit);
};

const handleFilterChange = (filters: Record<string, any>) => {
   productStore.setFilters(filters);
};

// const handleFilterChange = (filters: Record<string, any>) => {
//    productStore.setFilters(filters);
// };

// const clearAllFilters = () => {
//    productStore.clearFilters();
// };

onMounted(() => {
   productStore.initialize();
});
</script>

<template>
   <div>
      <div v-if="productStore.isLoading" class="text-center">Loading products...</div>

      <div v-else-if="productStore.error" class="text-red-500">
         {{ productStore.error }}
      </div>
      <div v-else>
         <div class="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <DataTable
               :data="data"
               :columns="columns"
               :totalItems="totalItems"
               :offset="offset"
               :limit="limit"
               @page-change="handlePageChange"
               @page-size-change="handlePageSizeChange"
               @filter-change="handleFilterChange"
            >
               <!-- <template #toolbar="{ table }">
               <DataTableToolbar :table="table" />
            </template> -->

               <!-- <template #pagination="{ table }">
                  <DataTablePagination
                     :table="table"
                     :offset="offset"
                     :limit="limit"
                     :total="totalItems"
                     @page-change="handlePageChange"
                     @page-size-change="handlePageSizeChange"
                     @filter-change="handleFilterChange"
                  />
               </template> -->
            </DataTable>
         </div>
      </div>
   </div>
</template>
