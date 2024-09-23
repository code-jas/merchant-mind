<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/toast/use-toast';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Icon } from '@iconify/vue';

import { useCategoryStore } from '@/stores/categoryStore';

const categoryStore = useCategoryStore();

const props = defineProps<{
   mode: 'create' | 'edit';
   category?: {
      id(id: any, formData: { id?: number; name: string; image: string }): unknown;
      name: string;
      image: string;
   } | null;
   isOpen: boolean;
   onClose: () => void;
}>();

const { mode, category, isOpen, onClose } = props;
const { toast } = useToast();

// Form Schema
const formSchema = toTypedSchema(
   z.object({
      name: z.string().trim().min(1, { message: 'Category Name is required' }),
      image: z.string().url({ message: 'Valid Image URL is required' }),
   })
);

// Initialize form
const { handleSubmit, resetForm, setValues } = useForm({
   validationSchema: formSchema,
   initialValues: {
      name: category?.name || '',
      image: category?.image || '',
   },
});

// Modal Title
const modalTitle = computed(() => (mode === 'create' ? 'Create Category' : 'Edit Category'));

// Submit Button Text
const submitButtonText = computed(() => (mode === 'create' ? 'Create' : 'Update'));

// Submission State
const isSubmitting = ref(false);

// Form Submission Handler
const onSubmit = handleSubmit(async (formData: { id?: number; name: string; image: string }) => {
   isSubmitting.value = true;
   try {
      console.log('formData :>> ', formData);
      if (mode === 'create') {
         await categoryStore.createNewCategory(formData);
      } else if (mode === 'edit' && category) {
         await categoryStore.updateExistingCategory(Number(category.id), formData);
      }
      toast({
         title: 'Success',
         description: mode === 'create' ? 'Category created successfully.' : 'Category updated successfully.',
      });
      resetForm();
      onClose();
   } catch (error: any) {
      console.error(error.message);
      toast({
         title: 'Error',
         description: error.message || 'An error occurred.',
      });
   } finally {
      isSubmitting.value = false;
   }
});

// Reset form when modal is closed or opened
watch(
   () => isOpen,
   (newVal) => {
      if (!newVal) {
         resetForm();
      } else if (mode === 'edit' && category) {
         setValues({
            name: category.name || '',
            image: category.image || '',
         });
      }
   }
);
</script>

<template>
   <Dialog v-model:open="isOpen">
      <DialogContent class="sm:max-w-[400px]">
         <DialogHeader>
            <DialogTitle>{{ modalTitle }}</DialogTitle>
            <DialogDescription>
               {{
                  mode === 'create'
                     ? 'Fill in the details to create a new category.'
                     : 'Update the category details below.'
               }}
            </DialogDescription>
         </DialogHeader>

         <form @submit="onSubmit">
            <div class="space-y-4">
               <!-- Name -->
               <FormField name="name" v-slot="{ field }">
                  <FormItem>
                     <FormLabel>Category Name</FormLabel>
                     <FormControl>
                        <Input v-bind="field" placeholder="Category Name" />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               </FormField>

               <!-- Image URL -->
               <FormField name="image" v-slot="{ field }">
                  <FormItem>
                     <FormLabel>Image URL</FormLabel>
                     <FormControl>
                        <Input v-bind="field" placeholder="https://example.com/image.jpg" />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               </FormField>
            </div>

            <DialogFooter class="mt-6">
               <Button type="button" variant="secondary" @click="onClose"> Cancel </Button>
               <Button type="submit" :disabled="isSubmitting">
                  <span v-if="isSubmitting">
                     <Icon icon="radix-icons:spinner-circular" class="animate-spin mr-2" />
                     {{ submitButtonText }}
                  </span>
                  <span v-else>
                     {{ submitButtonText }}
                  </span>
               </Button>
            </DialogFooter>
         </form>
      </DialogContent>
   </Dialog>
</template>
