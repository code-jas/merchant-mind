<script setup lang="ts">
import { cn } from '@/lib/utils';
</script>

<template>
   <nav
      :class="
         cn('flex items-center space-x-4 lg:space-x-6', $attrs.class ?? '')
      "
   >
      <a
         href="/dashboard"
         class="text-lg font-medium transition-colors hover:text-primary"
      >
         Dashboard
      </a>
      <a
         href="/products"
         class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
         Products
      </a>
      <a
         href="/categories"
         class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
         Categories
      </a>
      <a
         href="/users"
         class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
         Users
      </a>
   </nav>
</template>
