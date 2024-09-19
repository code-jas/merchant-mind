// This file is used to declare types for Vite

// resolve .vue file imports
declare module '*.vue' {
   import { DefineComponent } from 'vue';
   // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unsafe-any
   const component: DefineComponent<{}, {}, any>;
   export default component;
}

// resolve image imports
declare module '*.png' {
   const value: string;
   export default value;
}
