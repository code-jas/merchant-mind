import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Dynamic imports for route components
const Login = () => import('@/views/LoginView.vue');
const Dashboard = () => import('@/views/DashboardView.vue');
const Products = () => import('@/views/ProductsView.vue');
const Categories = () => import('@/views/CategoriesView.vue');

// Define your routes with meta.layout
const routes: Array<RouteRecordRaw> = [
   {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { layout: 'auth', title: 'Login' },
   },
   {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true, layout: 'main', title: 'Dashboard' },
   },
   {
      path: '/products',
      name: 'Products',
      component: Products,
      meta: { requiresAuth: true, layout: 'main', title: 'Products' },
   },
   {
      path: '/categories',
      name: 'Categories',
      component: Categories,
      meta: { requiresAuth: true, layout: 'main', title: 'Categories' },
   },
   // Optional: Catch-all route for 404 Not Found
   {
      path: '/:pathMatch(.*)*',
      redirect: '/',
   },
];

const router = createRouter({
   history: createWebHistory(),
   routes,
});

// Route Guard (Middleware)
router.beforeEach((to, from, next) => {
   const authStore = useAuthStore();

   if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next('/login');
   } else if (to.path === '/login' && authStore.isAuthenticated) {
      next('/');
   } else {
      next();
   }
});

export default router;
