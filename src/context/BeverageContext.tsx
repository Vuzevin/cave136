import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { BaseFields, CategoryType } from '../types';

interface BeverageContextType {
  items: BaseFields[];
  loading: boolean;
  addItem: (item: Omit<BaseFields, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateItem: (id: string, item: Partial<BaseFields>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  filterCategory: CategoryType | null;
  setFilterCategory: (c: CategoryType | null) => void;
  filters: FilterState;
  setFilters: (f: FilterState) => void;
}

export interface FilterState {
  country?: string;
  minRating?: number;
  maxPrice?: number;
  searchText?: string;
  sortBy?: 'created_at' | 'name' | 'rating_general' | 'price';
  sortDir?: 'asc' | 'desc';
}

const BeverageContext = createContext<BeverageContextType | undefined>(undefined);

export function BeverageProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BaseFields[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<CategoryType | null>(null);
  const [filters, setFilters] = useState<FilterState>({});

  useEffect(() => {
    fetchItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategory]);

  async function fetchItems() {
    setLoading(true);
    let query = supabase
      .from('beverages')
      .select('*')
      .order('created_at', { ascending: false });

    if (filterCategory) {
      query = query.eq('category', filterCategory);
    }

    const { data, error } = await query;
    if (!error && data) setItems(data as BaseFields[]);
    setLoading(false);
  }

  async function addItem(item: Omit<BaseFields, 'id' | 'user_id' | 'created_at'>) {
    await supabase.from('beverages').insert({ ...item });
    fetchItems();
  }

  async function updateItem(id: string, item: Partial<BaseFields>) {
    await supabase.from('beverages').update(item).eq('id', id);
    fetchItems();
  }

  async function deleteItem(id: string) {
    await supabase.from('beverages').delete().eq('id', id);
    fetchItems();
  }

  return (
    <BeverageContext.Provider value={{
      items, loading, addItem, updateItem, deleteItem,
      filterCategory, setFilterCategory, filters, setFilters,
    }}>
      {children}
    </BeverageContext.Provider>
  );
}

export function useBeverages() {
  const context = useContext(BeverageContext);
  if (!context) throw new Error('useBeverages must be used within BeverageProvider');
  return context;
}
