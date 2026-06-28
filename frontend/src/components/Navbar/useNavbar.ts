import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearTokens } from '../../auth';

export function useNavbar() {
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    clearTokens();
    navigate('/login');
  }, [navigate]);

  return { handleLogout };
}
