import { useState, useCallback, useEffect, useRef } from 'react';
import { z } from 'zod';
import { CATEGORIES } from '../../constants/categories';
import type { Item } from '../../types';

export { CATEGORIES };

export const UNITS = ['un', 'kg', 'g', 'l', 'ml', 'pacote', 'caixa'] as const;

const formSchema = z.object({
  name:        z.string().min(1, 'Nome é obrigatório').max(100, 'Máximo 100 caracteres'),
  category:    z.string().min(1, 'Selecione uma categoria'),
  quantity:    z.coerce.number({ invalid_type_error: 'Informe uma quantidade' }).positive('Quantidade deve ser maior que zero').max(9_999_999, 'Quantidade muito alta'),
  unit:        z.string().min(1, 'Selecione uma unidade'),
  notes:       z.string().max(500, 'Máximo 500 caracteres').optional(),
  expiry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida').optional().or(z.literal('')),
  image_url:   z.string().optional(),
});

export type FormErrors = Partial<Record<keyof z.infer<typeof formSchema>, string>>;

interface FormState {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  notes: string;
  expiry_date: string;
  image_url: string;
}

export function useItemForm(initial: Partial<Item> = {}, onSubmit: (fd: FormData) => void) {
  const [form, setForm] = useState<FormState>({
    name: initial.name ?? '',
    category: initial.category ?? 'carne',
    quantity: initial.quantity ?? 1,
    unit: initial.unit ?? 'un',
    notes: initial.notes ?? '',
    expiry_date: initial.expiry_date ? initial.expiry_date.split('T')[0] : '',
    image_url: initial.image_url ?? '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initial.image_url ?? null);
  const objectUrlRef = useRef<string | null>(null);

  // Revoke previous object URL when a new one is created or component unmounts
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, [preview]);

  const set = useCallback(
    (key: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = key === 'quantity' ? Number(e.target.value) : e.target.value;
        setForm((f) => ({ ...f, [key]: value }));
        // Clear error for this field on change
        setErrors((prev) => ({ ...prev, [key]: undefined }));
      },
    []
  );

  const handleImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setImageFile(file);
    setPreview(url);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    const result = formSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const [field, msgs] of Object.entries(result.error.flatten().fieldErrors)) {
        fieldErrors[field as keyof FormErrors] = msgs?.[0];
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    const fd = new FormData();
    (Object.entries(form) as [string, string | number][]).forEach(([k, v]) => {
      // Skip empty optional string fields — backend Zod rejects '' for url/regex fields
      if ((k === 'image_url' || k === 'expiry_date') && !v) return;
      fd.append(k, String(v));
    });
    if (imageFile) fd.append('image', imageFile);
    onSubmit(fd);
  }, [form, imageFile, onSubmit]);

  return { form, errors, preview, set, handleImage, handleSubmit };
}
