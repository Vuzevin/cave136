import { useState, useMemo } from 'react';
import type { BaseFields, CategoryType, SubView } from '../types';
import { CATEGORY_CONFIG } from '../types';
import { useBeverages } from '../context/BeverageContext';
import BeverageCard from '../components/BeverageCard';
import AddItemModal from '../components/AddItemModal';
import { Plus, Search, Filter } from 'lucide-react';

interface CellarViewProps {
  category: CategoryType;
  subView: SubView;
  setSubView: (v: SubView) => void;
}

export default function CellarView({ category, subView, setSubView }: CellarViewProps) {
  const { items, loading, addItem, updateItem, deleteItem } = useBeverages();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BaseFields | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const config = CATEGORY_CONFIG[category];
  
  // Filter items by category and subview (cave vs tasting)
  const filtered = useMemo(() => {
    let result = items.filter(i => i.category === category);
    
    if (subView === 'cave') {
      result = result.filter(i => i.in_stock === true);
    } else if (subView === 'tastings') {
      result = result.filter(i => i.in_stock === false);
    }
    
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(i => 
        i.name.toLowerCase().includes(q) || 
        i.country?.toLowerCase().includes(q) || 
        i.region?.toLowerCase().includes(q)
      );
    }
    
    return result;
  }, [items, category, subView, searchTerm]);

  // Stats calculation
  const stats = useMemo(() => {
    const catItems = items.filter(i => i.category === category);
    const caveItems = catItems.filter(i => i.in_stock === true);
    const tastingsItems = catItems.filter(i => i.in_stock === false);
    
    const totalBottles = caveItems.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
    const estimatedValue = caveItems.reduce((acc, curr) => acc + (curr.price || 0) * (curr.quantity || 1), 0);
    
    return {
      references: caveItems.length,
      bottles: totalBottles,
      tastings: tastingsItems.length,
      value: Math.round(estimatedValue)
    };
  }, [items, category]);

  async function handleSave(item: Omit<BaseFields, 'id' | 'user_id' | 'created_at'>) {
    if (editingItem?.id) {
      await updateItem(editingItem.id, item);
    } else {
      await addItem(item);
    }
  }


  return (
    <div className="animate-fade-in" style={{ paddingBottom: '80px' }}>
      {/* Hero Banner */}
      <div style={{
        position: 'relative',
        height: '240px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: '0 40px',
        color: '#FFFFFF'
      }}>
        {/* Background Image with Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${config.heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -2
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: config.heroGradient,
          zIndex: -1
        }} />

        <div>
          <p style={{ 
            textTransform: 'uppercase', 
            letterSpacing: '2px', 
            fontSize: '12px', 
            fontWeight: 700,
            opacity: 0.8,
            marginBottom: '8px'
          }}>
            {config.subLabel}
          </p>
          <h1 style={{ fontSize: '48px', margin: 0 }}>{config.heroTitle}</h1>
          
          <div style={{ display: 'flex', gap: '40px', marginTop: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '24px', fontWeight: 700 }}>{stats.references}</span>
              <span style={{ fontSize: '12px', opacity: 0.7, textTransform: 'uppercase' }}>références</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '24px', fontWeight: 700 }}>{stats.bottles}</span>
              <span style={{ fontSize: '12px', opacity: 0.7, textTransform: 'uppercase' }}>bouteilles</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '24px', fontWeight: 700 }}>{stats.tastings}</span>
              <span style={{ fontSize: '12px', opacity: 0.7, textTransform: 'uppercase' }}>dégustations</span>
            </div>
          </div>
        </div>
      </div>

      {/* View Switcher & Actions */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '32px 24px',
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div className="section-title" style={{ marginBottom: 0 }}>
            <style>{`.section-title::before { background-color: ${config.color}; }`}</style>
            <span style={{ fontSize: '24px' }}>{subView === 'cave' ? config.emoji : '📑'}</span>
            <h2 style={{ fontSize: '24px', margin: 0 }}>{subView === 'cave' ? config.caveLabel : config.tastingLabel}</h2>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ 
              display: 'flex', 
              background: '#FFFFFF', 
              padding: '4px', 
              borderRadius: '12px',
              border: '1px solid var(--border-soft)'
            }}>
              <button 
                onClick={() => setSubView('cave')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: subView === 'cave' ? config.bg : 'transparent',
                  color: subView === 'cave' ? config.color : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Stock
              </button>
              <button 
                onClick={() => setSubView('tastings')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: subView === 'tastings' ? config.bg : 'transparent',
                  color: subView === 'tastings' ? config.color : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Dégustations
              </button>
              <button 
                onClick={() => setSubView('map')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Carte
              </button>
            </div>

            <button 
              onClick={() => { setEditingItem(null); setShowModal(true); }}
              className="btn"
              style={{
                background: config.color,
                color: '#FFFFFF',
                boxShadow: `0 4px 12px ${config.color}33`
              }}
            >
              <Plus size={18} />
              Ajouter
            </button>
          </div>
        </div>

        {/* Dash Cards (References / Bottles / Value) */}
        {subView === 'cave' && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '24px',
            marginBottom: '40px'
          }}>
            <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '12px', 
                backgroundColor: config.light, display: 'flex', 
                alignItems: 'center', justifyContent: 'center' 
              }}>
                <span style={{ fontSize: '20px' }}>🍷</span>
              </div>
              <div>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>RÉFÉRENCES</span>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.references}</div>
              </div>
            </div>
            <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '12px', 
                backgroundColor: '#FFF8E6', display: 'flex', 
                alignItems: 'center', justifyContent: 'center' 
              }}>
                <span style={{ fontSize: '20px' }}>📦</span>
              </div>
              <div>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Bouteilles</span>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.bottles}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>≈ {stats.value} €</div>
              </div>
            </div>
            <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '12px', 
                backgroundColor: '#E6F9F0', display: 'flex', 
                alignItems: 'center', justifyContent: 'center' 
              }}>
                <span style={{ fontSize: '20px' }}>💎</span>
              </div>
              <div>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Valeur Estimée</span>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.value} €</div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="card" style={{ padding: '16px', marginBottom: '32px', display: 'flex', gap: '16px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Rechercher un nom, un pays, une région..."
              style={{ paddingLeft: '40px', border: 'none', background: '#F9F9F9' }}
            />
          </div>
          <button style={{ 
            background: 'none', border: '1px solid var(--border-soft)', 
            borderRadius: '10px', padding: '0 16px', display: 'flex', 
            alignItems: 'center', gap: '8px', cursor: 'pointer',
            color: 'var(--text-secondary)', fontWeight: 600
          }}>
            <Filter size={16} />
            Filtres
          </button>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="beverage-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {[1,2,3,4].map(i => (
              <div key={i} className="shimmer" style={{ height: '360px', borderRadius: '18px' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>{config.emoji}</div>
            <h3 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '12px' }}>C'est bien vide ici...</h3>
            <p>Ajoutez votre premier item en cliquant sur le bouton en haut à droite.</p>
          </div>
        ) : (
          <div className="beverage-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {filtered.map(item => (
              <BeverageCard 
                key={item.id} 
                item={item} 
                onEdit={(it) => { setEditingItem(it); setShowModal(true); }}
                onDelete={deleteItem}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddItemModal 
          category={category}
          initialData={editingItem}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingItem(null); }}
        />
      )}
    </div>
  );
}
