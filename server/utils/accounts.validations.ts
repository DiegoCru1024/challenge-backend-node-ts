import { z } from 'zod';

export const createAccountSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  email: z.string()
    .email('Debe ser un email válido')
    .min(1, 'El email es requerido')
    .max(255, 'El email no puede exceder 255 caracteres')
    .toLowerCase()
    .trim()
});

export const accountIdSchema = z.string()
  .min(1, 'El ID es requerido')
  .regex(/^[0-9a-fA-F]{24}$/, 'Debe ser un id válido');

export const paginationSchema = z.object({
  page: z.number()
    .int('La página debe ser un número entero')
    .min(1, 'La página debe ser mayor a 0')
    .default(1),
  limit: z.number()
    .int('El límite debe ser un número entero')
    .min(1, 'El límite debe ser mayor a 0')
    .max(100, 'El límite no puede exceder 100')
    .default(10)
});

export const accountsFilterSchema = z.object({
  name: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10)
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type AccountsFilterInput = z.infer<typeof accountsFilterSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;