<script setup lang="ts">
import { defineProps } from 'vue';
import { Icon } from '@iconify/vue';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
   DialogClose,
} from '@/components/ui/dialog';
import BentoGrid from '@/components/common/gridcard/BentoGrid.vue';
import BentoGridItem from '@/components/common/gridcard/BentoGridItem.vue';
import { Product } from '@/types';

const props = defineProps<{
   isOpen: boolean;
   product: Product | null;
   onClose: () => void;
}>();

const { isOpen, product, onClose } = props;

const closeModal = () => {
   onClose();
};
</script>

<template>
   <Dialog v-model:open="isOpen">
      <DialogContent class="sm:max-w-4xl flex flex-row">
         <div class="flex flex-col gap-4 relative">
            <DialogClose
               class="absolute top-0 right-0 p-2 rounded-full hover:bg-gray-200 hover:text-gray-700 transition-colors duration-200 cursor-pointer"
               aria-label="Close Dialog"
            >
               <Icon icon="radix-icons:cross-2" class="h-5 w-5" @click="closeModal" />
            </DialogClose>
            <DialogHeader>
               <DialogTitle>Product Details</DialogTitle>
               <DialogDescription> View all details related to this product.</DialogDescription>
            </DialogHeader>
            <div class="flex-1 space-y-4 p-6">
               <BentoGrid class="p-6">
                  <BentoGridItem v-for="(url, index) in product?.images || []" :key="index" :image-url="url" />
               </BentoGrid>

               <div class="flex justify-between items-center">
                  <DialogHeader>
                     <DialogTitle class="mb-2">{{ product?.title }}</DialogTitle>
                     <DialogDescription>
                        <span class="bg-purple-100 text-primary text-sm font-semibold mr-2 px-3 py-1.5 rounded">{{
                           product?.category?.name
                        }}</span>
                     </DialogDescription>
                  </DialogHeader>
                  <!-- Price -->
                  <div class="text-xl px-4">
                     <span class="bg-purple-100 text-primary text-lg font-semibold mr-2 px-5 py-1.5 rounded-full">
                        $ {{ product?.price.toFixed(2) }}
                     </span>
                     <!-- <span class="font-semibold mr-2">${{ product?.price.toFixed(2) }}</span> -->
                  </div>
               </div>

               <div class="text-lg py-4">{{ product?.description }}</div>
            </div>
            <!-- 
            <DialogFooter>
               <Button type="button" variant="secondary" @click="closeModal">Close</Button>
            </DialogFooter> -->
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
