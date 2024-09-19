<script setup lang="ts">
import { defineProps } from 'vue';
import { RouterLink } from 'vue-router';
import { cn } from '@/lib/utils';
import Logo from '@/assets/images/logo.png';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'; // Adjust the path

interface MainNavProps {
   currentRoute: string;
}
defineProps<MainNavProps>();
</script>

<template>
   <nav :class="cn('flex items-center space-x-4 lg:space-x-6', $attrs.class ?? '')">
      <RouterLink to="/dashboard" class="text-sm font-bold transition-colors hover:text-primary flex items-center mr-4">
         <Avatar class="h-6 w-6 mr-2">
            <AvatarImage :src="Logo" alt="Merchant Mind Logo" />
            <AvatarFallback>MM</AvatarFallback>
         </Avatar>
         <span> Merchant Mind </span>
      </RouterLink>
      <RouterLink
         to="/dashboard"
         :class="
            cn('text-sm font-medium transition-colors hover:text-primary', {
               'font-bold': currentRoute === 'Dashboard',
            })
         "
      >
         Dashboard
      </RouterLink>
      <RouterLink
         to="/products"
         :class="
            cn('text-sm font-medium transition-colors hover:text-primary', {
               'font-bold': currentRoute === 'Products',
            })
         "
      >
         Products
      </RouterLink>
      <RouterLink
         to="/categories"
         :class="
            cn('text-sm font-medium transition-colors hover:text-primary', {
               'font-bold': currentRoute === 'Categories',
            })
         "
      >
         Categories
      </RouterLink>
      <RouterLink
         to="/users"
         :class="
            cn('text-sm font-medium transition-colors hover:text-primary', {
               'font-bold': currentRoute === 'Users',
            })
         "
      >
         Users
      </RouterLink>
   </nav>
</template>

<style scoped>
/* Add your styles here */
</style>
