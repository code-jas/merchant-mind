<script setup lang="ts">
import { defineProps, ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { Product } from '@/types';
import placeholderImage from '@/assets/no-image-placeholder.jpg';
import { ScrollArea } from '../ui/scroll-area';

// Define the props expected by the RecentProducts component
interface RecentProductsProps {
   products: Product[];
}

const props = defineProps<RecentProductsProps>();
const scrollAreaRef = ref<HTMLElement | null>(null);

// Utility function to format the creation date
const formatDate = (dateString: string): string => {
   const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
   };
   return new Date(dateString).toLocaleDateString(undefined, options);
};

// Handler for image loading errors
const onImageError = (event: Event) => {
   const img = event.target as HTMLImageElement;
   img.src = placeholderImage;
};

// Constants
const ITEMS_PER_LOAD = 20;

// Reactive state
const displayedProducts = ref<Product[]>([]);
const isLoadingMore = ref<boolean>(false);
const allLoaded = ref<boolean>(false);

// Initialize displayedProducts with the first ITEMS_PER_LOAD products
const initializeDisplayedProducts = () => {
   displayedProducts.value = props.products.slice(0, ITEMS_PER_LOAD);
   allLoaded.value = props.products.length <= ITEMS_PER_LOAD;
};

// Load more products when the user scrolls to the bottom
const loadMoreProducts = async () => {
   if (isLoadingMore.value || allLoaded.value) return;

   isLoadingMore.value = true;

   // Simulate network delay of 1 second
   await new Promise((resolve) => setTimeout(resolve, 1000));

   const currentLength = displayedProducts.value.length;
   const nextProducts = props.products.slice(currentLength, currentLength + ITEMS_PER_LOAD);

   if (nextProducts.length === 0) {
      allLoaded.value = true;
   } else {
      displayedProducts.value = [...displayedProducts.value, ...nextProducts];
      if (displayedProducts.value.length >= props.products.length) {
         allLoaded.value = true;
      }
   }

   isLoadingMore.value = false;
};

// Watch for changes in the products prop to reinitialize displayedProducts
watch(
   () => props.products,
   () => {
      initializeDisplayedProducts();
   },
   { immediate: true }
);

// Handle the scroll event to detect when to load more products
const handleScroll = (event: Event) => {
   console.log(event);
   const target = event.target as HTMLElement;
   const threshold = 100;
   console.log('target :>> ', target);
   if (target.scrollTop + target.clientHeight >= target.scrollHeight - threshold) {
      loadMoreProducts();
   }
};

// Initialize displayedProducts on component mount
onMounted(() => {
   initializeDisplayedProducts();
   if (scrollAreaRef.value) {
      scrollAreaRef.value.addEventListener('scroll', handleScroll);
   }
});

onBeforeUnmount(() => {
   if (scrollAreaRef.value) {
      scrollAreaRef.value.removeEventListener('scroll', handleScroll);
   }
});
</script>

<template>
   <ScrollArea ref="scrollArea" class="h-[400px] rounded-md">
      <div class="space-y-4">
         <!-- Display Displayed Products -->
         <div v-for="product in displayedProducts" :key="product.id" class="flex items-center space-x-4">
            <!-- Product Image with Error Handling and Lazy Loading -->
            <img
               :src="product.images[0]"
               :alt="product.title"
               class="h-12 w-12 rounded object-cover"
               @error="onImageError($event)"
               loading="lazy"
            />

            <!-- Product Details -->
            <div class="flex-1">
               <p class="text-sm font-medium">{{ product.title }}</p>
               <p class="text-sm text-muted-foreground">${{ product.price.toFixed(2) }}</p>
            </div>

            <!-- Additional Info (e.g., Created At) -->
            <div class="text-sm text-muted-foreground">
               {{ formatDate(product.creationAt) }}
            </div>
         </div>

         <!-- Display Skeletons When Loading More Products -->
         <div v-if="isLoadingMore" class="space-y-4">
            <div v-for="n in 3" :key="'skeleton-' + n" class="flex items-center space-x-4 animate-pulse">
               <!-- Skeleton for Image -->
               <div class="h-12 w-12 rounded bg-gray-200"></div>

               <!-- Skeleton for Product Details -->
               <div class="flex-1 space-y-2">
                  <div class="h-4 w-3/4 rounded bg-gray-200"></div>
                  <div class="h-4 w-1/2 rounded bg-gray-200"></div>
               </div>

               <!-- Skeleton for Additional Info -->
               <div class="h-4 w-1/4 rounded bg-gray-200"></div>
            </div>
         </div>

         <!-- Display a Message When All Products Are Loaded -->
         <div v-if="allLoaded && !isLoadingMore" class="text-center text-sm text-muted-foreground">
            No more products to display.
         </div>
      </div>
   </ScrollArea>
</template>

<style scoped>
/* Optional: Customize Skeleton styles if needed */
</style>
