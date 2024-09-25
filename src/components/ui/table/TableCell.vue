<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';
import Skeleton from '../skeleton/Skeleton.vue';

const props = defineProps<{
   class?: HTMLAttributes['class'];
   loading?: boolean;
}>();
</script>

<template>
   <td :class="cn('p-3 align-middle [&:has([role=checkbox])]:pr-0', props.class)">
      <Skeleton v-if="loading" class="w-full h-full rounded-xl" />
      <slot v-else />
   </td>
</template>
