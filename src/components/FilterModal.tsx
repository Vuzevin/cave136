import { useState } from 'react';
import { X, Filter } from 'lucide-react';

interface FilterModalProps {
  initialMaxPrice: number | null;
  initialMinRating: number;
  color: string;
  onApply: (maxPrice: number | null, minRating: number) => void;
  onClose: () => void;
}

export default function FilterModal({ initialMaxPrice, initialMinRating, color, onApply, onClose }: FilterModalProps) {
  const [maxPrice, setMaxPrice] = useState<string>(initialMaxPrice !== null ? initialMaxPrice.toString() : '');
  const [minRating, setMinRating] = useState<number>(initialMinRating);

  const handleApply = () => {
    const parsedPrice = maxPrice === '' ? null : Number(maxPrice);
    onApply(parsedPrice, minRating);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%', maxWidth: '400px',
        padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '24px', color: '#F0EDE8', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={24} color={color} /> Filtres avancés
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#9A948C', cursor: 'pointer'
          }}><X size={20} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="modal-form">
          <div>
            <label>Prix Maximum (€)</label>
            <input 
              type="number" 
              value={maxPrice} 
              onChange={e => setMaxPrice(e.target.value)} 
              placeholder="Ex: 50" 
              min="0"
              step="1"
            />
          </div>

          <div>
            <label>Note Minimum (0-5 étoiles)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="range" 
                min="0" 
                max="5" 
                value={minRating} 
                onChange={e => setMinRating(Number(e.target.value))}
                style={{ flex: 1, accentColor: color }}
              />
              <span style={{ color: '#F0EDE8', fontWeight: 700, minWidth: '32px', textAlign: 'right' }}>{minRating}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleApply}
          style={{
            width: '100%', padding: '16px', borderRadius: '12px',
            background: color, color: 'white', fontWeight: 700,
            fontSize: '16px', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
          }}
        >
          Appliquer les filtres
        </button>
      </div>
    </div>
  );
}
