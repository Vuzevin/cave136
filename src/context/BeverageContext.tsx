/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { BaseFields } from '../types';
import { useAuth } from './AuthContext';

interface BeverageContextType {
  items: BaseFields[];
  loading: boolean;
  fetchItems: () => Promise<void>;
  addItem: (item: Omit<BaseFields, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateItem: (id: string, item: Partial<BaseFields>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

const BeverageContext = createContext<BeverageContextType | undefined>(undefined);

export const BeverageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<BaseFields[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchItems = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('beverages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching beverages:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = async (item: Omit<BaseFields, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('beverages')
        .insert([{ ...item, user_id: user.id }])
        .select();

      if (error) throw error;
      if (data) setItems([data[0], ...items]);
    } catch (error) {
      console.error('Error adding beverage:', error);
      throw error;
    }
  };

  const updateItem = async (id: string, item: Partial<BaseFields>) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('beverages')
        .update(item)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setItems(items.map(i => (i.id === id ? { ...i, ...item } : i)));
    } catch (error) {
      console.error('Error updating beverage:', error);
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('beverages')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setItems(items.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting beverage:', error);
      throw error;
    }
  };

  return (
    <BeverageContext.Provider value={{ items, loading, fetchItems, addItem, updateItem, deleteItem }}>
      {children}
    </BeverageContext.Provider>
  );
};

export const useBeverages = () => {
  const context = useContext(BeverageContext);
  if (context === undefined) {
    throw new Error('useBeverages must be used within a BeverageProvider');
  }
  return context;
};
