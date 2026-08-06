import axios from 'axios';

/** Extracts a readable error message from an Axios error response. */
export function getApiErrorMessage(err: unknown, fallback = 'Erro inesperado. Tente novamente.'): string {
  if (!axios.isAxiosError(err)) return fallback;
  const data = err.response?.data as { error?: string; details?: Record<string, string[]> } | undefined;
  if (!data) return fallback;

  // If backend returned field-level Zod errors, join the first message of each field
  if (data.details && Object.keys(data.details).length > 0) {
    const messages = Object.values(data.details)
      .map((msgs) => msgs?.[0])
      .filter(Boolean);
    return messages.join(' • ');
  }

  return data.error ?? fallback;
}
