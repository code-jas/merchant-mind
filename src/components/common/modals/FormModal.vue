<script setup lang="ts">
// Import necessary functions and types
import { ref, computed, onMounted, watch, toRefs } from 'vue';
import { useFieldArray, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { Icon } from '@iconify/vue';
// Stores
import { useProductStore } from '@/stores/productStore';
// Components
import { useToast } from '@/components/ui/toast/use-toast';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Product } from '@/types';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';

const props = defineProps<{
   mode: 'create' | 'edit';
   product?: Product | null;
   isOpen: boolean;
}>();

const emit = defineEmits(['close']);

const { mode, product, isOpen } = toRefs(props);

const productStore = useProductStore();
const { toast } = useToast();

// Fetch categories on mount if not already fetched
onMounted(() => {
   if (productStore.categories.length === 0) {
      productStore.fetchCategories();
   }
});

const categories = computed(() => productStore.categories.map((e) => ({ name: e.name, value: e.id.toString() })));

// Form Schema for validation
const formSchema = toTypedSchema(
   z.object({
      categoryId: z.preprocess((val) => Number(val), z.number().int().nonnegative({ message: 'Category is required' })),
      title: z.string().trim().min(1, { message: 'Product Title is required' }),
      price: z.number().min(0, { message: 'Price must be a positive number' }),
      description: z.string().trim().min(1, { message: 'Description is required' }),
      images: z.array(z.string()).min(1, { message: 'At least one image is required' }),
   })
);

// Initialize form
const { handleSubmit, resetForm, setValues } = useForm({
   validationSchema: formSchema,
   initialValues: {
      categoryId: product.value?.categoryId ? product.value.categoryId.toString() : '',
      title: product.value?.title || '',
      price: product.value?.price || 0,
      description: product.value?.description || '',
      images: product.value?.images.length ? [...product.value.images] : ['https://picsum.photos/200/300?random=1'],
   },
});

const addImage = () => {
   push('https://picsum.photos/200/300?random=1');
};

const removeImage = (index: number) => {
   remove(index);
};
const { fields: imageFields, remove, push } = useFieldArray('images');

const modalTitle = computed(() => (mode.value === 'create' ? 'Create Product' : 'Edit Product'));
const modalDescription = computed(() =>
   mode.value === 'create' ? 'Fill in the details to create a new product.' : 'Update the product details below.'
);

const submitButtonText = computed(() => (mode.value === 'create' ? 'Create' : 'Update'));

const isSubmitting = ref(false);

const onSubmit = handleSubmit(
   async (formData: { title: string; description: string; categoryId: number; price: number; images: string[] }) => {
      isSubmitting.value = true;
      try {
         console.log('formData :>> ', formData);
         if (mode.value === 'create') {
            await productStore.createProduct(formData);
            toast({
               title: 'Success',
               description: 'Product created successfully.',
            });
         } else if (mode.value === 'edit' && product) {
            if (product.value) {
               await productStore.updateProduct(product.value.id, formData);
            }
            toast({
               title: 'Success',
               description: 'Product updated successfully.',
            });
         }
         resetForm();
         emit('close');
      } catch (error: any) {
         console.error(error.message);
         toast({
            title: 'Error',
            description: error.message || 'An error occurred.',
         });
      } finally {
         isSubmitting.value = false;
      }
   }
);

const onClose = () => {
   isOpen.value = false;
   console.log('isOpen :>> ', isOpen.value);
   console.log('props.isOpen :>> ', props.isOpen);
   emit('close');
};

// Reset form when modal is closed or opened
watch(
   isOpen,
   (newVal) => {
      console.log('newVal :>> ', newVal);
      if (!newVal) {
         resetForm();
      } else if (mode.value === 'edit' && product) {
         setValues({
            categoryId: product.value?.categoryId || 0,
            title: product.value?.title || '',
            price: product.value?.price || 0,
            description: product.value?.description || '',
            images: product.value?.images.length ? [...product.value.images] : [''],
         });
      }
   },
   { immediate: true, deep: true }
);
</script>

<template>
   <Dialog v-model:open="isOpen">
      <DialogContent class="sm:max-w-[600px] flex flex-row h-4/5">
         <form @submit="onSubmit" class="flex flex-col gap-4 relative w-full">
            <DialogHeader>
               <DialogTitle>{{ modalTitle }}</DialogTitle>
               <DialogDescription>
                  {{ modalDescription }}
               </DialogDescription>
            </DialogHeader>
            <ScrollArea>
               <div class="mx-3 space-y-4">
                  <!-- Category Selection -->
                  <FormField name="categoryId" v-slot="{ field }">
                     <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                           <Select v-bind="field">
                              <SelectTrigger>
                                 <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectGroup>
                                    <SelectLabel>Categories</SelectLabel>
                                    <SelectItem
                                       v-for="category in categories"
                                       :key="category.value"
                                       :value="category.value"
                                    >
                                       {{ category.name }}
                                    </SelectItem>
                                 </SelectGroup>
                              </SelectContent>
                           </Select>
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  </FormField>

                  <!-- Title -->
                  <FormField name="title" v-slot="{ field }" class="mx-2">
                     <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                           <Input v-bind="field" v-model:model-value="field.value" placeholder="Product Title" />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  </FormField>

                  <!-- Price -->
                  <FormField name="price" v-slot="{ field }">
                     <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                           <Input
                              type="number"
                              v-bind="field"
                              v-model:model-value="field.value"
                              placeholder="Product Price"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  </FormField>

                  <!-- Description -->
                  <FormField name="description" v-slot="{ field }">
                     <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                           <Textarea
                              v-bind="field"
                              v-model:model-value="field.value"
                              placeholder="Product Description"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  </FormField>

                  <!-- Images -->
                  <FormField name="images" v-slot="{ field }">
                     <FormItem>
                        <FormLabel>Images</FormLabel>
                        <FormControl>
                           <div class="space-y-2">
                              <!-- Image Inputs -->
                              <div
                                 v-for="(image, index) in imageFields"
                                 :key="image.key"
                                 class="flex items-center space-x-2"
                              >
                                 {{ field.value[index] }}
                                 <Input
                                    type="text"
                                    placeholder="Image"
                                    :value="field.value[index]"
                                    v-model:model-value="field.value[index]"
                                 />
                                 <Button variant="ghost" color="red" size="sm" @click="removeImage(index)">
                                    <Icon icon="radix-icons:trash" />
                                 </Button>
                              </div>
                              <Button variant="outline" size="sm" @click="addImage">
                                 <Icon icon="radix-icons:plus" class="mr-2" />
                                 Add Image
                              </Button>
                           </div>
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  </FormField>
                  <div class="grid grid-cols-3 gap-4" v-if="imageFields.length">
                     <div v-for="(image, index) in imageFields" :key="index" class="relative">
                        <img
                           :src="image.value as string"
                           alt="Product Image"
                           class="w-full h-32 object-cover rounded-md"
                        />
                        <Button
                           variant="ghost"
                           color="red"
                           size="sm"
                           class="absolute top-2 right-2"
                           @click="removeImage(index)"
                        >
                           <Icon icon="radix-icons:trash" />
                        </Button>
                     </div>
                  </div>
               </div>
            </ScrollArea>
            <DialogFooter class="flex flex-col md:flex-row gap-2">
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
