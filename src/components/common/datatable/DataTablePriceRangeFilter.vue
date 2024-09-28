<script setup lang="ts">
import { ref, computed, toRefs, watch } from 'vue';
import { Icon } from '@iconify/vue';

import { PriceRangeFilter } from '@/types';

import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
   NumberField,
   NumberFieldContent,
   NumberFieldDecrement,
   NumberFieldIncrement,
   NumberFieldInput,
} from '@/components/ui/number-field';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DataTablePriceRangeFilterProps {
   priceRange: PriceRangeFilter;
}

const props = defineProps<DataTablePriceRangeFilterProps>();

const emit = defineEmits(['update:priceRange', 'clearFilter']);

const { priceRange } = toRefs(props);

const isPopoverOpen = ref(false);
const tempMinPrice = ref<number | null>(priceRange.value.min);
const tempMaxPrice = ref<number | null>(priceRange.value.max);

// Watch for changes in the priceRange prop to update temporary values
watch(
   () => props.priceRange,
   (newPriceRange) => {
      tempMinPrice.value = newPriceRange.min;
      tempMaxPrice.value = newPriceRange.max;
   },
   { deep: true }
);

// Validation error message
const errorMessage = ref<string | null>(null);

const isRangeHasValue = computed(
   () =>
      tempMinPrice.value || tempMinPrice.value !== undefined || tempMaxPrice.value || tempMaxPrice.value !== undefined
);
const priceRangeLabel = computed(() => {
   if (isRangeHasValue.value) {
      return `${tempMinPrice?.value || ''} - ${tempMaxPrice?.value || ''}`;
   }
   return '';
});

// Emit updated price range when the Save button is clicked
const savePriceRange = () => {
   errorMessage.value = null; // Reset error message

   // Validation rules
   if (
      (tempMinPrice.value === null && tempMaxPrice.value !== null) ||
      (tempMinPrice.value !== null && tempMaxPrice.value === null)
   ) {
      errorMessage.value = 'Both Min and Max must be provided or both must be empty.';
      return;
   }

   if (tempMinPrice.value !== null && tempMaxPrice.value !== null && tempMinPrice.value > tempMaxPrice.value) {
      errorMessage.value = 'Min price cannot be greater than Max price.';
      return;
   }

   // If valid, emit the updated price range
   emit('update:priceRange', { min: tempMinPrice.value, max: tempMaxPrice.value });
   isPopoverOpen.value = false;
};

// Emit clearFilter event
const clearFilter = () => {
   errorMessage.value = null; // Reset error message
   tempMinPrice.value = undefined;
   tempMaxPrice.value = undefined;
   savePriceRange();
};
</script>

<template>
   <Popover v-model:open="isPopoverOpen">
      <PopoverTrigger as-child>
         <Button
            variant="outline"
            size="sm"
            class="h-8 border-dashed flex items-center space-x-2"
            @click="isPopoverOpen = true"
         >
            <Icon icon="lucide:dollar-sign" class="h-4 w-4" />
            <span> Price Range</span>
            <template v-if="isRangeHasValue">
               <Separator orientation="vertical" class="mx-2 h-4" />
               <Badge variant="secondary" class="rounded-sm px-1 font-normal"> {{ priceRangeLabel }} </Badge>
            </template>
         </Button>
      </PopoverTrigger>

      <!-- 'X' button placed outside the PopoverTrigger -->

      <PopoverContent class="w-[250px] p-4" align="start">
         <div class="flex justify-end">
            <Button
               v-if="isRangeHasValue"
               variant="ghost"
               class="h-6 p-3"
               @click="clearFilter"
               aria-label="Clear Price Range Filter"
            >
               <Icon icon="radix-icons:cross-2" class="h-4 w-4 mr-1" /> <span>Clear</span>
            </Button>
         </div>
         <div class="flex flex-col space-y-4">
            <div>
               <NumberField v-model="tempMinPrice" id="min" :default-value="null" :min="0">
                  <Label for="min" class="mb-2">Min Price</Label>
                  <NumberFieldContent>
                     <NumberFieldDecrement />
                     <NumberFieldInput />
                     <NumberFieldIncrement />
                  </NumberFieldContent>
               </NumberField>
            </div>

            <div>
               <NumberField v-model="tempMaxPrice" id="max" :default-value="null" :min="tempMinPrice">
                  <Label for="max" class="mb-2">Max Price</Label>
                  <NumberFieldContent>
                     <NumberFieldDecrement />
                     <NumberFieldInput />
                     <NumberFieldIncrement />
                  </NumberFieldContent>
               </NumberField>
            </div>

            <!-- Error Message Display -->
            <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>

            <!-- Save Button -->
            <Button class="w-full mt-4" @click="savePriceRange"> Save </Button>
         </div>
      </PopoverContent>
   </Popover>
</template>
