<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { loginSchema, LoginSchema } from '@/validation/loginSchema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const authStore = useAuthStore();
const router = useRouter();

const { handleSubmit, values, errors } = useForm<LoginSchema>({
   validationSchema: toTypedSchema(loginSchema),
   initialValues: {
      email: 'admin@mail.com',
      password: 'admin123',
   },
});

// // Default values for demo purposes
// const email = ref<string>('demo@example.com');
// const password = ref<string>('password');

const onSubmit = handleSubmit(async (formValues) => {
   try {
      console.log('formValues :>> ', formValues);
      await authStore.login(formValues);
      router.push('/dashboard');
   } catch (error: any) {
      console.log('login error :>> ', error);

      console.log('test');
   }
});
</script>

<template>
   <div class="flex items-center justify-center flex-col min-h-screen bg-gray-100">
      <!-- <Toaster /> -->

      <Card class="w-96">
         <CardHeader class="space-y-1">
            <CardTitle class="text-2xl font-bold text-center"> Welcome back </CardTitle>
            <CardDescription class="text-center text-sm"> Access your admin dashboard </CardDescription>
         </CardHeader>
         <form @submit.prevent="onSubmit" class="space-y-4">
            <!-- <form @submit.prevent="handleLogin" class="space-y-4"> -->
            <CardContent class="grid gap-4">
               <FormField name="email" v-slot="{ field }">
                  <FormItem>
                     <FormLabel>Email</FormLabel>
                     <FormControl>
                        <Input type="email" v-bind="field" placeholder="Enter your email" />
                     </FormControl>
                     <FormMessage>{{ errors.email }}</FormMessage>
                  </FormItem>
               </FormField>
               <FormField name="password" v-slot="{ field }">
                  <FormItem>
                     <FormLabel>Password</FormLabel>
                     <FormControl>
                        <Input type="password" v-bind="field" placeholder="Enter your password" />
                     </FormControl>
                     <FormMessage>{{ errors.password }}</FormMessage>
                  </FormItem>
               </FormField>
            </CardContent>
            <CardFooter>
               <Button type="submit" class="w-full">Login</Button>
            </CardFooter>
         </form>
      </Card>

      {{ values }}
   </div>
</template>

<style scoped></style>
