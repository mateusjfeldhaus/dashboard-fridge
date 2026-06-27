import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/items';
import { setToken } from '../../auth';

export function useLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await login(password);
      setToken(data.token);
      navigate('/');
    } catch {
      setError('Senha incorreta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [password, navigate]);

  return { password, setPassword, loading, error, handleSubmit };
}
