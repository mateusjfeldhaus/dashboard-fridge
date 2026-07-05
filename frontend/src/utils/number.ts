/**
 * Formats a quantity using Brazilian locale (decimal separator = comma).
 * Strips trailing zeros: 1.00 → "1", 1.50 → "1,5", 1.25 → "1,25"
 */
export function formatQty(value: number | string): string {
  const n = Number(value);
  if (isNaN(n)) return String(value);
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
