<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from '@/components/MainLayout.vue';
import AuthLayout from '@/components/AuthLayout.vue'; // Create this component if needed

const route = useRoute();

const layoutComponent = computed(() => {
   const layout = route.meta.layout || 'main';

   if (layout === 'auth') {
      return AuthLayout;
   } else {
      return MainLayout;
   }
});
</script>

<template>
   <div>
      <Toaster />
      <component :is="layoutComponent">
         <router-view />
      </component>
   </div>
</template>

<style scoped></style>
