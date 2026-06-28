import { useState, useCallback, useEffect, useRef } from 'react';
import { CATEGORIES } from '../../constants/categories';
import type { Item } from '../../types';

export { CATEGORIES };

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
  const objectUrlRef = useRef<string | null>(null);

  // Revoke previous object URL when a new one is created or component unmounts
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, [preview]);

  const set = useCallback(
    (key: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value })),
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
    const fd = new FormData();
    (Object.entries(form) as [string, string | number][]).forEach(([k, v]) =>
      fd.append(k, String(v))
    );
    if (imageFile) fd.append('image', imageFile);
    onSubmit(fd);
  }, [form, imageFile, onSubmit]);

  return { form, preview, set, handleImage, handleSubmit };
}
