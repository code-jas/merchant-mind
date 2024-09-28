<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useProductStore } from '@/stores/productStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import BarChart from '@/components/dashboard/BarChart.vue';
import RecentProducts from '@/components/dashboard/RecentProducts.vue';

interface DashboardCard {
   id: number;
   title: string;
   icon: string;
   value: string | number;
   animatedValue: number;
   description: string;
}

const productStore = useProductStore();

const dashboardCards = ref<DashboardCard[]>([]);
const isLoading = ref<boolean>(true);
const errorMessage = ref<string | null>(null);

const products = computed(() => productStore.products);

// Function to animate value increment
const animateValue = (card: DashboardCard, start: number, end: number, duration: number) => {
   let startTime: number | null = null;
   const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const currentValue = Math.min(start + ((end - start) * progress) / duration, end);
      card.animatedValue = Math.floor(currentValue); // Update animated value

      if (progress < duration) {
         // Continue the animation
         requestAnimationFrame(step);
      } else {
         // Ensure the final value is set correctly
         card.animatedValue = end;
      }
   };
   requestAnimationFrame(step);
};

// fetching data from an API
const fetchDashboardData = async () => {
   isLoading.value = true;
   errorMessage.value = null;
   try {
      const summary = await productStore.getSummary();
      if (summary) {
         dashboardCards.value = [
            {
               id: 1,
               title: 'Total Potential Revenue',
               icon: 'lucide:circle-dollar-sign',
               value: summary.potentialRevenue,
               animatedValue: 0, // Initial animated value
               description: 'If all products are sold',
            },
            {
               id: 2,
               title: 'Total Products',
               icon: 'lucide:shopping-cart',
               value: summary.products,
               animatedValue: 0,
               description: 'Total number of products',
            },
            {
               id: 3,
               title: 'Categories',
               icon: 'lucide:folders',
               value: summary.categories,
               animatedValue: 0,
               description: 'Distinct product categories',
            },
            {
               id: 4,
               title: 'Users',
               icon: 'lucide:users',
               value: summary.users,
               animatedValue: 0,
               description: 'Total registered users',
            },
         ];

         // Animate all card values
         dashboardCards.value.forEach((card) => {
            animateValue(card, 0, card.value as number, 3000); // 2-second duration
         });
      } else {
         errorMessage.value = 'Failed to retrieve dashboard summary.';
      }
   } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      errorMessage.value = 'Failed to load dashboard data.';
   } finally {
      isLoading.value = false;
   }
};

// Fetch data when the component is mounted
onMounted(() => {
   fetchDashboardData();
});
</script>

<template>
   <div>
      <!-- Loading State: Display Skeletons -->
      <div v-if="isLoading" class="space-y-4">
         <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <!-- Loop to render 4 Skeleton cards -->
            <div v-for="n in 4" :key="n">
               <Card>
                  <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                     <!-- Skeleton for Icon -->
                     <Skeleton class="h-4 w-40" />
                     <Skeleton class="h-5 w-5 rounded-full" />
                     <!-- Skeleton for Title -->
                  </CardHeader>
                  <CardContent>
                     <!-- Skeleton for Value -->
                     <Skeleton class="h-6 w-20" />
                     <!-- Skeleton for Description -->
                     <Skeleton class="h-4 w-40 mt-2" />
                  </CardContent>
               </Card>
            </div>
         </div>
         <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card class="col-span-4">
               <CardHeader>
                  <span class="flex space-x-2 items-center">
                     <Skeleton class="h-6 w-6 rounded-full" />
                     <Skeleton class="h-6 w-40" />
                  </span>
               </CardHeader>
               <CardContent class="p-4">
                  <Skeleton class="h-[420px] w-full rounded" />
               </CardContent>
            </Card>
            <Card class="col-span-3">
               <CardHeader>
                  <CardTitle> <Skeleton class="h-6 w-40" /></CardTitle>
                  <CardDescription> <Skeleton class="h-5 w-72" /> </CardDescription>
               </CardHeader>
               <CardContent>
                  <div v-for="n in 6" :key="n" class="flex gap-4 items-center">
                     <!-- Skeleton for Image -->
                     <Skeleton class="h-12 w-12 rounded m-2"></Skeleton>

                     <!-- Skeleton for Product Details -->
                     <div class="flex-1 space-y-2">
                        <Skeleton class="h-4 w-3/4 rounded"></Skeleton>
                        <Skeleton class="h-4 w-1/2 rounded"></Skeleton>
                     </div>

                     <!-- Skeleton for Additional Info -->
                     <Skeleton class="h-4 w-1/4 rounded"></Skeleton>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>

      <!-- Error State: Display Error Message -->
      <div v-else-if="errorMessage" class="text-center text-red-500">
         {{ errorMessage }}
      </div>

      <!-- Loaded State: Display Actual Cards -->
      <div v-else class="space-y-4">
         <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card v-for="card in dashboardCards" :key="card.id">
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium">{{ card.title }}</CardTitle>
                  <Icon
                     :icon="card.icon"
                     class="h-5 w-5 text-muted-foreground"
                     aria-label="Icon for {{ card.title }}"
                  />
               </CardHeader>
               <CardContent>
                  <!-- Use animatedValue for the smooth animation -->
                  <div class="text-2xl font-bold">{{ card.animatedValue }}</div>
                  <p class="text-xs text-muted-foreground">{{ card.description }}</p>
               </CardContent>
            </Card>
         </div>
         <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card class="col-span-4">
               <CardHeader>
                  <span class="flex space-x-2">
                     <Icon
                        icon="lucide:bar-chart-2"
                        class="h-6 w-6 text-muted-foreground"
                        aria-label="Bar Chart Icon"
                     />
                     <CardTitle class="text-lg font-medium">Products by Category</CardTitle>
                  </span>
               </CardHeader>
               <CardContent class="p-4">
                  <BarChart :data="products" />
               </CardContent>
            </Card>
            <Card class="col-span-3">
               <CardHeader>
                  <CardTitle class="text-lg font-medium">Recent Products</CardTitle>
                  <CardDescription class="text-sm"> View the latest products added to your inventory. </CardDescription>
               </CardHeader>
               <CardContent>
                  <RecentProducts :products="products" />
               </CardContent>
            </Card>
         </div>
      </div>
   </div>
</template>
