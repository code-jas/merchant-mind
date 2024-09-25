<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';

const auth = useAuthStore();

const profile = computed(() => auth.user);
</script>

<template>
   <DropdownMenu>
      <DropdownMenuTrigger as-child>
         <Button variant="ghost" class="relative h-8 w-8 rounded-full">
            <Avatar class="h-8 w-8">
               <AvatarImage :src="profile?.avatar || '/default-avatar.png'" alt="@shadcn" />
               <AvatarFallback>SC</AvatarFallback>
            </Avatar>
         </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56" align="end">
         <DropdownMenuLabel class="font-normal flex">
            <div class="flex flex-col space-y-2">
               <p class="text-sm font-medium leading-none">{{ profile?.name }}</p>
               <p class="text-xs leading-none text-muted-foreground">{{ profile?.email }}</p>
            </div>
         </DropdownMenuLabel>
         <DropdownMenuSeparator />
         <DropdownMenuSeparator />
         <DropdownMenuItem> Log out </DropdownMenuItem>
      </DropdownMenuContent>
   </DropdownMenu>
</template>
