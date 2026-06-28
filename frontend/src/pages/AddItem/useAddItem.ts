import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../../api/items';

export function useAddItem() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      await createItem(formData);
      navigate('/', { state: { toast: '✅ Item adicionado!' } });
    } catch (err) {
      setError('Erro ao salvar. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return { loading, error, handleSubmit };
}
