import { defineStore } from 'pinia';
import { login as loginService, getProfile } from '@/services/authService';
import { LoginCredentials, User } from '@/types';
import router from '@/router';
import { useToast } from '@/components/ui/toast';
const { toast } = useToast();

interface AuthState {
   user: User | null;
   token: string | null;
}

export const useAuthStore = defineStore('auth', {
   state: (): AuthState => ({
      user: null,
      token: null,
   }),
   getters: {
      isAuthenticated: (state): boolean => !!state.token,
   },
   actions: {
      async login(credentials: LoginCredentials) {
         try {
            const response = await loginService(credentials);
            this.token = response.access_token;
            localStorage.setItem('token', this.token);

            // Optionally, fetch user profile
            this.user = await getProfile();
            console.log('this.user :>> ', this.user);

            // Redirect to dashboard
            router.push('/dashboard');

            toast({
               title: 'Login Successful',
               description: 'You have successfully logged in.',
            });
         } catch (error: any) {
            console.error('Login error:', error);

            let message = 'An error occurred during login.';

            // Check for Axios error and handle 401 Unauthorized error
            if (error.response && error.response.status === 401) {
               message = 'Unauthorized: Incorrect username or password.';
            } else if (error.message) {
               message = error.message; // Fallback to the error message if available
            }

            toast({
               title: 'Login Failed',
               description: message,
               variant: 'destructive',
            });
         }
      },
      logout() {
         this.token = null;
         this.user = null;
         localStorage.removeItem('token');
         router.push('/login');
      },
      initializeAuth() {
         const token = localStorage.getItem('token');
         if (token) {
            this.token = token;
            // Optionally, fetch user profile
            getProfile()
               .then((user) => {
                  this.user = user;
               })
               .catch(() => {
                  this.logout();
               });
         }
      },
   },
});
