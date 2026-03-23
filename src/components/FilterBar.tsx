import type { CategoryType } from '../types';
import type { FilterState } from '../context/BeverageContext';
import { Search, SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  category: CategoryType | null;
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

export default function FilterBar({ category, filters, onChange }: FilterBarProps) {
  const _ = category; void _; // suppress unused

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center',
      padding: '16px 0', marginBottom: 8,
    }}>
      {/* Search */}
      <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9A948C' }} />
        <input
          placeholder="Rechercher…"
          value={filters.searchText || ''}
          onChange={e => onChange({ ...filters, searchText: e.target.value })}
          style={{ paddingLeft: 36 }}
        />
      </div>

      {/* Country */}
      <input
        placeholder="Pays…"
        value={filters.country || ''}
        onChange={e => onChange({ ...filters, country: e.target.value })}
        style={{ flex: '0 1 130px', minWidth: 100 }}
      />

      {/* Min rating */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 1 160px' }}>
        <SlidersHorizontal size={14} style={{ color: '#9A948C', flexShrink: 0 }} />
        <select
          value={filters.minRating || ''}
          onChange={e => onChange({ ...filters, minRating: e.target.value ? Number(e.target.value) : undefined })}
        >
          <option value="">Note min.</option>
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}★ et +</option>)}
        </select>
      </div>

      {/* Max price */}
      <input
        type="number"
        placeholder="Prix max €"
        value={filters.maxPrice || ''}
        onChange={e => onChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
        style={{ flex: '0 1 110px', minWidth: 90 }}
      />

      {/* Sort */}
      <select
        value={filters.sortBy || 'created_at'}
        onChange={e => onChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
        style={{ flex: '0 1 160px' }}
      >
        <option value="created_at">Plus récents</option>
        <option value="name">Nom</option>
        <option value="rating_general">Note</option>
        <option value="price">Prix</option>
      </select>

      <select
        value={filters.sortDir || 'desc'}
        onChange={e => onChange({ ...filters, sortDir: e.target.value as 'asc' | 'desc' })}
        style={{ flex: '0 1 110px' }}
      >
        <option value="desc">↓ Déc.</option>
        <option value="asc">↑ Crois.</option>
      </select>
    </div>
  );
}
