<script setup lang="ts">
import type { Table } from '@tanstack/vue-table';
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { debounce } from 'lodash';

import DataTableViewOptions from './DataTableViewOptions.vue';
import DataTablePriceRangeFilter from './DataTablePriceRangeFilter.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filters, PriceRangeFilter } from '@/types';

// Define props for the table and filters
interface DataTableToolbarProps<T> {
   table: Table<T>;
   filters: Filters | null;
}

const props = defineProps<DataTableToolbarProps<any>>();

// Destructure filters from props
const { filters } = props;

// Check if any filters are applied
const isFiltered = computed(() => filters?.title || filters?.priceRange);

// Emit events to update filters
const emit = defineEmits(['update:filters', 'create']);

const debouncedUpdateTitle = debounce((title: string) => {
   emit('update:filters', { ...filters, title });
}, 300); // 300ms debounce delay

// Update the title filter
const updatetitle = (title: string) => {
   debouncedUpdateTitle(title);
};

// Update the price range filter
const updatePriceRange = (newRange: PriceRangeFilter) => {
   emit('update:filters', { ...filters, priceRange: newRange });
};

// Clear the price range filter
const clearPriceRange = () => {
   emit('update:filters', { ...filters, priceRange: { min: undefined, max: undefined } });
};
</script>

<template>
   <div class="flex items-center justify-between">
      <div class="flex flex-1 items-center space-x-2">
         <!-- title filter -->
         <Input
            v-if="filters"
            placeholder="Product Name..."
            :model-value="filters?.title ?? ''"
            class="h-8 w-[150px] lg:w-[250px]"
            @input="updatetitle($event.target.value)"
         />

         <!-- Price range filter -->
         <DataTablePriceRangeFilter
            v-if="filters"
            :priceRange="filters?.priceRange ?? { min: undefined, max: undefined }"
            @update:priceRange="updatePriceRange"
            @clearFilter="clearPriceRange"
         />

         <!-- Reset filters button -->
         <Button
            v-if="isFiltered"
            variant="ghost"
            class="h-8 px-2 lg:px-3"
            @click="$emit('update:filters', { title: '', priceRange: { min: undefined, max: undefined } })"
         >
            Reset
            <Icon icon="radix-icons:cross-2" class="h-4 w-4" />
         </Button>
      </div>

      <!-- Table view options -->
      <div class="flex gap-4 items-center">
         <DataTableViewOptions :table="table" />
         <div class="flex justify-end">
            <Button @click="emit('create')" class="h-8"> Create Product </Button>
         </div>
      </div>
   </div>
</template>
