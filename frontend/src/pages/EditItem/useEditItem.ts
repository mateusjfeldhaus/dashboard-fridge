import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getItem, updateItem } from '../../api/items';
import { getApiErrorMessage } from '../../utils/apiError';
import type { Item } from '../../types';

export function useEditItem() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setFetching(true);
    getItem(id, controller.signal)
      .then(({ data }) => setItem(data))
      .catch((err) => { if (err.name !== 'CanceledError') navigate('/'); })
      .finally(() => setFetching(false));
    return () => controller.abort();
  }, [id, navigate]);

  const handleSubmit = useCallback(async (formData: FormData) => {
    if (!id) return;
    setLoading(true);
    try {
      await updateItem(id, formData);
      toast.success('Item atualizado!');
      navigate('/');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Erro ao atualizar. Tente novamente.'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  return { item, fetching, loading, handleSubmit };
}
