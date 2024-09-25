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
import { useToast } from '@/components/ui/toast';

const auth = useAuthStore();
const { toast } = useToast();

const profile = computed(() => auth.user);

// Logout handler
const handleLogout = () => {
   auth.logout();
   toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
   });
};
</script>

<template>
   <DropdownMenu>
      <DropdownMenuTrigger as-child>
         <Button variant="ghost" class="relative h-8 w-8 rounded-full">
            <Avatar class="h-8 w-8">
               <AvatarImage :src="profile?.avatar || '/default-avatar.png'" alt="User Avatar" />
               <AvatarFallback>{{ profile?.name?.charAt(0) || 'U' }}</AvatarFallback>
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
         <DropdownMenuItem @click="handleLogout">Log out</DropdownMenuItem>
      </DropdownMenuContent>
   </DropdownMenu>
</template>
