import { useState } from 'react';
import { BeverageProvider } from './context/BeverageContext';
import { CATEGORY_CONFIG } from './types';
import type { CategoryType, SubView } from './types';
import CellarView from './pages/CellarView';
import FranceMapPage from './pages/FranceMapPage';
import WorldMapPage from './pages/WorldMapPage';
import { Menu, X } from 'lucide-react';

function AppContent() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('wine');
  const [activeSubView, setActiveSubView] = useState<SubView>('cave');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories: CategoryType[] = ['wine', 'whisky', 'beer', 'coffee', 'tea'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>🍷</span>
            <h1 style={{ fontSize: '22px', margin: 0, color: 'var(--text-primary)' }}>Cave136</h1>
          </div>

          {/* Desktop Category Tabs */}
          <nav className="desktop-only" style={{ display: 'flex', gap: '8px' }}>
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
                    padding: '8px 16px',
                    borderRadius: '100px',
                    border: 'none',
                    background: isActive ? config.bg : 'transparent',
                    color: isActive ? config.color : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{config.emoji}</span>
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
