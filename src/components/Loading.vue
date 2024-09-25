<script lang="ts" setup>
import { Icon } from '@iconify/vue';
</script>

<template>
   <div class="flex items-center justify-center flex-col h-[500px] space-y-6">
      <Icon icon="lucide:shopping-bag" class="w-24 h-24 text-primary animate-bounce" />
      <p class="loading-text font-semibold text-2xl">Loading...</p>
   </div>
</template>

<style scoped>
/* Bounce Animation for Icon */
@keyframes bounce {
   0%,
   20%,
   50%,
   80%,
   100% {
      transform: translateY(0);
   }
   40% {
      transform: translateY(-30px);
   }
   60% {
      transform: translateY(-15px);
   }
}
.animate-bounce {
   animation: bounce 2s infinite;
}

/* Loading Text with Animated Gradient */
.loading-text {
   background: linear-gradient(90deg, #884dee 0%, #dd0fe4 100%);
   background-size: 200% 100%;
   -webkit-background-clip: text;
   -webkit-text-fill-color: transparent;
   animation: text-gradient 3s ease infinite;
}
@keyframes text-gradient {
   0% {
      background-position: 0% 50%;
   }
   50% {
      background-position: 100% 50%;
   }
   100% {
      background-position: 0% 50%;
   }
}
</style>
