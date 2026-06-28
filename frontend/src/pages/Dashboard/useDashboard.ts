import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getItems } from '../../api/items';
import { CATEGORIES as BASE_CATEGORIES } from '../../constants/categories';
import { parseLocalDate } from '../../utils/date';
import { useToast } from '../../contexts/ToastContext';
import type { Item } from '../../types';

export const CATEGORIES = ['todos', ...BASE_CATEGORIES] as const;
export const PAGE_SIZE = 12;

export function useDashboard() {
  const { category: categoryParam } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const activeCategory = categoryParam ?? 'todos';
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [error, setError] = useState<string | null>(null);

  // Show toast passed via navigation state (e.g. after add/edit)
  useEffect(() => {
    const msg = (location.state as { toast?: string } | null)?.toast;
    if (msg) {
      showToast(msg);
      // Clear state so toast doesn't re-appear on back navigation
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
  const filteredItems = useMemo(() => {
    let result = allItems;
    if (activeCategory !== 'todos') {
      result = result.filter((i) => i.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((i) =>
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        (i.notes ?? '').toLowerCase().includes(q)
      );
    }
    // Sort by expiry: soonest first, items without expiry at the end
    return [...result].sort((a, b) => {
      if (!a.expiry_date && !b.expiry_date) return 0;
      if (!a.expiry_date) return 1;
      if (!b.expiry_date) return -1;
      return parseLocalDate(a.expiry_date).getTime() - parseLocalDate(b.expiry_date).getTime();
    });
  }, [allItems, activeCategory, search]);

  // Reset to page 1 when filters change
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const items = useMemo(
    () => filteredItems.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filteredItems, safePage]
  );

  const handleCategoryClick = useCallback((c: string) => {
    setPage(1);
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

  const handleRestored = useCallback(
    (item: Item) => setAllItems((prev) => [item, ...prev]),
    []
  );

  const label = activeCategory === 'todos'
    ? 'Todos os itens'
    : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);

  const setSearch2 = useCallback((v: string) => { setSearch(v); setPage(1); }, []);

  return {
    items, loading, error, search, setSearch: setSearch2,
    activeCategory, label,
    page: safePage, totalPages, setPage,
    totalItems: filteredItems.length,
    handleCategoryClick,
    handleDeleted, handleUpdated, handleRestored,
  };
}
