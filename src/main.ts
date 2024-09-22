import { createApp } from 'vue';
import { createPinia } from 'pinia';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './assets/styles/global.css';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');

import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
authStore.initializeAuth();
