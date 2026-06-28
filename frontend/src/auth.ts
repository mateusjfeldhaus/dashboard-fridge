const KEY         = 'fridge_token';
const REFRESH_KEY = 'fridge_refresh_token';

export const getToken         = (): string | null => localStorage.getItem(KEY);
export const getRefreshToken  = (): string | null => localStorage.getItem(REFRESH_KEY);

export const setTokens = (token: string, refreshToken: string): void => {
  localStorage.setItem(KEY, token);
  localStorage.setItem(REFRESH_KEY, refreshToken);
};

/** Used to update only the access token after a silent refresh */
export const setToken = (t: string): void => { localStorage.setItem(KEY, t); };

export const clearTokens = (): void => {
  localStorage.removeItem(KEY);
  localStorage.removeItem(REFRESH_KEY);
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Expired access token is OK — the interceptor will refresh it silently
    if (Date.now() >= payload.exp * 1000) {
      return getRefreshToken() !== null;
    }
    return true;
  } catch {
    clearTokens();
    return false;
  }
};
