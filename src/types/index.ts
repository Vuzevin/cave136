export type CategoryType = 'wine' | 'whisky' | 'beer' | 'coffee' | 'tea';

export interface BaseFields {
  id?: string;
  user_id?: string;
  category: CategoryType;
  name: string;
  image_url?: string;
  rating_general: number;
  rating_secondary?: number;
  feeling_1?: string;
  feeling_2?: string;
  food_pairing?: string;
  country?: string;
  region?: string;
  price?: number;
  notes?: string;
  attributes: Record<string, unknown>;
  created_at?: string;
}

export interface WineAttributes {
  year?: number;
  grape?: string;
  peak_date?: string;
  domain?: string;
  bio?: boolean;
  wine_type?: 'Rouge' | 'Blanc' | 'Rosé' | 'Champagne';
}

export interface WhiskyAttributes {
  age?: number;
  distillery?: string;
  cask_type?: string;
  peat_level?: string;
}

export interface BeerAttributes {
  style?: string;
  brewery?: string;
  ibu?: number;
  abv?: number;
}

export interface CoffeeAttributes {
  origin?: string;
  roaster?: string;
  extraction_method?: string;
  aroma_notes?: string;
}

export interface TeaAttributes {
  tea_type?: string;
  steep_time?: string;
  water_temp?: string;
  origin?: string;
}

export const CATEGORY_CONFIG: Record<CategoryType, {
  label: string;
  emoji: string;
  color: string;
  bg: string;
  accent: string;
  light: string;
  ratingIcon: string;
}> = {
  wine: {
    label: 'Ma Cave à Vin',
    emoji: '🍷',
    color: '#8B1A1A',
    bg: '#8B1A1A22',
    accent: '#C0392B',
    light: '#F5E6E6',
    ratingIcon: '🍷',
  },
  whisky: {
    label: 'Ma Cave à Whisky',
    emoji: '🥃',
    color: '#B8860B',
    bg: '#B8860B22',
    accent: '#D4A017',
    light: '#FDF5DC',
    ratingIcon: '🥃',
  },
  beer: {
    label: 'Ma Cave à Bière',
    emoji: '🍺',
    color: '#E67E22',
    bg: '#E67E2222',
    accent: '#F39C12',
    light: '#FEF0D9',
    ratingIcon: '🍺',
  },
  coffee: {
    label: 'Ma Cave à Café',
    emoji: '☕',
    color: '#4A2C2A',
    bg: '#4A2C2A22',
    accent: '#795548',
    light: '#EFEBE9',
    ratingIcon: '☕',
  },
  tea: {
    label: 'Ma Cave à Thé',
    emoji: '🍵',
    color: '#2E7D32',
    bg: '#2E7D3222',
    accent: '#4CAF50',
    light: '#E8F5E9',
    ratingIcon: '🍵',
  },
};
