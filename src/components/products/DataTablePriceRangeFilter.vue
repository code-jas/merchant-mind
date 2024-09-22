<script setup lang="ts">
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
import { Icon } from '@iconify/vue';
import { ref, computed, toRefs } from 'vue';
import { PriceRangeFilter } from '@/types';

interface DataTablePriceRangeFilterProps {
   priceRange: PriceRangeFilter;
}

const props = defineProps<DataTablePriceRangeFilterProps>();

const emit = defineEmits(['update:priceRange', 'clearFilter']);

const { priceRange } = toRefs(props);

// Temporary values for min and max
const tempMinPrice = ref(priceRange.value.min);
const tempMaxPrice = ref(priceRange.value.max);

// Validation error message
const errorMessage = ref<string | null>(null);

const priceRangeLabel = computed(() => {
   if (tempMinPrice.value !== undefined && tempMaxPrice.value !== undefined) {
      return `${tempMinPrice.value} - ${tempMaxPrice.value}`;
   }
   return 'Price Range';
});

// Emit updated price range when the Save button is clicked
const savePriceRange = () => {
   errorMessage.value = null; // Reset error message

   // Validation rules
   if (
      (tempMinPrice.value === undefined && tempMaxPrice.value !== undefined) ||
      (tempMinPrice.value !== undefined && tempMaxPrice.value === undefined)
   ) {
      errorMessage.value = 'Both Min and Max must be provided or both must be undefined.';
      return;
   }

   if (
      tempMinPrice.value !== undefined &&
      tempMaxPrice.value !== undefined &&
      tempMinPrice.value > tempMaxPrice.value
   ) {
      errorMessage.value = 'Min price cannot be greater than Max price.';
      return;
   }

   // If valid, emit the updated price range
   emit('update:priceRange', { min: tempMinPrice.value, max: tempMaxPrice.value });
};

// Emit clearFilter event
const clearFilter = () => {
   errorMessage.value = null; // Reset error message
   emit('clearFilter');
};
</script>

<template>
   <Popover>
      <PopoverTrigger as-child>
         <Button variant="outline" size="sm" class="h-8 border-dashed flex items-center space-x-2">
            <!-- Icon for price range -->
            <Icon icon="lucide:dollar-sign" class="h-4 w-4" />
            <!-- Dynamic price range text -->
            <span>{{ priceRangeLabel }}</span>

            <!-- 'X' button to clear filter if the range is set -->
            <Button
               v-if="priceRange.min !== undefined || priceRange.max !== undefined"
               variant="ghost"
               class="h-6 w-6 p-0 ml-2"
               @click="clearFilter"
            >
               <Icon icon="radix-icons:cross-2" class="h-4 w-4" />
            </Button>
         </Button>
      </PopoverTrigger>

      <PopoverContent class="w-[250px] p-4" align="start">
         <div class="flex flex-col space-y-4">
            <div>
               <NumberField v-model="tempMinPrice" id="min" :default-value="undefined" :min="0">
                  <Label for="min" class="mb-2">Min Price</Label>
                  <NumberFieldContent>
                     <NumberFieldDecrement />
                     <NumberFieldInput />
                     <NumberFieldIncrement />
                  </NumberFieldContent>
               </NumberField>
            </div>

            <div>
               <NumberField v-model="tempMaxPrice" id="max" :default-value="undefined" :min="tempMinPrice">
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
