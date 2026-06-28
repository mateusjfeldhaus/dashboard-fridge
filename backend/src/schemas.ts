import { z } from 'zod';
import { CATEGORIES, UNITS } from './categories.js';

export const loginSchema = z.object({
  password: z.string().min(1, 'Senha obrigatória'),
});

export const itemBodySchema = z.object({
  name:        z.string().min(1, 'Nome obrigatório').max(100),
  category:    z.enum(CATEGORIES, { message: 'Categoria inválida' }),
  quantity:    z.coerce.number().positive('Quantidade deve ser positiva').multipleOf(0.01).max(9_999_999.99).default(1),
  unit:        z.enum(UNITS, { message: 'Unidade inválida' }).default('un'),
  notes:       z.string().max(500).optional().nullable(),
  expiry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (YYYY-MM-DD)').optional().nullable(),
  image_url:   z.string().url().optional().nullable(),
});

export const quantitySchema = z.object({
  amount: z.coerce.number().positive('Quantidade deve ser positiva').multipleOf(0.01).default(1),
});

export const idParamSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const getItemsQuerySchema = z.object({
  category: z.enum(CATEGORIES).optional(),
  search:   z.string().max(100).optional(),
});

export type ItemBody = z.infer<typeof itemBodySchema>;
export type LoginBody = z.infer<typeof loginSchema>;
