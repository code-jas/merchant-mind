<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DateRangePicker from './layout/DateRangePicker.vue';
import MainNav from './layout/MainNav.vue';
import Search from './layout/Search.vue';
import UserNav from './layout/UserNav.vue';

import { Button } from '@/components/ui/button';

const route = useRoute();
const pageTitle = ref('Dashboard');

onMounted(() => {
   // Update pageTitle based on the current route if needed
   console.log('route.meta.title :>> ', route.meta.title);
   pageTitle.value =
      typeof route.meta.title === 'string' ? route.meta.title : 'Dashboard';
});
</script>

<template>
   <div class="flex flex-col">
      <div class="border-b">
         <!-- Available to all -->
         <div class="flex h-16 items-center px-4">
            <MainNav class="mx-6" />
            <div class="ml-auto flex items-center space-x-4">
               <Search />
               <UserNav />
            </div>
         </div>
      </div>
      <div class="flex-1 space-y-4 p-8 pt-6">
         <!-- Content -->
         <div class="flex items-center justify-between space-y-2">
            <h2 class="text-3xl font-bold tracking-tight">
               {{ pageTitle }}
            </h2>
            <div class="flex items-center space-x-2">
               <DateRangePicker />
               <Button>Download</Button>
            </div>
         </div>
         <slot />
      </div>
   </div>
</template>

<style scoped>
/* Add your styles here */
</style>
