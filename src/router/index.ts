import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const Login = () => import('@/views/LoginView.vue');
const Dashboard = () => import('@/views/DashboardView.vue');
const Products = () => import('@/views/ProductsView.vue');
const Categories = () => import('@/views/CategoriesView.vue');
const Users = () => import('@/views/UsersView.vue');
const Settings = () => import('@/views/SettingsView.vue');

const routes: Array<RouteRecordRaw> = [
   {
      path: '/login',
      name: 'Login',
      component: Login,
   },
   {
      path: '/',
      redirect: '/dashboard',
      meta: { requiresAuth: false },
   },
   {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
   },
   {
      path: '/products',
      name: 'Products',
      component: Products,
      meta: { requiresAuth: true },
   },
   {
      path: '/categories',
      name: 'Categories',
      component: Categories,
      meta: { requiresAuth: true },
   },
   {
      path: '/users',
      name: 'Users',
      component: Users,
      meta: { requiresAuth: true },
   },
   {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: { requiresAuth: true },
   },
   // Optional: Catch-all route for 404 Not Found
   {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard',
   },
];

const router = createRouter({
   history: createWebHistory(),
   routes,
});

// Route Guard (Middleware)
router.beforeEach((to, from, next) => {
   const authStore = useAuthStore();

   console.log('authStore :>> ', authStore);
   console.log('to :>> ', to);

   if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next('/login');
   } else if (to.path === '/login' && authStore.isAuthenticated) {
      next('/dashboard');
   } else {
      next();
   }
});

export default router;
