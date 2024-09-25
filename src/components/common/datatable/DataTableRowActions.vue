<script setup lang="ts">
import type { Product } from '@/data/schema';
import { Icon } from '@iconify/vue';

import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuShortcut,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DataTableRowActionsProps {
   product: Product;
   actions: string[];
}
const props = defineProps<DataTableRowActionsProps>();

const emit = defineEmits(['view', 'edit', 'copy', 'delete']);

const onView = () => {
   emit('view', props.product);
};

const onEdit = () => {
   emit('edit', props.product);
};

const onCopy = () => {
   emit('copy', props.product);
};

const onDelete = () => {
   emit('delete', props.product.id);
};
</script>

<template>
   <DropdownMenu>
      <DropdownMenuTrigger as-child>
         <Button variant="ghost" class="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <Icon icon="radix-icons:dots-horizontal" class="h-4 w-4" />
            <span class="sr-only">Open menu</span>
         </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-[160px]">
         <DropdownMenuItem v-if="props.actions.includes('view')" @click="onView">View</DropdownMenuItem>
         <DropdownMenuItem v-if="props.actions.includes('edit')" @click="onEdit">Edit</DropdownMenuItem>
         <DropdownMenuItem v-if="props.actions.includes('copy')" @click="onCopy">Make a copy</DropdownMenuItem>
         <DropdownMenuSeparator />
         <DropdownMenuItem v-if="props.actions.includes('delete')" @click="onDelete">
            Delete
            <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
         </DropdownMenuItem>
      </DropdownMenuContent>
   </DropdownMenu>
</template>
