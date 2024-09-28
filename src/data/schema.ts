import { z } from 'zod';

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
   id: z.string(),
   title: z.string(),
   status: z.string(),
   label: z.string(),
   priority: z.string(),
});

export type Task = z.infer<typeof taskSchema>;

export const categorySchema = z.object({
   id: z.number(),
   name: z.string(),
   image: z.string().url(), // Ensures the image is a valid URL
   creationAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid creationAt date format',
   }),
   updatedAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid updatedAt date format',
   }),
});

// Optional: Infer the TypeScript type from the schema
export type Category = z.infer<typeof categorySchema>;

export const productSchema = z.object({
   id: z.number(),
   title: z.string(),
   price: z.number().positive(), // Ensures price is a positive number
   description: z.string(),
   images: z.array(z.string().url()), // Array of valid image URLs
   creationAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid creationAt date format',
   }),
   updatedAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid updatedAt date format',
   }),
   category: categorySchema, // Nested Category schema
});

// Optional: Infer the TypeScript type from the schema
export type Product = z.infer<typeof productSchema>;

export const userSchema = z.object({
   id: z.number(),
   email: z.string().email(), // Ensures a valid email format
   password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
   name: z.string(),
   role: z.enum(['admin', 'customer']), // Restricts role to 'admin' or 'customer'
   avatar: z.string().url(), // Ensures the avatar is a valid URL
   creationAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid creationAt date format',
   }),
   updatedAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid updatedAt date format',
   }),
});

// Optional: Infer the TypeScript type from the schema
export type User = z.infer<typeof userSchema>;

export const loginCredentialsSchema = z.object({
   email: z.string().email(),
   password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

// Optional: Infer the TypeScript type from the schema
export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;
