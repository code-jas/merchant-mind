<script setup lang="ts">
import type { Table } from '@tanstack/vue-table';
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

// import DataTableFacetedFilter from './DataTableFacetedFilter.vue';
import DataTableViewOptions from './DataTableViewOptions.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DataTableToolbarProps<T> {
   table: Table<T>;
}

// Use the generic type in defineProps
// 'any' can be replaced by specific types in the parent component
const props = defineProps<DataTableToolbarProps<any>>();

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0);
</script>

<template>
   <div class="flex items-center justify-between">
      <div class="flex flex-1 items-center space-x-2">
         <Input
            placeholder="Filter tasks..."
            :model-value="(table.getColumn('title')?.getFilterValue() as string) ?? ''"
            class="h-8 w-[150px] lg:w-[250px]"
            @input="table.getColumn('title')?.setFilterValue($event.target.value)"
         />
         <!-- Faceted filters for other columns -->
         <!-- <DataTableFacetedFilter
            v-if="table.getColumn('price')"
            :column="table.getColumn('price')"
            title="Prices"
            :options="statuses"
         />
         <DataTableFacetedFilter
            v-if="table.getColumn('priority')"
            :column="table.getColumn('priority')"
            title="Priority"
            :options="priorities"
         /> -->

         <!-- Reset filters button -->
         <Button v-if="isFiltered" variant="ghost" class="h-8 px-2 lg:px-3" @click="table.resetColumnFilters()">
            Reset
            <Icon icon="radix-icons:cross-2" class="h-4 w-4" />
         </Button>
      </div>
      <!-- Table view options -->
      <DataTableViewOptions :table="table" />
   </div>
</template>
