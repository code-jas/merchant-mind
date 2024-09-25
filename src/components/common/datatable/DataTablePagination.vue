<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table } from '@tanstack/vue-table';

interface DataTablePaginationProps<T> {
   table: Table<T>;
   offset: number;
   limit: number;
   total: number;
}

const props = defineProps<DataTablePaginationProps<any>>();
const emit = defineEmits<{
   (e: 'page-change', newOffset: number): void;
   (e: 'page-size-change', newLimit: number): void;
}>();

// Compute current page and total pages
const currentPage = computed(() => Math.floor(props.offset / props.limit) + 1);
const totalPages = computed(() => Math.ceil(props.total / props.limit));

// Determine if "Next" and "Last" buttons should be disabled
const isNextDisabled = computed(() => currentPage.value >= totalPages.value);
const isLastDisabled = computed(() => currentPage.value >= totalPages.value);

// Handlers for pagination actions
const handleFirstPage = () => {
   if (currentPage.value > 1) {
      console.log(`Going to first page (offset: 0)`);
      emit('page-change', 0);
   }
};

const handlePreviousPage = () => {
   if (currentPage.value > 1) {
      const newOffset = props.offset - props.limit;
      console.log(`Going to previous page (newOffset: ${newOffset})`);
      emit('page-change', newOffset);
   }
};

const handleNextPage = () => {
   if (currentPage.value < totalPages.value) {
      const newOffset = props.offset + props.limit;
      console.log(`Going to next page (newOffset: ${newOffset})`);
      emit('page-change', newOffset);
   }
};

const handleLastPage = () => {
   if (currentPage.value < totalPages.value) {
      const newOffset = (totalPages.value - 1) * props.limit;
      console.log(`Going to last page (newOffset: ${newOffset})`);
      emit('page-change', newOffset);
   }
};

const handlePageSizeChange = (value: string) => {
   const newLimit = Number(value);
   console.log(`Page size changed to: ${newLimit}`);
   emit('page-size-change', newLimit);
};
</script>

<template>
   <div class="flex items-center justify-between px-2">
      <div class="flex-1 text-sm text-muted-foreground">
         <!-- Example: Show selected rows if applicable -->
         <!-- Adjust as needed -->
         <!-- {{ selectedCount }} of {{ total }} row(s) selected. -->
         <!-- {{ table.getFilteredSelectedRowModel().rows.length }} of {{ total }} row(s) selected. -->
      </div>

      <div class="flex items-center space-x-6 lg:space-x-8">
         <!-- Rows per page selector -->
         <div class="flex items-center space-x-2">
            <p class="text-sm font-medium">Rows per page</p>
            <Select :model-value="props.limit.toString()" @update:model-value="handlePageSizeChange">
               <SelectTrigger class="h-8 w-[70px]">
                  <SelectValue :placeholder="props.limit.toString()" />
               </SelectTrigger>
               <SelectContent side="top">
                  <SelectItem v-for="pageSize in [10, 20, 30, 40, 50]" :key="pageSize" :value="pageSize.toString()">
                     {{ pageSize }}
                  </SelectItem>
               </SelectContent>
            </Select>
         </div>

         {{ props.total }}

         <!-- Pagination buttons and info -->
         <div class="flex items-center space-x-2">
            <!-- Page information -->
            <span class="text-sm font-medium"> Page {{ currentPage }} of {{ totalPages }} </span>

            <!-- Navigation buttons -->
            <Button variant="outline" class="h-8 w-8 p-0" :disabled="currentPage === 1" @click="handleFirstPage">
               <span class="sr-only">Go to first page</span>
               <Icon icon="radix-icons:double-arrow-left" class="h-4 w-4" />
            </Button>
            <Button variant="outline" class="h-8 w-8 p-0" :disabled="currentPage === 1" @click="handlePreviousPage">
               <span class="sr-only">Go to previous page</span>
               <Icon icon="radix-icons:chevron-left" class="h-4 w-4" />
            </Button>
            <Button variant="outline" class="h-8 w-8 p-0" :disabled="isNextDisabled" @click="handleNextPage">
               <span class="sr-only">Go to next page</span>
               <Icon icon="radix-icons:chevron-right" class="h-4 w-4" />
            </Button>
            <Button variant="outline" class="h-8 w-8 p-0" :disabled="isLastDisabled" @click="handleLastPage">
               <span class="sr-only">Go to last page</span>
               <Icon icon="radix-icons:double-arrow-right" class="h-4 w-4" />
            </Button>
         </div>
      </div>
   </div>
</template>
