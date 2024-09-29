<script setup lang="ts">
import { reactive, computed, watch } from 'vue';
import type { Table } from '@tanstack/vue-table';
import { useProductStore } from '@/stores/productStore';
import { Icon } from '@iconify/vue';

import DataTableViewOptions from './DataTableViewOptions.vue';
import DataTablePriceRangeFilter from './DataTablePriceRangeFilter.vue';
import DataTableFacetedFilter from './DataTableFacetedFilter.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Category, Filters, PriceRangeFilter } from '@/types';

// Define props for the table and filters
interface DataTableToolbarProps<T> {
   table: Table<T>;
   filters: Filters | null;
   hasFilters: boolean;
}

let debounceTimer: NodeJS.Timeout | null = null;

const props = defineProps<DataTableToolbarProps<any>>();
const emit = defineEmits(['update:filters', 'create']);

const productStore = useProductStore();

// Create a reactive local copy of the filters
const localFilters = reactive<Filters>({
   title: props.filters?.title ?? '',
   priceRange: props.filters?.priceRange ?? { min: undefined, max: undefined },
   category: props.filters?.category ?? undefined,
});

const debounce = (func: (...args: any[]) => void, delay: number) => {
   return (...args: any[]) => {
      if (debounceTimer) {
         clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(() => {
         func(...args);
      }, delay);
   };
};

// Watch for changes in props.filters to keep localFilters in sync
watch(
   () => props.filters,
   (newFilters) => {
      if (newFilters) {
         localFilters.title = newFilters.title ?? '';
         localFilters.priceRange = newFilters.priceRange ?? { min: undefined, max: undefined };
         localFilters.category = newFilters.category ?? undefined;
      } else {
         localFilters.title = '';
         localFilters.priceRange = { min: undefined, max: undefined };
         localFilters.category = undefined;
      }
   },
   { deep: true, immediate: true }
);

const debouncedSetFilters = debounce((newFilters: Filters) => {
   productStore.setFilters(newFilters);
}, 300);

watch(
   () => ({ ...localFilters }),
   (newFilters) => {
      // Clean up the filters object to include only active filters
      const filters: Filters = {};
      if (newFilters.title) filters.title = newFilters.title;
      if (
         newFilters.priceRange &&
         (newFilters.priceRange.min !== undefined || newFilters.priceRange.max !== undefined)
      ) {
         filters.priceRange = newFilters.priceRange;
      }
      if (newFilters.category !== undefined) filters.category = newFilters.category;

      debouncedSetFilters(filters);
   },
   { deep: true }
);

// Check if any filters are applied
const isFiltered = computed(() => {
   return (
      localFilters.title ||
      (localFilters.priceRange &&
         (localFilters.priceRange.min !== undefined || localFilters.priceRange.max !== undefined)) ||
      localFilters.category !== undefined
   );
});

// Update the title filter
// const updateTitle = debounce((title: string) => {
//    localFilters.title = title;
// }, 100);

// Update the price range filter
const updatePriceRange = (newRange: PriceRangeFilter) => {
   localFilters.priceRange = newRange;
};

// Clear all filters
const resetFilters = () => {
   localFilters.title = '';
   localFilters.priceRange = { min: undefined, max: undefined };
   localFilters.category = undefined;
};

// Update the category filter
const updateCategory = (category: number | undefined) => {
   localFilters.category = category;
};
</script>

<template>
   <div class="flex items-center justify-between">
      <div v-if="hasFilters" class="flex flex-1 items-center space-x-2">
         <!-- Title filter -->
         <Input
            placeholder="Product Name..."
            v-model:modelValue="localFilters.title"
            class="h-8 w-[150px] lg:w-[250px]"
         />
         <!-- @input="updateTitle($event.target.value)" -->

         <!-- Price range filter -->
         <DataTablePriceRangeFilter
            v-model:priceRange="localFilters.priceRange"
            @update:priceRange="updatePriceRange"
            @clearFilter="() => (localFilters.priceRange = { min: undefined, max: undefined })"
         />

         <!-- Category filter -->
         <DataTableFacetedFilter
            v-if="table.getColumn('category')"
            :column="table.getColumn('category')"
            title="Category"
            :options="
               productStore.categories.map((category: Category) => ({
                  label: category.name,
                  value: category.id.toString(),
               }))
            "
            v-model:category="localFilters.category"
            @update:category="updateCategory"
         />

         <!-- Reset filters button -->
         <Button v-if="isFiltered" variant="ghost" class="h-8 px-2 lg:px-3" @click="resetFilters">
            Reset
            <Icon icon="radix-icons:cross-2" class="h-4 w-4" />
         </Button>
      </div>

      <!-- Table view options -->
      <div class="flex gap-4 items-end w-full">
         <DataTableViewOptions :table="table" />
         <div class="flex justify-end">
            <Button @click="emit('create')" class="h-8">Create Product</Button>
         </div>
      </div>
   </div>
</template>
