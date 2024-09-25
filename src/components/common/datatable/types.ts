import { ColumnDef } from '@tanstack/vue-table';
import { JSX } from 'vue/jsx-runtime';

export interface Column<T> {
   key: keyof T; // The key of the data property
   label: string; // The header label
   sortable?: boolean; // Whether the column is sortable
   // Optional: You can add a custom render function for complex rendering
   render?: (row: T) => string | JSX.Element;
}

export interface DataTableProps<T> {
   data: T[];
   columns: ColumnDef<T, any>[];
   filters?: Record<string, any>;
   totalItems?: number;
   manualPagination?: boolean;
   offset?: number;
   limit?: number;
   loading: boolean;
   actions?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface DataTableEvents<T, K extends keyof T> {
   'page-change': (newOffset: number) => void;
   'page-size-change': (newLimit: number) => void;
   'filter-change'?: (filters: Record<string, any>) => void;
   create: () => void;
   view: (item: T) => void;
   edit: (item: T) => void;
   copy?: (item: T) => void;
   delete: (itemId: number) => void; // Adjust the type based on your ID type
}
