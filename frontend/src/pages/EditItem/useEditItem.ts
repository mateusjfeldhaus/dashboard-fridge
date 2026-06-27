import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getItem, updateItem } from '../../api/items';
import type { Item } from '../../types';

export function useEditItem() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getItem(id)
      .then(({ data }) => setItem(data))
      .catch(() => navigate('/'));
  }, [id, navigate]);

  const handleSubmit = useCallback(async (formData: FormData) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      await updateItem(id, formData);
      navigate('/');
    } catch (err) {
      setError('Erro ao atualizar. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  return { item, loading, error, handleSubmit };
}
