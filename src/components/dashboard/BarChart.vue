<script setup lang="ts">
import { computed } from 'vue';
import { BarChart } from '@/components/ui/chart-bar'; // Ensure correct import path
import { Product } from '@/data/schema';

// Define the props expected by the BarChart component
interface BarChartProps {
   data: Product[];
}

const props = defineProps<BarChartProps>();

// Compute the chart data based on the provided products
const chartData = computed(() => {
   const categoryCounts: Record<string, number> = {};

   props.data.forEach((product) => {
      const categoryName = product.category.name;
      if (categoryName) {
         categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
      }
   });

   let sortedCategories = Object.entries(categoryCounts)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);

   if (sortedCategories.length > 10) {
      sortedCategories = sortedCategories.slice(0, 10);
   }

   return sortedCategories;
});
</script>
<template>
   <BarChart :data="chartData" :categories="['total']" :index="'name'" :rounded-corners="4" />
</template>
