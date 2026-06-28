export const CATEGORIES = [
  'carne', 'frango', 'porco', 'peixe', 'frutos do mar',
  'congelados', 'pães', 'sopa', 'massas', 'proteina', 'outro',
] as const;

export type Category = typeof CATEGORIES[number];
