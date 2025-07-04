import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  sku: z.string()
    .min(1, 'El SKU es requerido')
    .max(50, 'El SKU no puede exceder 50 caracteres')
    .trim(),
  stock: z.number()
    .int('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo'),
  accountId: z.string()
    .min(1, 'El ID de cuenta es requerido')
    .regex(/^[0-9a-fA-F]{24}$/, 'Debe ser un ID de cuenta válido')
});

export const productIdSchema = z.string()
  .min(1, 'El ID es requerido')
  .regex(/^[0-9a-fA-F]{24}$/, 'Debe ser un ID válido');

export const productsFilterSchema = z.object({
  accountId: z.string()
    .min(1, 'El ID de cuenta es requerido')
    .regex(/^[0-9a-fA-F]{24}$/, 'Debe ser un ID de cuenta válido'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10)
});

export const purchaseProductSchema = z.object({
  accountId: z.string()
    .min(1, 'El ID de cuenta es requerido')
    .regex(/^[0-9a-fA-F]{24}$/, 'Debe ser un ID de cuenta válido'),
  productId: z.string()
    .min(1, 'El ID de producto es requerido')
    .regex(/^[0-9a-fA-F]{24}$/, 'Debe ser un ID de producto válido'),
  quantity: z.number()
    .int('La cantidad debe ser un número entero')
    .min(1, 'La cantidad debe ser mayor a 0')
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type ProductsFilterInput = z.infer<typeof productsFilterSchema>;
export type PurchaseProductInput = z.infer<typeof purchaseProductSchema>;