import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { BaseFields } from '../types';

interface BeverageContextType {
  items: BaseFields[];
  loading: boolean;
  addItem: (item: Omit<BaseFields, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateItem: (id: string, item: Partial<BaseFields>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  fetchItems: () => Promise<void>;
}

const BeverageContext = createContext<BeverageContextType | undefined>(undefined);

export function BeverageProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BaseFields[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    const { data, error } = await supabase
      .from('beverages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setItems(data as BaseFields[]);
    setLoading(false);
  }

  async function addItem(item: Omit<BaseFields, 'id' | 'user_id' | 'created_at'>) {
    const { error } = await supabase.from('beverages').insert({ ...item });
    if (!error) fetchItems();
    else console.error('Error adding item:', error);
  }

  async function updateItem(id: string, item: Partial<BaseFields>) {
    const { error } = await supabase.from('beverages').update(item).eq('id', id);
    if (!error) fetchItems();
    else console.error('Error updating item:', error);
  }

  async function deleteItem(id: string) {
    const { error } = await supabase.from('beverages').delete().eq('id', id);
    if (!error) fetchItems();
    else console.error('Error deleting item:', error);
  }

  return (
    <BeverageContext.Provider value={{
      items, loading, addItem, updateItem, deleteItem, fetchItems
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
