import { CATEGORY_CONFIG } from '../constants/categories';

export const theme = {
  colors: {
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    danger: '#dc2626',
    dangerHover: '#b91c1c',
    warning: '#d97706',
    background: '#f1f5f9',
    surface: '#ffffff',
    border: '#e2e8f0',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
  },
  categories: CATEGORY_CONFIG,
  radius: { sm: '6px', md: '10px', lg: '16px' },
  shadow: {
    sm: '0 1px 3px rgba(0,0,0,0.08)',
    md: '0 4px 12px rgba(0,0,0,0.10)',
  },
} as const;

export type Theme = typeof theme;
