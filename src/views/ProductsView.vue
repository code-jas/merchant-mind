<script setup lang="ts">
import { useProductStore } from '@/stores/productStore';
import { onMounted } from 'vue';
import tasks from '@/data/tasks.json';
import DataTable from '@/components/products/DataTable.vue';
import { columns } from '@/components/products/columns';

const productStore = useProductStore();

onMounted(() => {
   productStore.fetchProducts();
});
</script>

<template>
   <div class="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <DataTable :data="tasks" :columns="columns" />
   </div>

   <h3 class="text-2xl font-semibold mb-4">Products</h3>

   <div v-if="productStore.isLoading" class="text-center">Loading products...</div>

   <div v-else-if="productStore.error" class="text-red-500">
      {{ productStore.error }}
   </div>
   <div v-else>
      <pre>{{ productStore.products }}</pre>
   </div>
</template>
