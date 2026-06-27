import { useState, useCallback } from 'react';
import type { Item } from '../../types';

export const CATEGORIES = [
  'carne', 'frango', 'porco', 'peixe', 'frutos do mar',
  'congelados', 'pães', 'sopa', 'massas', 'proteina', 'outro',
] as const;

export const UNITS = ['un', 'kg', 'g', 'l', 'ml', 'pacote', 'caixa'] as const;

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initial.image_url ?? null);

  const set = useCallback(
    (key: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value })),
    []
  );

  const handleImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    (Object.entries(form) as [string, string | number][]).forEach(([k, v]) =>
      fd.append(k, String(v))
    );
    if (imageFile) fd.append('image', imageFile);
    onSubmit(fd);
  }, [form, imageFile, onSubmit]);

  return { form, preview, set, handleImage, handleSubmit };
}
