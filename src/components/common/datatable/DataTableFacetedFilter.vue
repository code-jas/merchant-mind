<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Column } from '@tanstack/vue-table';
import type { Component } from 'vue';
import { Icon } from '@iconify/vue';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
   CommandSeparator,
} from '@/components/ui/command';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Product } from '@/types';

interface DataTableFacetedFilter {
   category: number | string | null | undefined;
   column?: Column<Product, any>;
   title?: string;
   options: {
      label: string;
      value: string;
      icon?: Component;
   }[];
}

const props = defineProps<DataTableFacetedFilter>();

const emit = defineEmits(['update:category', 'clearFilter']);

const selectedValue = ref<string | null>(props.column?.getFilterValue() as string | null);

const facets = computed(() => props.column?.getFacetedUniqueValues());

const handleSelect = (option: DataTableFacetedFilter['options'][0]) => {
   if (selectedValue.value === option.value) {
      selectedValue.value = null;
      props.column?.setFilterValue(undefined);
   } else {
      selectedValue.value = option.value;
      props.column?.setFilterValue(option.value);
   }
   emit('update:category', selectedValue.value);
};

const clearFilters = () => {
   console.log('selectedValue :>> ', selectedValue.value);
   selectedValue.value = null;
   props.column?.setFilterValue(undefined);
   emit('update:category', selectedValue.value);
};

watch(
   () => props.category,
   (newVal) => {
      selectedValue.value = newVal as string | null;
   },
   { immediate: true }
);
</script>

<template>
   <Popover>
      <PopoverTrigger as-child>
         <Button variant="outline" size="sm" class="h-8 border-dashed flex items-center">
            <Icon icon="radix-icons:plus-circled" class="mr-2 h-4 w-4" />
            <span>
               {{ title }}
            </span>
            <template v-if="selectedValue">
               <Separator orientation="vertical" class="mx-2 h-4" />
               <Badge variant="secondary" class="rounded-sm px-1 font-normal">
                  {{ options.find((opt) => opt.value === selectedValue)?.label }}
               </Badge>
            </template>
         </Button>
      </PopoverTrigger>
      <PopoverContent class="w-[200px] p-0" align="start">
         <Command
            :filter-function="
               (list, term) => {
                  const lowerTerm = term.toLowerCase();
                  if (Array.isArray(list) && list.every((item) => typeof item === 'object')) {
                     return list.filter((item) => item?.label?.toString().toLowerCase().includes(lowerTerm));
                  }

                  return [];
               }
            "
         >
            <CommandInput :placeholder="title" />
            <CommandList>
               <CommandEmpty>No results found.</CommandEmpty>
               <CommandGroup>
                  <CommandItem
                     v-for="option in options"
                     :key="option.value"
                     :value="option"
                     @select="handleSelect(option)"
                     class="hover:bg-accent hover:text-accent-foreground"
                  >
                     <div
                        :class="
                           cn(
                              'mr-2 flex h-4 w-4 items-center justify-center rounded-full border border-primary',
                              selectedValue === option.value
                                 ? 'bg-primary text-primary-foreground'
                                 : 'opacity-50 [&_svg]:invisible'
                           )
                        "
                     >
                        <Icon icon="radix-icons:check" class="h-4 w-4" />
                     </div>
                     <span>{{ option.label }}</span>
                     <span
                        v-if="facets?.get(option.value)"
                        class="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs"
                     >
                        {{ facets.get(option.value) }}
                     </span>
                  </CommandItem>
               </CommandGroup>

               <CommandSeparator />
               <CommandGroup>
                  <CommandItem
                     class="justify-center text-center hover:bg-accent hover:text-accent-foreground"
                     :value="{ label: 'Clear filters' }"
                     @click="clearFilters"
                  >
                     Clear filters
                  </CommandItem>
               </CommandGroup>
            </CommandList>
         </Command>
      </PopoverContent>
   </Popover>
</template>
