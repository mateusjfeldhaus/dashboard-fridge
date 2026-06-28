export interface Item {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: string;
  notes?: string;
  expiry_date?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export type Category =
  | 'carne'
  | 'frango'
  | 'porco'
  | 'peixe'
  | 'frutos do mar'
  | 'congelados'
  | 'pães'
  | 'sopa'
  | 'massas'
  | 'proteina'
  | 'outro';

export interface DecrementResponse {
  deleted: boolean;
  id?: string;
  item?: Item;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
}
