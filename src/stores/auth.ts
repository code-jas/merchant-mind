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
      isAdmin: (state): boolean => state.user?.role === 'admin',
   },
   actions: {
      async login(credentials: LoginCredentials) {
         try {
            const response = await loginService(credentials);
            this.token = response.access_token;
            localStorage.setItem('token', this.token);

            // Fetch user profile
            this.user = await getProfile();
            console.log('Logged in user:', this.user);

            // Validate user role
            if (this.user.role !== 'admin') {
               throw new Error('Access denied: Admins only.');
            }

            // Redirect to dashboard
            router.push('/dashboard');

            toast({
               title: 'Login Successful',
               description: 'You have successfully logged in as an admin.',
            });
         } catch (error: any) {
            console.error('Login error:', error);

            let message = 'An error occurred during login.';

            // Handle specific error messages
            if (error.response && error.response.status === 401) {
               message = 'Unauthorized: Incorrect username or password.';
            } else if (error.message) {
               message = error.message; // Fallback to the error message if available
            }

            // If role validation fails, perform logout
            if (message === 'Access denied: Admins only.') {
               this.logout();
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
         toast({
            title: 'Logged Out',
            description: 'You have been successfully logged out.',
         });
      },
      async initializeAuth() {
         const token = localStorage.getItem('token');
         if (token) {
            this.token = token;
            try {
               // Fetch user profile
               this.user = await getProfile();

               // Optionally, validate user role upon initialization
               if (this.user.role !== 'admin') {
                  throw new Error('Access denied: Admins only.');
               }
            } catch (error) {
               console.error('Initialization error:', error);
               this.logout();
               toast({
                  title: 'Access Denied',
                  description: 'You do not have permission to access this application.',
                  variant: 'destructive',
               });
            }
         }
      },
   },
});
