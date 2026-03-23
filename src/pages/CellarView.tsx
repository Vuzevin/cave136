import { useState, useMemo } from 'react';
import type { BaseFields, CategoryType } from '../types';
import { CATEGORY_CONFIG } from '../types';
import { useBeverages } from '../context/BeverageContext';
import BeverageCard from '../components/BeverageCard';
import FilterBar from '../components/FilterBar';
import AddItemModal from '../components/AddItemModal';
import { Plus } from 'lucide-react';

export default function CellarView() {
  const { items, loading, filterCategory, filters, setFilters, addItem, updateItem, deleteItem } = useBeverages();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BaseFields | null>(null);
  const [addCategory, setAddCategory] = useState<CategoryType>('wine');

  const categories: CategoryType[] = ['wine', 'whisky', 'beer', 'coffee', 'tea'];
  const activeCategory = filterCategory || 'wine';
  const config = CATEGORY_CONFIG[activeCategory];

  // Apply local filters
  const filtered = useMemo(() => {
    let result = [...items];
    if (filters.searchText) {
      const q = filters.searchText.toLowerCase();
      result = result.filter(i => i.name.toLowerCase().includes(q) || i.country?.toLowerCase().includes(q) || i.region?.toLowerCase().includes(q));
    }
    if (filters.country) {
      result = result.filter(i => i.country?.toLowerCase().includes(filters.country!.toLowerCase()));
    }
    if (filters.minRating) {
      result = result.filter(i => i.rating_general >= filters.minRating!);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter(i => i.price !== undefined && i.price <= filters.maxPrice!);
    }
    const sortBy = filters.sortBy || 'created_at';
    const sortDir = filters.sortDir || 'desc';
    result.sort((a, b) => {
      const av = (a[sortBy as keyof BaseFields] ?? '') as string | number;
      const bv = (b[sortBy as keyof BaseFields] ?? '') as string | number;
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(String(bv)) : String(bv).localeCompare(av);
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return result;
  }, [items, filters]);

  function handleAdd(category: CategoryType) {
    setAddCategory(category);
    setEditingItem(null);
    setShowModal(true);
  }

  function handleEdit(item: BaseFields) {
    setEditingItem(item);
    setAddCategory(item.category);
    setShowModal(true);
  }

  async function handleDelete(id: string) {
    if (window.confirm('Supprimer cet élément ?')) {
      await deleteItem(id);
    }
  }

  async function handleSave(item: Omit<BaseFields, 'id' | 'user_id' | 'created_at'>) {
    if (editingItem?.id) {
      await updateItem(editingItem.id, item);
    } else {
      await addItem(item);
    }
  }

  return (
    <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 32, color: '#F0EDE8', marginBottom: 6 }}>
            {filterCategory ? config.label : '🍶 Toutes mes Caves'}
          </h1>
          <p style={{ color: '#9A948C', fontSize: 14 }}>
            {filtered.length} dégustation{filtered.length > 1 ? 's' : ''} enregistrée{filtered.length > 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {(filterCategory ? [filterCategory] : categories).map(cat => (
            <button
              key={cat}
              onClick={() => handleAdd(cat)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 18px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: `linear-gradient(135deg, ${CATEGORY_CONFIG[cat].color}, ${CATEGORY_CONFIG[cat].accent})`,
                color: 'white', fontWeight: 600, fontSize: 13,
                boxShadow: `0 4px 16px ${CATEGORY_CONFIG[cat].color}55`,
                transition: 'all 0.2s',
              }}
            >
              <Plus size={16} />
              {CATEGORY_CONFIG[cat].emoji} {filterCategory ? 'Ajouter' : CATEGORY_CONFIG[cat].label.replace('Ma Cave à ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <FilterBar category={filterCategory} filters={filters} onChange={setFilters} />

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="shimmer" style={{ height: 320, borderRadius: 16 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#9A948C' }}>
          <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.4 }}>
            {filterCategory ? config.emoji : '🍶'}
          </div>
          <h3 style={{ color: '#F0EDE8', fontSize: 20, marginBottom: 8 }}>Cave vide</h3>
          <p style={{ fontSize: 14 }}>Commencez par ajouter votre première dégustation !</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {filtered.map(item => (
            <BeverageCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <AddItemModal
          category={addCategory}
          initialData={editingItem}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingItem(null); }}
        />
      )}
    </div>
  );
}
