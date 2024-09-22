<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { useProductStore } from '@/stores/productStore';
import { useToast } from '@/components/ui/toast/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
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
import { Textarea } from '@/components/ui/textarea';
import { Icon } from '@iconify/vue';
import { Product } from '@/types';

const props = defineProps<{
   mode: 'create' | 'edit';
   product?: Product;
   isOpen: boolean;
   onClose: () => void;
}>();

const { mode, product, isOpen, onClose } = props;

const productStore = useProductStore();
const { toast } = useToast();

// Fetch categories on mount if not already fetched
onMounted(() => {
   if (productStore.categories.length === 0) {
      productStore.fetchCategories();
   }
});

// Computed property for categories
const categories = computed(() => productStore.categories);

// Form Schema with preprocessing for categoryId
const formSchema = toTypedSchema(
   z.object({
      categoryId: z.preprocess((val) => Number(val), z.number().int().nonnegative({ message: 'Category is required' })),
      title: z.string().trim().min(1, { message: 'Product Title is required' }),
      price: z.number().min(0, { message: 'Price must be a positive number' }),
      description: z.string().trim().min(1, { message: 'Description is required' }),
      images: z.array(z.string().url({ message: 'Invalid URL' })).min(1, { message: 'At least one image is required' }),
   })
);

// Initialize form
const { handleSubmit, resetForm, values, errors, setValues, setFieldValue } = useForm({
   validationSchema: formSchema,
   initialValues: {
      categoryId: product?.categoryId ? product.categoryId.toString() : '',
      title: product?.title || '',
      price: product?.price || 0,
      description: product?.description || '',
      images: product?.images.length ? [...product.images] : [''],
   },
});

// Modal Title and Description
const modalTitle = computed(() => (mode === 'create' ? 'Create Product' : 'Edit Product'));
const modalDescription = computed(() =>
   mode === 'create' ? 'Fill in the details to create a new product.' : 'Update the product details below.'
);

// Submit Button Text
const submitButtonText = computed(() => (mode === 'create' ? 'Create' : 'Update'));

// Submission State
const isSubmitting = ref(false);

// Images Handling
const images = computed({
   get: () => values.images,
   set: (val: string[]) => setFieldValue('images', val),
});
const validImageUrls = ref<string[]>([]);

// Helper to validate URL
const isValidUrl = (url: string) => {
   try {
      new URL(url);
      return true;
   } catch {
      return false;
   }
};

// Watch images and validate
watch(
   images,
   (newImages) => {
      validImageUrls.value = newImages.filter((url) => isValidUrl(url));
   },
   { immediate: true }
);

// Validate individual image URL
const validateImage = (index: number) => {
   const url = images.value[index];
   if (isValidUrl(url)) {
      if (!validImageUrls.value.includes(url)) {
         validImageUrls.value.push(url);
      }
   } else {
      validImageUrls.value = validImageUrls.value.filter((u) => u !== url);
   }
};

// Add a new image URL input
const addImage = () => {
   setFieldValue('images', [...images.value, '']); // Add a new empty string to the images array
};

// Remove an image URL input
const removeImage = (index: number) => {
   const newImages = [...images.value];
   const removedUrl = newImages.splice(index, 1)[0]; // Retrieve the URL before splicing
   setFieldValue('images', newImages); // Update the form's images array
   validImageUrls.value = validImageUrls.value.filter((u) => u !== removedUrl); // Remove the URL from validImageUrls
};

// Remove a valid image preview
const removeValidImage = (url: string) => {
   const index = images.value.indexOf(url);
   if (index !== -1) {
      const newImages = [...images.value];
      newImages.splice(index, 1);
      setFieldValue('images', newImages);
      validImageUrls.value = validImageUrls.value.filter((u) => u !== url);
   }
};

// Form Submission Handler
const onSubmit = handleSubmit(async (formData: Product) => {
   isSubmitting.value = true;
   try {
      if (mode === 'create') {
         await productStore.createProduct(formData);
         toast({
            title: 'Success',
            description: 'Product created successfully.',
         });
      } else if (mode === 'edit' && product) {
         await productStore.updateProduct(product.id, formData);
         toast({
            title: 'Success',
            description: 'Product updated successfully.',
         });
      }
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
         validImageUrls.value = [];
      } else if (mode === 'edit' && product) {
         setValues({
            categoryId: product.categoryId || 0,
            title: product.title,
            price: product.price,
            description: product.description,
            images: product.images.length ? [...product.images] : [''],
         });
      }
   }
);
</script>

<template>
   <Dialog v-model:open="isOpen">
      <DialogContent class="sm:max-w-[600px]">
         <DialogHeader>
            <DialogTitle>{{ modalTitle }}</DialogTitle>
            <DialogDescription>
               {{ modalDescription }}
            </DialogDescription>
         </DialogHeader>

         <form @submit="onSubmit">
            <div class="space-y-4">
               <!-- Category Selection -->
               <FormField name="categoryId" v-slot="{ field }">
                  <FormItem>
                     <FormLabel>Category</FormLabel>
                     <FormControl>
                        <Select v-model="field.value">
                           <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectGroup>
                                 <SelectLabel>Categories</SelectLabel>
                                 <SelectItem
                                    v-for="category in categories"
                                    :key="category.id"
                                    :value="category.id.toString()"
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
               <FormField name="title" v-slot="{ field }">
                  <FormItem>
                     <FormLabel>Title</FormLabel>
                     <FormControl>
                        <Input v-bind="field" placeholder="Product Title" />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               </FormField>

               <!-- Price -->
               <FormField name="price" v-slot="{ field }">
                  <FormItem>
                     <FormLabel>Price</FormLabel>
                     <FormControl>
                        <Input type="number" v-bind="field" placeholder="Product Price" />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               </FormField>

               <!-- Description -->
               <FormField name="description" v-slot="{ field }">
                  <FormItem>
                     <FormLabel>Description</FormLabel>
                     <FormControl>
                        <Textarea v-bind="field" placeholder="Product Description" />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               </FormField>

               <!-- Images -->
               <FormField name="images">
                  <FormItem>
                     <FormLabel>Images</FormLabel>
                     <FormControl>
                        <div class="space-y-2">
                           <!-- Image URL Inputs -->
                           <div v-for="(image, index) in images" :key="index" class="flex items-center space-x-2">
                              <Input
                                 type="url"
                                 placeholder="Image URL"
                                 :value="images?.[index]"
                                 @input="
                                    (event: any) => {
                                       setFieldValue(`images.${index}`, event.target.value);
                                       validateImage(index);
                                    }
                                 "
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

               <!-- Image Previews -->
               <div class="grid grid-cols-3 gap-4" v-if="validImageUrls.length">
                  <div v-for="(url, index) in validImageUrls" :key="index" class="relative">
                     <img :src="url" alt="Product Image" class="w-full h-32 object-cover rounded-md" />
                     <Button
                        variant="ghost"
                        color="red"
                        size="sm"
                        class="absolute top-2 right-2"
                        @click="removeValidImage(url)"
                     >
                        <Icon icon="radix-icons:trash" />
                     </Button>
                  </div>
               </div>
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
