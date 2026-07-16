import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createItem } from '../../api/items';

export function useAddItem() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (formData: FormData) => {
    setLoading(true);
    try {
      await createItem(formData);
      toast.success('Item adicionado!');
      navigate('/');
    } catch (err) {
      toast.error('Erro ao salvar. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return { loading, handleSubmit };
}
