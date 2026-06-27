import { z } from 'zod';

const CATEGORIES = [
  'carne', 'frango', 'porco', 'peixe', 'frutos do mar',
  'congelados', 'pães', 'sopa', 'massas', 'proteina', 'outro',
];

export const loginSchema = z.object({
  password: z.string().min(1, 'Senha obrigatória'),
});

export const itemBodySchema = z.object({
  name:        z.string().min(1, 'Nome obrigatório').max(100),
  category:    z.enum(CATEGORIES, { message: 'Categoria inválida' }),
  quantity:    z.coerce.number().positive('Quantidade deve ser positiva').default(1),
  unit:        z.string().min(1).max(20).default('un'),
  notes:       z.string().max(500).optional().nullable(),
  expiry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (YYYY-MM-DD)').optional().nullable(),
  image_url:   z.string().url().optional().nullable(),
});

export const quantitySchema = z.object({
  amount: z.coerce.number().positive('Quantidade deve ser positiva').default(1),
});

export const idParamSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const getItemsQuerySchema = z.object({
  category: z.enum(CATEGORIES).optional(),
  search:   z.string().max(100).optional(),
});
