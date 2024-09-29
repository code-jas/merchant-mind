import type { ColumnDef } from '@tanstack/table-core';
import { h } from 'vue';

// import DataTableRowActions from './DataTableRowActions.vue';
// import { Checkbox } from '@/components/ui/checkbox';
import { Icon } from '@iconify/vue';
import { cn } from '@/lib/utils';
import { Category, Product } from '@/data/schema';
import DataTableColumnHeader from '@/components/common/datatable/DataTableColumnHeader.vue';
import placeholderImage from '@/assets/no-image-placeholder.jpg';

export const columns: ColumnDef<Product>[] = [
   {
      accessorKey: 'id',
      size: 20,
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'ID' }),
      cell: ({ row }) => h('div', { class: '' }, row.getValue('id')),
      enableSorting: true,
      enableHiding: true,
   },
   {
      accessorKey: 'images',
      size: 100, // Adjusted to accommodate the image width plus padding/margin
      header: 'Image', // Singular since we're displaying only one image
      cell: ({ row }) => {
         const images = row.getValue('images') as string[];
         const firstImage = images[0].replace(/^[\["']+|[\]"']+$/g, '');

         if (!firstImage) {
            return h('div', { class: 'w-1/5 flex  items-center' }, [
               h('img', {
                  src: placeholderImage,
                  alt: `No image available for ${row.getValue('title')}`,
                  class: cn('object-cover transition-transform duration-200 ease-in-out hover:scale-105', 'rounded-md'),
                  style: {
                     width: '45px',
                     height: '60px',
                  },
               }),
            ]);
         }
         return h(
            'div',
            { class: 'flex items-center' }, // Center the image within the cell
            [
               h('img', {
                  src: firstImage,
                  alt: `Image for ${row.getValue('title')}`,
                  loading: 'lazy', // Optimizes image loading
                  class: cn(
                     'object-cover transition-transform duration-200 ease-in-out hover:scale-105',
                     'rounded-md' // Adds rounded corners
                  ),
                  style: {
                     width: '45px',
                     height: '60px',
                  },
                  onError: (event: Event) => {
                     const target = event.target as HTMLImageElement;
                     target.src = placeholderImage; // Fallback to placeholder on error
                  },
               }),
            ]
         );
      },
      enableSorting: false,
      enableHiding: true,
   },
   {
      accessorKey: 'title',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Name' }),

      cell: ({ row }) => {
         return h('div', { class: 'flex space-x-2' }, [
            h('span', { class: 'max-w-[500px] w-[500px] truncate font-medium' }, row.getValue('title')),
         ]);
      },
   },
   {
      accessorKey: 'category',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Category' }),
      cell: ({ row }) => {
         const category = row.getValue('category') as Category | undefined;
         const categoryName = category?.name ?? 'No Category';

         return h('div', { class: 'flex space-x-2' }, [
            h('span', { class: 'max-w-[300px] truncate font-medium' }, categoryName),
         ]);
      },
      filterFn: (row, id, value) => {
         const categoryName = (row.getValue(id) as Category)?.name ?? '';
         return value.includes(categoryName);
      },
   },
   {
      accessorKey: 'price',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Price' }),
      cell: ({ row }) => {
         return h(
            'span',
            {
               class: 'inline-flex items-center justify-center bg-purple-100 text-primary text-base px-3 py-1 rounded-full',
            },
            [
               h(Icon, {
                  icon: 'lucide:dollar-sign',
                  class: 'mr-1 h-4 w-4 text-primary',
               }),
               h('span', { class: 'font-semibold' }, `${(row.getValue('price') as number).toFixed(2)}`),
            ]
         );
      },

      filterFn: (row, id, value) => {
         return value.includes(row.getValue(id));
      },
   },
   {
      id: 'actions',
   },
];
