import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getItems } from '../../api/items';
import type { Item } from '../../types';

export const CATEGORIES = [
  'todos', 'carne', 'frango', 'porco', 'peixe', 'frutos do mar',
  'congelados', 'pães', 'sopa', 'massas', 'proteina', 'outro',
] as const;

export function useDashboard() {
  const { category: categoryParam } = useParams<{ category?: string }>();
  const navigate = useNavigate();

  const activeCategory = categoryParam ?? 'todos';
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchItems = useCallback(async (cat = activeCategory, q = search) => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (cat !== 'todos') params.category = cat;
    if (q) params.search = q;
    const { data } = await getItems(params);
    setItems(data);
    setLoading(false);
  }, [activeCategory, search]);

  useEffect(() => { void fetchItems(); }, [activeCategory]);

  const handleCategoryClick = useCallback((c: string) => {
    if (c === 'todos') navigate('/');
    else navigate(`/category/${encodeURIComponent(c)}`);
  }, [navigate]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    void fetchItems(activeCategory, search);
  }, [activeCategory, search, fetchItems]);

  const handleDeleted = useCallback(
    (id: string) => setItems((prev) => prev.filter((i) => i.id !== id)),
    []
  );

  const handleUpdated = useCallback(
    (updated: Item) => setItems((prev) => prev.map((i) => i.id === updated.id ? updated : i)),
    []
  );

  const label = activeCategory === 'todos'
    ? 'Todos os itens'
    : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);

  return {
    items, loading, search, setSearch,
    activeCategory, label,
    handleCategoryClick, handleSearch,
    handleDeleted, handleUpdated,
  };
}
