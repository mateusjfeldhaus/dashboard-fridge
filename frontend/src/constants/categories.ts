export const CATEGORY_CONFIG = {
  carne:           { bg: '#fef2f2', color: '#991b1b', label: '🥩 Carne' },
  frango:          { bg: '#fefce8', color: '#854d0e', label: '🍗 Frango' },
  porco:           { bg: '#fdf4ff', color: '#7e22ce', label: '🥓 Porco' },
  peixe:           { bg: '#eff6ff', color: '#1e40af', label: '🐟 Peixe' },
  'frutos do mar': { bg: '#ecfeff', color: '#0e7490', label: '🦐 Frutos do Mar' },
  congelados:      { bg: '#f0f9ff', color: '#0369a1', label: '🧊 Congelados' },
  'pães':          { bg: '#fff7ed', color: '#9a3412', label: '🍞 Pães' },
  sopa:            { bg: '#fef9c3', color: '#854d0e', label: '🍲 Sopa' },
  massas:          { bg: '#fdf2f8', color: '#86198f', label: '🍝 Massas' },
  proteina:        { bg: '#f0fdf4', color: '#15803d', label: '💪 Proteína' },
  outro:           { bg: '#f8fafc', color: '#475569', label: '📦 Outro' },
} as const;

export type Category = keyof typeof CATEGORY_CONFIG;

export const CATEGORIES = Object.keys(CATEGORY_CONFIG) as Category[];
