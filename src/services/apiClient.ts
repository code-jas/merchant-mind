import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const apiClient = axios.create({
   baseURL: 'https://api.escuelajs.co/api/v1',
});

// Request interceptor to add the token
apiClient.interceptors.request.use(
   (config) => {
      const authStore = useAuthStore();
      if (authStore.token) {
         config.headers.Authorization = `Bearer ${authStore.token}`;
      }
      return config;
   },
   (error) => Promise.reject(error)
);

// Optional: Response interceptor to handle errors globally
apiClient.interceptors.response.use(
   (response) => response,
   (error) => {
      // Handle unauthorized errors, refresh tokens, etc.
      return Promise.reject(error);
   }
);

export default apiClient;
