import path from 'node:path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
   css: {
      postcss: {
         plugins: [tailwind(), autoprefixer()],
      },
   },
   plugins: [vue()],
   resolve: {
      alias: {
         '@': path.resolve(__dirname, 'src'),
      },
   },
   build: {
      outDir: 'dist', // You can change 'dist' to your preferred output directory
      sourcemap: false, // Set this to false if you don't want .map files generated
      rollupOptions: {
         output: {
            // Customize the output file structure if needed
         },
      },
   },
});
