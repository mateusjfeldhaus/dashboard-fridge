const KEY = 'fridge_token';

export const getToken = (): string | null => localStorage.getItem(KEY);
export const setToken = (t: string): void => { localStorage.setItem(KEY, t); };
export const clearToken = (): void => { localStorage.removeItem(KEY); };

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (Date.now() >= payload.exp * 1000) {
      clearToken(); // remove token expirado automaticamente
      return false;
    }
    return true;
  } catch {
    clearToken();
    return false;
  }
};
