import { useState, useMemo } from 'react';
import type { BaseFields, CategoryType, SubView } from '../types';
import { CATEGORY_CONFIG } from '../types';
import { useBeverages } from '../context/BeverageContext';
import BeverageCard from '../components/BeverageCard';
import AddItemModal from '../components/AddItemModal';
import CategorySummary from '../components/CategorySummary';
import ExportButton from '../components/ExportButton';
import { Plus, Search, Filter, BookOpen, ArrowUpDown } from 'lucide-react';

interface CellarViewProps {
  category: CategoryType;
  subView: SubView;
  setSubView: (v: SubView) => void;
}

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'rating';

export default function CellarView({ category, subView, setSubView }: CellarViewProps) {
  const { items, loading, addItem, updateItem, deleteItem } = useBeverages();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BaseFields | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isJournalMode, setIsJournalMode] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const config = CATEGORY_CONFIG[category];
  
  // Filter and Sort items
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

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'rating') return (b.rating_general || 0) - (a.rating_general || 0);
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });
    
    return result;
  }, [items, category, subView, searchTerm, sortBy]);

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

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
            </div>

            {subView === 'tastings' && (
              <button 
                onClick={() => setIsJournalMode(!isJournalMode)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-soft)',
                  background: isJournalMode ? '#F5F5F7' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <BookOpen size={16} />
                {isJournalMode ? 'Vue Grille' : 'Mode Journal'}
              </button>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              <ExportButton category={category} items={items} />
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
        </div>

        {/* Stats Dashboard */}
        {subView === 'cave' && <CategorySummary category={category} items={items} />}

        {/* Search & Sort Bar */}
        <div className="card" style={{ padding: '12px 16px', marginBottom: '32px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, pays, région..."
              style={{ paddingLeft: '40px', border: 'none', background: '#F9F9F9', width: '100%', height: '40px' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown size={16} style={{ color: 'var(--text-muted)' }} />
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value as SortOption)}
              style={{ border: 'none', background: 'none', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px' }}
            >
              <option value="newest">Plus récent</option>
              <option value="rating">Mieux notés</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>

          <button style={{ 
            background: 'none', border: '1px solid var(--border-soft)', 
            borderRadius: '10px', padding: '0 16px', height: '40px', display: 'flex', 
            alignItems: 'center', gap: '8px', cursor: 'pointer',
            color: 'var(--text-secondary)', fontWeight: 600
          }}>
            <Filter size={16} />
            Plus de filtres
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="beverage-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {[1,2,3,4].map(i => (
              <div key={i} className="shimmer" style={{ height: '360px', borderRadius: '18px' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card animate-fade-in" style={{ 
            textAlign: 'center', 
            padding: '80px 24px', 
            borderRadius: '24px',
            borderStyle: 'dashed',
            borderWidth: '2px'
          }}>
            <div style={{ fontSize: '80px', marginBottom: '24px', filter: 'grayscale(0.5)' }}>
              {subView === 'cave' ? '📦' : '🖋️'}
            </div>
            <h3 style={{ fontSize: '28px', color: 'var(--text-primary)', marginBottom: '16px' }}>
              {searchTerm ? 'Aucun résultat trouvé' : `Votre ${subView === 'cave' ? 'cave' : 'journal'} est vide`}
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 32px auto', fontSize: '16px' }}>
              {searchTerm 
                ? "Essayez d'ajuster vos filtres ou votre recherche pour trouver ce que vous cherchez." 
                : `Commencez à documenter votre passion en ajoutant votre premier ${config.label}.`}
            </p>
            {!searchTerm && (
              <button 
                onClick={() => setShowModal(true)}
                style={{ 
                  padding: '12px 32px', borderRadius: '100px', background: config.color, 
                  color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer',
                  boxShadow: `0 8px 16px ${config.color}33`
                }}
              >
                Ajouter maintenant
              </button>
            )}
          </div>
        ) : isJournalMode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto' }}>
            {filtered.map(item => (
              <div key={item.id} className="journal-view stagger-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 className="journal-title" style={{ fontSize: '28px', margin: 0 }}>{item.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                      {item.region}, {item.country} • {new Date(item.created_at || '').toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div style={{ fontSize: '24px' }}>{config.emoji}</div>
                </div>
                
                <div className="journal-divider" />
                
                <p style={{ fontSize: '18px', lineHeight: 1.6, color: '#4A4A4A', fontStyle: 'italic' }}>
                  "{item.notes || 'Pas de notes pour cette dégustation.'}"
                </p>

                <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
                  {item.rating_general > 0 && (
                    <div style={{ background: '#F5F1EC', padding: '12px 20px', borderRadius: '12px' }}>
                      <span style={{ fontSize: '12px', color: '#9A948C', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Note</span>
                      <span style={{ fontSize: '20px', fontWeight: 700 }}>{item.rating_general}/5</span>
                    </div>
                  )}
                  {item.price && (
                    <div style={{ background: '#F5F1EC', padding: '12px 20px', borderRadius: '12px' }}>
                      <span style={{ fontSize: '12px', color: '#9A948C', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Prix</span>
                      <span style={{ fontSize: '20px', fontWeight: 700 }}>{item.price}€</span>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button onClick={() => { setEditingItem(item); setShowModal(true); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px' }}>Modifier</button>
                  <button onClick={() => deleteItem(item.id!)} style={{ background: 'none', border: 'none', color: '#E53E3E', cursor: 'pointer', fontSize: '13px' }}>Supprimer</button>
                </div>
              </div>
            ))}
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
