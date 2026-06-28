/**
 * Parses a date-only string (YYYY-MM-DD) as local noon to avoid UTC offset
 * shifting the displayed day in timezones behind UTC (e.g. UTC-3).
 *
 * new Date('2025-01-15')           → UTC midnight → shows Jan 14 in UTC-3
 * parseLocalDate('2025-01-15')     → local noon   → shows Jan 15 everywhere
 */
export function parseLocalDate(dateStr: string): Date {
  // Strip time part if present (e.g. "2027-01-01T00:00:00.000Z" → "2027-01-01")
  const datePart = dateStr.slice(0, 10);
  return new Date(`${datePart}T12:00:00`);
}

export function formatDate(dateStr: string): string {
  return parseLocalDate(dateStr).toLocaleDateString('pt-BR');
}
