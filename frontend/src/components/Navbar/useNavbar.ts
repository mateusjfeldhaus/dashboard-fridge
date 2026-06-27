import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../../auth';

export function useNavbar() {
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    clearToken();
    navigate('/login');
  }, [navigate]);

  return { handleLogout };
}
