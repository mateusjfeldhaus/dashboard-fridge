/**
 * Parses a date-only string (YYYY-MM-DD) as local noon to avoid UTC offset
 * shifting the displayed day in timezones behind UTC (e.g. UTC-3).
 *
 * new Date('2025-01-15')           → UTC midnight → shows Jan 14 in UTC-3
 * parseLocalDate('2025-01-15')     → local noon   → shows Jan 15 everywhere
 */
export function parseLocalDate(dateStr: string): Date {
  return new Date(`${dateStr}T12:00:00`);
}

export function formatDate(dateStr: string): string {
  return parseLocalDate(dateStr).toLocaleDateString('pt-BR');
}
