<script setup lang="ts">
import { defineProps, computed } from 'vue';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
   DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useProductStore } from '@/stores/productStore';
import BentoGrid from './BentoGrid.vue';
import BentoGridItem from './BentoGridItem.vue';

const props = defineProps<{
   isOpen: boolean;
   product: Product | null;
   onClose: () => void;
}>();

const { isOpen, product, onClose } = props;

const productStore = useProductStore();

const categoryName = computed(() => {
   if (!product) return '';
   const category = productStore.categories.find((cat) => cat.id === product.categoryId);
   return category ? category.name : 'Unknown Category';
});

const closeModal = () => {
   onClose();
};
</script>

<template>
   <Dialog v-model:open="isOpen">
      <DialogContent class="sm:max-w-4xl flex flex-row">
         <div class="flex flex-col gap-4">
            <DialogHeader>
               <DialogTitle>Product Details</DialogTitle>
               <DialogDescription> View all details related to the selected product. </DialogDescription>
            </DialogHeader>
            <div class="flex-1 space-y-4 p-6">
               <DialogHeader>
                  <DialogTitle class="mb-2">{{ product?.title }}</DialogTitle>
                  <DialogDescription>
                     <span class="bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">{{
                        categoryName
                     }}</span>
                  </DialogDescription>
               </DialogHeader>

               <div class="text-lg my-7">{{ product?.description }}</div>

               <!-- Price -->
               <div class="text-lg">
                  <span class="font-semibold mr-2">Price:</span>
                  <span>${{ product?.price.toFixed(2) }}</span>
               </div>
            </div>
            <BentoGrid class="p-6">
               <BentoGridItem v-for="(url, index) in product?.images || []" :key="index" :image-url="url" />
            </BentoGrid>
            <DialogFooter>
               <Button type="button" variant="secondary" @click="closeModal">Close</Button>
            </DialogFooter>
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
