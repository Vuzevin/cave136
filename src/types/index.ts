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
  in_stock?: boolean;  // true = dans la cave (inventory), false = dégustation only
  quantity?: number;   // nb of bottles in cave
}

export type SubView = 'cave' | 'tastings' | 'map';

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
  heroTitle: string;
  subLabel: string;
  emoji: string;
  color: string;
  accent: string;
  light: string;
  soft: string;
  bg: string;
  ratingIcon: string;
  heroImage: string;
  heroGradient: string;
  caveLabel: string;
  tastingLabel: string;
}> = {
  wine: {
    label: 'Vin',
    heroTitle: 'Ma Cave à Vin',
    subLabel: 'Tableau de bord',
    emoji: '🍷',
    color: '#8B1A1A',
    accent: '#C0392B',
    light: '#FDF0EE',
    soft: '#F5E6E4',
    bg: 'rgba(139,26,26,0.08)',
    ratingIcon: '🍷',
    heroImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80',
    heroGradient: 'linear-gradient(to right, rgba(15,5,5,0.92) 0%, rgba(60,10,10,0.7) 50%, rgba(0,0,0,0.3) 100%)',
    caveLabel: 'Ma Cave',
    tastingLabel: 'Mes Dégustations',
  },
  whisky: {
    label: 'Whisky',
    heroTitle: 'Ma Cave à Whisky',
    subLabel: 'Tableau de bord',
    emoji: '🥃',
    color: '#92650A',
    accent: '#D4960A',
    light: '#FDF8EC',
    soft: '#FAF0D3',
    bg: 'rgba(146,101,10,0.08)',
    ratingIcon: '🥃',
    heroImage: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=1200&q=80',
    heroGradient: 'linear-gradient(to right, rgba(10,7,2,0.92) 0%, rgba(50,30,2,0.7) 50%, rgba(0,0,0,0.3) 100%)',
    caveLabel: 'Ma Collection',
    tastingLabel: 'Mes Dégustations',
  },
  beer: {
    label: 'Bière',
    heroTitle: 'Ma Cave à Bières',
    subLabel: 'Tableau de bord',
    emoji: '🍺',
    color: '#C0550A',
    accent: '#E8820A',
    light: '#FDF4EC',
    soft: '#FAEBD5',
    bg: 'rgba(192,85,10,0.08)',
    ratingIcon: '🍺',
    heroImage: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=1200&q=80',
    heroGradient: 'linear-gradient(to right, rgba(10,5,2,0.92) 0%, rgba(60,25,2,0.7) 50%, rgba(0,0,0,0.3) 100%)',
    caveLabel: 'Mon Stock',
    tastingLabel: 'Mes Dégustations',
  },
  coffee: {
    label: 'Café',
    heroTitle: 'Mon Journal Café',
    subLabel: 'Tableau de bord',
    emoji: '☕',
    color: '#3D2314',
    accent: '#6B4226',
    light: '#F5EDE8',
    soft: '#EDE0D8',
    bg: 'rgba(61,35,20,0.08)',
    ratingIcon: '☕',
    heroImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80',
    heroGradient: 'linear-gradient(to right, rgba(5,3,2,0.92) 0%, rgba(30,15,5,0.7) 50%, rgba(0,0,0,0.3) 100%)',
    caveLabel: 'Mes Stocks',
    tastingLabel: 'Mes Dégustations',
  },
  tea: {
    label: 'Thé',
    heroTitle: 'Mon Journal Thé',
    subLabel: 'Tableau de bord',
    emoji: '🍵',
    color: '#1A5732',
    accent: '#2E8B57',
    light: '#EAF5EE',
    soft: '#D4EDDE',
    bg: 'rgba(26,87,50,0.08)',
    ratingIcon: '🍵',
    heroImage: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=1200&q=80',
    heroGradient: 'linear-gradient(to right, rgba(2,10,5,0.92) 0%, rgba(5,35,15,0.7) 50%, rgba(0,0,0,0.3) 100%)',
    caveLabel: 'Mes Stocks',
    tastingLabel: 'Mes Dégustations',
  },
};
