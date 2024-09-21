// This file is used to declare types for Vite

// resolve .vue file imports
declare module '*.vue' {
   import { DefineComponent } from 'vue';
   const component: DefineComponent<{}, {}, any>;
   export default component;
}

// resolve image imports
declare module '*.png' {
   const value: string;
   export default value;
}

declare module '*.svg' {
   const value: string;
   export default value;
}
declare module '*.jpg' {
   const value: string;
   export default value;
}
