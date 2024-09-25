<script setup lang="ts">
import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/vue-table';
import {
   FlexRender,
   getCoreRowModel,
   getFacetedRowModel,
   getFacetedUniqueValues,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   useVueTable,
} from '@tanstack/vue-table';

import { ref, computed, watch } from 'vue';
import DataTablePagination from './DataTablePagination.vue';
import DataTableToolbar from './DataTableToolbar.vue';
import { valueUpdater } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Loading from '@/components/Loading.vue';
import { useProductStore } from '@/stores/productStore';

import DataTableRowActions from './DataTableRowActions.vue';
import { DataTableProps } from './types';

const props = defineProps<DataTableProps<any>>();
const emit = defineEmits([
   'create',
   'view',
   'edit',
   'copy',
   'delete',
   'page-change',
   'page-size-change',
   'filter-change',
]);

const productStore = useProductStore();

// Bind the store's offset, limit, and totalItems
const offset = computed(() => productStore.offset);
const limit = computed(() => productStore.limit);
const totalItems = computed(() => productStore.totalItems);

// Setup table using @tanstack/vue-table

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});

const table = ref(
   useVueTable({
      data: props.data,
      columns: props.columns,
      state: {
         sorting: sorting.value,
         columnFilters: columnFilters.value,
         columnVisibility: columnVisibility.value,
         rowSelection: rowSelection.value,
      },
      enableRowSelection: true,
      manualPagination: props.manualPagination, // Server-side pagination
      manualSorting: false,
      onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
      onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
      onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
      onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues(),
   })
);

watch(
   () => props.data,
   (newData) => {
      table.value = useVueTable({
         ...table.value.options,
         data: newData,
      });
   },
   { deep: true }
);

const actions = computed(() => props.actions || []);
</script>

<template>
   <div class="space-y-4">
      <!-- Toolbar Slot - available for custom pagination -->
      <slot name="toolbar" :table="table">
         <DataTableToolbar
            :table="table"
            :filters="filters || null"
            @create="emit('create')"
            @update:filters="emit('filter-change', $event)"
         />
      </slot>

      <!-- Table Structure -->

      <div v-if="loading" class="text-center">
         <Loading />
      </div>

      <div v-else class="rounded-md border">
         <Table>
            <TableHeader>
               <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                  <TableHead v-for="header in headerGroup.headers" :key="header.id">
                     <FlexRender
                        v-if="!header.isPlaceholder"
                        :render="header.column.columnDef.header"
                        :props="header.getContext()"
                     />
                  </TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               <template v-if="table.getRowModel().rows?.length">
                  <TableRow
                     v-for="row in table.getRowModel().rows"
                     :key="row.id"
                     :data-state="row.getIsSelected() && 'selected'"
                  >
                     <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" :loading="loading">
                        <div v-if="cell.column.id == 'actions'">
                           <!-- <pre>{{ cell.row.original }}</pre> -->
                           <DataTableRowActions
                              :product="cell.row.original"
                              :actions="actions"
                              @view="emit('view', $event)"
                              @edit="emit('edit', $event)"
                              @copy="emit('copy', $event)"
                              @delete="emit('delete', $event)"
                           >
                           </DataTableRowActions>
                        </div>

                        <FlexRender
                           v-else
                           :render="cell.column.columnDef.cell"
                           :props="cell.getContext()"
                           @view="emit('view', $event)"
                           @edit="emit('edit', $event)"
                           @copy="emit('copy', $event)"
                           @delete="emit('delete', $event)"
                        />
                     </TableCell>
                  </TableRow>
               </template>

               <TableRow v-else>
                  <TableCell :colspan="props.columns.length" class="h-24 text-center"> No results. </TableCell>
               </TableRow>
            </TableBody>
         </Table>
      </div>

      <!-- Pagination Slot -  available for custom pagination -->
      <slot
         name="pagination"
         :offset="offset"
         :limit="limit"
         :total="totalItems"
         @page-change="emit('page-change', $event)"
         @page-size-change="emit('page-size-change', $event)"
      >
         <!-- Default pagination -->
         <DataTablePagination
            :table="table"
            :offset="offset"
            :limit="limit"
            :total="totalItems"
            @page-change="emit('page-change', $event)"
            @page-size-change="emit('page-size-change', $event)"
         />
      </slot>
   </div>
</template>
