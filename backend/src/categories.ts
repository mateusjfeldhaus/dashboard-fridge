export const CATEGORIES = [
  'carne', 'frango', 'porco', 'peixe', 'frutos do mar',
  'congelados', 'pães', 'sopa', 'massas', 'proteina', 'outro',
] as const;

export type Category = typeof CATEGORIES[number];

export const UNITS = ['un', 'kg', 'g', 'l', 'ml', 'pacote', 'caixa'] as const;
export type Unit = typeof UNITS[number];
