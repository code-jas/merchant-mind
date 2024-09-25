export interface Category {
   id: number;
   name: string;
   image: string;
   creationAt: string;
   updatedAt: string;
}

export interface Product {
   id: number;
   categoryId?: number;
   title: string;
   price: number;
   description: string;
   images: string[];
   creationAt: string;
   updatedAt: string;
   category: Category;
}

export interface User {
   id: number;
   email: string;
   password: string;
   name: string;
   role: 'admin' | 'customer';
   avatar: string;
   creationAt: string;
   updatedAt: string;
}

export interface LoginCredentials {
   email: string;
   password: string;
}

export interface LoginResponse {
   access_token: string;
   refresh_token?: string;
}

export interface PriceRangeFilter {
   min: number | undefined;
   max: number | undefined;
}

export interface Filters {
   title?: string;
   priceRange?: PriceRangeFilter | undefined;
}

export interface DashboardSummary {
   potentialRevenue: number;
   products: number;
   categories: number;
   users: number;
}
