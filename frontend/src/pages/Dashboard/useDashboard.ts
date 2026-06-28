import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getItems } from '../../api/items';
import { CATEGORIES as BASE_CATEGORIES } from '../../constants/categories';
import { parseLocalDate } from '../../utils/date';
import type { Item } from '../../types';

export const CATEGORIES = ['todos', ...BASE_CATEGORIES] as const;

export function useDashboard() {
  const { category: categoryParam } = useParams<{ category?: string }>();
  const navigate = useNavigate();

  const activeCategory = categoryParam ?? 'todos';
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [error, setError] = useState<string | null>(null);

  // Fetch all items once on mount
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    getItems({}, controller.signal)
      .then(({ data }) => setAllItems(data))
      .catch((err) => {
        if (err.name !== 'CanceledError') {
          setError('Não foi possível carregar os itens. Verifique sua conexão.');
        }
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  // Filter + sort client-side — instant, no extra API calls
  const items = useMemo(() => {
    let result = allItems;
    if (activeCategory !== 'todos') {
      result = result.filter((i) => i.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((i) => i.name.toLowerCase().includes(q));
    }
    // Sort by expiry: soonest first, items without expiry at the end
    return [...result].sort((a, b) => {
      if (!a.expiry_date && !b.expiry_date) return 0;
      if (!a.expiry_date) return 1;
      if (!b.expiry_date) return -1;
      return parseLocalDate(a.expiry_date).getTime() - parseLocalDate(b.expiry_date).getTime();
    });
  }, [allItems, activeCategory, search]);

  const handleCategoryClick = useCallback((c: string) => {
    if (c === 'todos') navigate('/');
    else navigate(`/category/${encodeURIComponent(c)}`);
  }, [navigate]);

  const handleDeleted = useCallback(
    (id: string) => setAllItems((prev) => prev.filter((i) => i.id !== id)),
    []
  );

  const handleUpdated = useCallback(
    (updated: Item) => setAllItems((prev) => prev.map((i) => i.id === updated.id ? updated : i)),
    []
  );

  const label = activeCategory === 'todos'
    ? 'Todos os itens'
    : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);

  return {
    items, loading, error, search, setSearch,
    activeCategory, label,
    handleCategoryClick,
    handleDeleted, handleUpdated,
  };
}
