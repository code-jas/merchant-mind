<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
   className: String,
   imageUrl: String,
});

const computedClass = computed(() =>
   [
      'row-span-1 rounded-xl hover:shadow-xl  transition duration-200 shadow-input overflow-hidden dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent ',
      props.className,
   ].join(' ')
);
</script>

<template>
   <div :class="computedClass">
      <img
         :src="imageUrl"
         alt="Grid Image"
         class="w-full h-full object-cover rounded-xl transition-transform duration-300 transform"
      />
   </div>
</template>
