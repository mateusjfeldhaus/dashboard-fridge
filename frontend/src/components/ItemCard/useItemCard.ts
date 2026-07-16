import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { decrementQuantity } from '../../api/items';
import { parseLocalDate } from '../../utils/date';
import { CATEGORY_CONFIG } from '../../constants/categories';
import { useToast } from '../../contexts/ToastContext';
import type { Item } from '../../types';

/** Returns just the emoji from CATEGORY_CONFIG label, e.g. "🥩 Carne" → "🥩" */
export function getCategoryEmoji(cat: string): string {
  const cfg = CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG];
  return cfg ? cfg.label.split(' ')[0] : '📦';
}

interface UseItemCardOptions {
  onDeleted: (id: string) => void;
  onUpdated: (item: Item) => void;
  onRestored: (item: Item) => void;
}

export function useItemCard(item: Item, { onDeleted, onUpdated, onRestored }: UseItemCardOptions) {
  const navigate = useNavigate();
  const theme = useTheme();
  const { showToast } = useToast();

  const [removing, setRemoving] = useState(false);
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const cat = item.category?.toLowerCase() || 'outro';
  const categoryStyle = theme.categories[cat as keyof typeof theme.categories] ?? theme.categories.outro;
  const maxQty = Number(item.quantity);

  const expiryStatus = useMemo((): 'urgent' | 'soon' | null => {
    if (!item.expiry_date) return null;
    const days = (parseLocalDate(item.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    if (days <= 7) return 'urgent';
    if (days <= 30) return 'soon';
    return null;
  }, [item.expiry_date]);

  const openLightbox  = useCallback(() => { if (item.image_url) setLightbox(true); }, [item.image_url]);
  const closeLightbox = useCallback(() => setLightbox(false), []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLightbox(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, closeLightbox]);

  const handleConfirmRemove = useCallback(async () => {
    const willDelete = amount >= maxQty;

    if (willDelete) {
      // Optimistic removal — actual API call is delayed 5s to allow undo
      onDeleted(item.id);
      setRemoving(false);
      setAmount(1);

      showToast(`"${item.name}" removido.`, {
        onUndo: () => onRestored(item),
        onExpire: async () => {
          try {
            await decrementQuantity(item.id, amount);
          } catch (err) {
            console.error('[undo] Failed to delete after timeout — restoring item', err);
            onRestored(item);
          }
        },
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await decrementQuantity(item.id, amount);
      if (data.item) {
        onUpdated(data.item);
        setRemoving(false);
        setAmount(1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [item, amount, maxQty, onDeleted, onUpdated, onRestored, showToast]);

  const cancelRemove = useCallback(() => {
    setRemoving(false);
    setAmount(1);
  }, []);

  return {
    cat, categoryStyle,
    removing, setRemoving, cancelRemove,
    amount, setAmount, maxQty,
    loading,
    lightbox, openLightbox, closeLightbox,
    expiryStatus,
    handleConfirmRemove,
    navigate,
  };
}
