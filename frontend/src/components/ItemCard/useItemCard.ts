import { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { deleteItem, decrementQuantity, updateItemImage } from '../../api/items';
import type { Item } from '../../types';

export const EMOJI: Record<string, string> = {
  carne: '🥩', frango: '🍗', porco: '🥓', peixe: '🐟',
  'frutos do mar': '🦐', congelados: '🧊', 'pães': '🍞',
  sopa: '🍲', massas: '🍝', proteina: '💪', outro: '📦',
};

interface UseItemCardOptions {
  onDeleted: (id: string) => void;
  onUpdated: (item: Item) => void;
}

export function useItemCard(item: Item, { onDeleted, onUpdated }: UseItemCardOptions) {
  const navigate = useNavigate();
  const theme = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);

  const [removing, setRemoving] = useState(false);
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);

  const cat = item.category?.toLowerCase() || 'outro';
  const categoryStyle = theme.categories[cat as keyof typeof theme.categories] ?? theme.categories.outro;
  const maxQty = Number(item.quantity);

  const getExpiryStatus = useCallback((): 'urgent' | 'soon' | null => {
    if (!item.expiry_date) return null;
    const days = (new Date(item.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    if (days <= 7) return 'urgent';
    if (days <= 30) return 'soon';
    return null;
  }, [item.expiry_date]);

  const handleImageClick = useCallback(() => {
    fileRef.current?.click();
  }, []);

  const handleImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgUploading(true);
    try {
      const { data } = await updateItemImage(item.id, file);
      onUpdated(data);
    } catch (err) {
      console.error(err);
    } finally {
      setImgUploading(false);
      e.target.value = '';
    }
  }, [item.id, onUpdated]);

  const handleConfirmRemove = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await decrementQuantity(item.id, amount);
      if (data.deleted) {
        onDeleted(item.id);
      } else if (data.item) {
        onUpdated(data.item);
        setRemoving(false);
        setAmount(1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [item.id, amount, onDeleted, onUpdated]);

  const handleFullDelete = useCallback(async () => {
    if (!confirm(`Remover "${item.name}" completamente?`)) return;
    await deleteItem(item.id);
    onDeleted(item.id);
  }, [item.id, item.name, onDeleted]);

  const cancelRemove = useCallback(() => {
    setRemoving(false);
    setAmount(1);
  }, []);

  return {
    fileRef, cat, categoryStyle,
    removing, setRemoving, cancelRemove,
    amount, setAmount, maxQty,
    loading, imgUploading,
    getExpiryStatus,
    handleImageClick, handleImageChange,
    handleConfirmRemove, handleFullDelete,
    navigate,
  };
}
