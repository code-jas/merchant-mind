<script setup lang="ts">
import { ref, computed, watch, toRefs } from 'vue';
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
import { Category } from '@/data/schema';

const categoryStore = useCategoryStore();

interface CategoriesFormModalProps {
   mode: 'create' | 'edit';
   category?: Category | null;
   isOpen: boolean;
   onClose: () => void;
}

const props = defineProps<CategoriesFormModalProps>();

const { mode, category, isOpen, onClose } = toRefs(props);
const { toast } = useToast();

// Form Schema
const formSchema = toTypedSchema(
   z.object({
      name: z.string().trim().min(1, { message: 'Category Name is required' }),
      image: z.string().url({ message: 'Valid Image URL is required' }),
   })
);

// Initialize form
const { handleSubmit, resetForm, setValues, values } = useForm({
   validationSchema: formSchema,
   initialValues: {
      name: category.value?.name || '',
      image: category.value?.image || '',
   },
});

// Modal Title
const modalTitle = computed(() => (mode.value === 'create' ? 'Create Category' : 'Edit Category'));

// Submit Button Text
const submitButtonText = computed(() => (mode.value === 'create' ? 'Create' : 'Update'));

// Submission State
const isSubmitting = ref(false);

// Form Submission Handler
const onSubmit = handleSubmit(async (formData: { id?: number; name: string; image: string }) => {
   isSubmitting.value = true;
   try {
      console.log('formData :>> ', formData);
      console.log('mode :>> ', mode);
      console.log('category :>> ', category);
      if (mode.value === 'create') {
         await categoryStore.createNewCategory(formData);
      } else if (mode.value === 'edit' && category) {
         console.log('edit :>> ', category);
         if (category.value) {
            await categoryStore.updateExistingCategory(Number(category.value.id), formData);
         }
      }
      toast({
         title: 'Success',
         description: mode.value === 'create' ? 'Category created successfully.' : 'Category updated successfully.',
      });
      resetForm();
      onClose.value();
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
   isOpen,
   (newVal) => {
      console.log('category watch :>> ', category);
      if (!newVal) {
         resetForm();
      } else if (mode.value === 'edit' && category.value) {
         setValues({
            name: category.value.name || '',
            image: category.value.image || '',
         });

         console.log('values :>> ', values);
      }
   },
   { immediate: true, deep: true }
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
                        <Input v-bind="field" v-model:model-value="field.value" placeholder="Category Name" />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               </FormField>

               <!-- Image URL -->
               <FormField name="image" v-slot="{ field }">
                  <FormItem>
                     <FormLabel>Image URL</FormLabel>
                     <FormControl>
                        <Input
                           v-bind="field"
                           v-model:model-value="field.value"
                           placeholder="https://example.com/image.jpg"
                        />
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
