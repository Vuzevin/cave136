import { useState } from 'react';
import { BeverageProvider } from './context/BeverageContext';
import { CATEGORY_CONFIG } from './types';
import type { CategoryType, SubView } from './types';
import CellarView from './pages/CellarView';
import FranceMapPage from './pages/FranceMapPage';
import WorldMapPage from './pages/WorldMapPage';
import { Menu, X, ChevronLeft, LayoutGrid } from 'lucide-react';

function CategoryHub({ onSelect }: { onSelect: (cat: CategoryType) => void }) {
  const categories: CategoryType[] = ['wine', 'whisky', 'beer', 'coffee', 'tea'];

  return (
    <div className="animate-fade-in" style={{ 
      minHeight: '100vh', 
      background: '#F5F1EC', 
      padding: '40px 24px 100px 24px' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}>🍷</span>
          <h1 style={{ fontSize: '56px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '-2px' }}>
            Ma Reserve Personnelle
          </h1>
          <p style={{ fontSize: '20px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Gérez vos caves et carnets de dégustation avec élégance. Sélectionnez un univers pour commencer.
          </p>
        </header>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '24px' 
        }}>
          {categories.map((cat, idx) => {
            const config = CATEGORY_CONFIG[cat];
            return (
              <div 
                key={cat} 
                className="hub-card stagger-item" 
                style={{ animationDelay: `${idx * 0.1}s` }}
                onClick={() => onSelect(cat)}
              >
                <img src={config.heroImage} alt={config.label} />
                <div className="hub-card-content">
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>{config.emoji}</div>
                  <h2 style={{ fontSize: '32px', margin: 0, fontWeight: 700 }}>{config.label}</h2>
                  <p style={{ opacity: 0.8, fontSize: '16px' }}>{config.heroTitle}</p>
                  
                  <div style={{ 
                    marginTop: '24px', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '100px',
                    fontSize: '14px',
                    fontWeight: 600
                  }}>
                    Entrer dans l'univers <ChevronLeft size={16} style={{ transform: 'rotate(180deg)' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer style={{ 
        position: 'fixed', 
        bottom: '24px', 
        left: '50%', 
        transform: 'translateX(-50%)',
        opacity: 0.5,
        fontSize: '12px'
      }}>
        Cave136 v2.0 • Premium Beverage Management
      </footer>
    </div>
  );
}

function AppContent() {
  const [activeCategory, setActiveCategory] = useState<CategoryType | null>(null);
  const [activeSubView, setActiveSubView] = useState<SubView>('cave');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories: CategoryType[] = ['wine', 'whisky', 'beer', 'coffee', 'tea'];

  if (!activeCategory) {
    return <CategoryHub onSelect={(cat) => setActiveCategory(cat)} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F5F1EC' }}>
      {/* Top Navigation */}
      <header style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-soft)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0 24px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button 
            onClick={() => setActiveCategory(null)}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '14px'
            }}
          >
            <LayoutGrid size={18} />
            <span className="desktop-only">Hub</span>
          </button>

          <div style={{ width: '1px', height: '24px', background: 'var(--border-soft)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '18px', margin: 0, color: 'var(--text-primary)', fontWeight: 800 }}>Cave136</h1>
          </div>

          {/* Desktop Category Tabs */}
          <nav className="desktop-only" style={{ display: 'flex', gap: '4px', marginLeft: '12px' }}>
            {categories.map(cat => {
              const config = CATEGORY_CONFIG[cat];
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setActiveSubView('cave');
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '100px',
                    border: 'none',
                    background: isActive ? config.bg : 'transparent',
                    color: isActive ? config.color : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{config.emoji}</span>
                  {config.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-only"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            backgroundColor: '#F8F8F8'
          }}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '70px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#FFFFFF',
          zIndex: 99,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <button 
            onClick={() => { setActiveCategory(null); setIsMobileMenuOpen(false); }}
            style={{ padding: '16px', borderRadius: '12px', background: '#F5F5F7', border: 'none', textAlign: 'left', fontWeight: 600 }}
          >
            🏠 Retour au Hub global
          </button>
          <div style={{ height: '1px', background: '#EEE', margin: '8px 0' }} />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setActiveSubView('cave');
                setIsMobileMenuOpen(false);
              }}
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border-soft)',
                background: activeCategory === cat ? CATEGORY_CONFIG[cat].bg : 'transparent',
                textAlign: 'left',
                fontSize: '16px',
                fontWeight: 600,
                color: activeCategory === cat ? CATEGORY_CONFIG[cat].color : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <span>{CATEGORY_CONFIG[cat].emoji}</span>
              {CATEGORY_CONFIG[cat].label}
            </button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {activeSubView === 'map' ? (
          activeCategory === 'wine' ? <FranceMapPage /> : <WorldMapPage />
        ) : (
          <CellarView 
            category={activeCategory} 
            subView={activeSubView} 
            setSubView={setActiveSubView} 
          />
        )}
      </main>

      <style>{`
        @media (max-width: 900px) {
          .desktop-only { display: none !important; }
        }
        @media (min-width: 901px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <BeverageProvider>
      <AppContent />
    </BeverageProvider>
  );
}
