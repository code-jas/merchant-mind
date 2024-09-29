import type { ColumnDef } from '@tanstack/table-core';
import { h } from 'vue';
import DataTableColumnHeader from '@/components/common/datatable/DataTableColumnHeader.vue';
import { cn } from '@/lib/utils';
import placeholderImage from '@/assets/no-image-placeholder.jpg';

export const categoryColumns: ColumnDef<any>[] = [
   {
      accessorKey: 'id',
      size: 20,
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'ID' }),
      cell: ({ row }) => h('div', { class: 'max-w-[20px]' }, row.getValue('id')),
      enableSorting: true,
      enableHiding: true,
   },
   {
      accessorKey: 'image',
      size: 100,
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Image' }),
      cell: ({ row }) => {
         const imageUrl = row.getValue('image') as string;

         return h('div', { class: 'flex items-center' }, [
            h('img', {
               src: imageUrl || placeholderImage,
               alt: `Image for ${row.getValue('name')}`,
               class: cn('object-cover transition-transform duration-200 ease-in-out hover:scale-105', 'rounded-md'),
               style: {
                  width: '45px',
                  height: '60px',
               },
               onError: (event: Event) => {
                  const target = event.target as HTMLImageElement;
                  target.src = placeholderImage;
               },
            }),
         ]);
      },
      enableSorting: false,
      enableHiding: true,
   },
   {
      accessorKey: 'name',
      header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Name' }),
      cell: ({ row }) =>
         h('div', { class: 'flex space-x-2' }, [
            h('span', { class: 'max-w-[400px] w-[400px] truncate font-medium' }, row.getValue('name')),
         ]),
      enableSorting: true,
      enableHiding: true,
   },
   {
      id: 'actions',
      header: 'Actions',
      maxSize: 60,
      size: 60,
   },
];
