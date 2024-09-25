<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { Icon } from '@iconify/vue';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
   DialogClose,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import BentoGrid from '@/components/common/gridcard/BentoGrid.vue';
import BentoGridItem from '@/components/common/gridcard/BentoGridItem.vue';
import { Product, Category } from '@/types';

// Define a union type for the data prop
type ViewData = Product | Category;

// Define props with viewType to distinguish between Product and Category
const props = defineProps<{
   isOpen: boolean;
   data: ViewData | null;
   viewType: 'product' | 'category';
   onClose: () => void;
}>();

const { isOpen, data, viewType, onClose } = props;

// Type guards to determine the data type
const isProduct = computed(() => viewType === 'product' && data !== null && 'price' in data);
const isCategory = computed(() => viewType === 'category' && data !== null && 'image' in data);

// Close modal handler
const closeModal = () => {
   onClose();
};
</script>

<template>
   <Dialog v-model:open="isOpen">
      <DialogContent class="sm:max-w-4xl flex flex-row h-4/5">
         <div class="flex flex-col gap-4 relative w-full">
            <DialogClose
               class="absolute top-0 right-0 p-2 rounded-full hover:bg-gray-200 hover:text-gray-700 transition-colors duration-200 cursor-pointer"
               aria-label="Close Dialog"
               @click="closeModal"
            >
               <Icon icon="radix-icons:cross-2" class="h-5 w-5" />
            </DialogClose>
            <DialogHeader>
               <DialogTitle>
                  {{ viewType === 'product' ? 'Product Details' : 'Category Details' }}
               </DialogTitle>
               <DialogDescription>
                  {{
                     viewType === 'product'
                        ? 'View all details related to this product.'
                        : 'View all details related to this category.'
                  }}
               </DialogDescription>
            </DialogHeader>
            <ScrollArea>
               <div class="flex-1 space-y-4 p-6">
                  <!-- Product View -->
                  <template v-if="isProduct">
                     <BentoGrid class="py-6 mb-8">
                        <BentoGridItem
                           v-for="(url, index) in (data as Product).images"
                           :key="index"
                           :image-url="url"
                           class="h-[320px]"
                        />
                     </BentoGrid>

                     <div class="flex justify-between items-center">
                        <DialogHeader>
                           <DialogTitle class="mb-2">{{ (data as Product).title }}</DialogTitle>
                           <DialogDescription>
                              <span class="bg-purple-100 text-primary text-sm font-semibold mr-2 px-3 py-1.5 rounded">
                                 {{ (data as Product).category.name }}
                              </span>
                           </DialogDescription>
                        </DialogHeader>
                        <!-- Price -->
                        <div class="text-xl px-4">
                           <span class="bg-purple-100 text-primary text-lg font-semibold mr-2 px-5 py-1.5 rounded-full">
                              $ {{ (data as Product).price.toFixed(2) }}
                           </span>
                        </div>
                     </div>

                     <div class="text-lg py-4">{{ (data as Product).description }}</div>
                  </template>

                  <!-- Category View -->
                  <template v-else-if="isCategory">
                     <div class="flex flex-col items-center">
                        <BentoGridItem :image-url="(data as Category).image" class="h-[360px]" />
                        <!-- <img
                           :src="(data as Category).image"
                           alt="Category Image"
                           class="w-32 h-32 object-cover rounded-full"
                        /> -->
                        <h2 class="text-2xl font-semibold mt-4">{{ (data as Category).name }}</h2>
                        <p class="text-gray-600 mt-2">
                           Created at: {{ new Date((data as Category).creationAt).toLocaleDateString() }}
                        </p>
                        <p class="text-gray-600">
                           Updated at: {{ new Date((data as Category).updatedAt).toLocaleDateString() }}
                        </p>
                     </div>
                  </template>

                  <!-- Fallback for undefined data -->
                  <template v-else>
                     <p class="text-center text-red-500">No data available.</p>
                  </template>
               </div>
            </ScrollArea>
         </div>
      </DialogContent>
   </Dialog>
</template>

<style scoped>
.dialog-content {
   /* Ensure the dialog is centered */
   display: flex;
   justify-content: center;
   align-items: center;
}
</style>
