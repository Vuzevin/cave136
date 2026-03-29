import { useState, createContext, useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BeverageProvider } from './context/BeverageContext';
import { CATEGORY_CONFIG } from './types';
import type { CategoryType, SubView } from './types';
import CellarView from './pages/CellarView';
import FranceMapPage from './pages/FranceMapPage';
import EuropeMapPage from './pages/EuropeMapPage';
import WorldMapPage from './pages/WorldMapPage';
import AuthPage from './pages/AuthPage';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import { X, ChevronLeft, Loader2, Bell, CheckCircle, AlertCircle, User, LogOut } from 'lucide-react';

// --- Category Hub Component ---
function CategoryHub({ onSelect }: { onSelect: (cat: CategoryType) => void }) {
  const categories: CategoryType[] = ['wine', 'whisky', 'beer', 'coffee', 'tea'];
  const { signOut, user } = useAuth();

  return (
    <div className="animate-fade-in" style={{ 
      minHeight: '100vh', 
      background: '#F5F1EC', 
      padding: '40px 24px 100px 24px' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '60px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: '#FFFFFF', 
              padding: '8px 16px', 
              borderRadius: '100px',
              border: '1px solid #E8E0D8',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-secondary)'
            }}>
              <User size={14} />
              {user?.email?.split('@')[0]}
            </div>
            <button 
              onClick={signOut}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E8E0D8',
                borderRadius: '100px',
                padding: '8px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#E53E3E'
              }}
            >
              <LogOut size={14} />
              Déconnexion
            </button>
          </div>

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
    </div>
  );
}

// --- Toast System ---
type ToastType = 'success' | 'error' | 'info';
interface Toast { id: number; message: string; type: ToastType; }

const ToastContext = createContext<{ addToast: (msg: string, type?: ToastType) => void }>({ addToast: () => {} });

export function useToast() { return useContext(ToastContext); }

function ToastContainer({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: number) => void }) {
  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {toasts.map(t => (
        <div key={t.id} className="animate-slide-up" style={{
          background: t.type === 'success' ? '#10B981' : t.type === 'error' ? '#EF4444' : '#3B82F6',
          color: 'white', padding: '12px 20px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', gap: '12px', minWidth: '280px', pointerEvents: 'auto'
        }}>
          {t.type === 'success' ? <CheckCircle size={18} /> : t.type === 'error' ? <AlertCircle size={18} /> : <Bell size={18} />}
          <span style={{ fontSize: '14px', fontWeight: 600, flex: 1 }}>{t.message}</span>
          <button onClick={() => removeToast(t.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

// --- Main App Component ---
function MainApp() {
  const { user, loading: authLoading } = useAuth();
  const [activeCategory, setActiveCategory] = useState<CategoryType | null>(null);
  const [activeSubView, setActiveSubView] = useState<SubView>('cave');
  const [activeMapType, setActiveMapType] = useState<'france' | 'europe' | 'world'>('france');
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  if (authLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F1EC' }}>
        <Loader2 className="animate-spin" size={40} color="#9A948C" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (!activeCategory) {
    return <CategoryHub onSelect={(cat) => setActiveCategory(cat)} />;
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      <BeverageProvider>
        <div className="main-layout" style={{ display: 'flex', minHeight: '100vh', background: '#F5F1EC' }}>
          <Sidebar 
            activeCategory={activeCategory} 
            onSelectCategory={(cat) => { setActiveCategory(cat); setActiveSubView('cave'); }}
            onSelectMap={() => { if(activeCategory) setActiveSubView('map'); else setActiveCategory('wine'); }}
          />
          
          <main style={{ flex: 1, position: 'relative' }}>
            {activeSubView === 'map' ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ 
                  background: '#FFFFFF', 
                  borderBottom: '1px solid var(--border-soft)',
                  padding: '12px 24px',
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'center'
                }}>
                  {[
                    { id: 'france', label: 'France', emoji: '🇫🇷' },
                    { id: 'europe', label: 'Europe', emoji: '🇪🇺' },
                    { id: 'world', label: 'Monde', emoji: '🌍' }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setActiveMapType(m.id as any)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '100px',
                        border: '1px solid ' + (activeMapType === m.id ? 'var(--text-primary)' : 'var(--border-soft)'),
                        background: activeMapType === m.id ? 'var(--text-primary)' : 'white',
                        color: activeMapType === m.id ? 'white' : 'var(--text-secondary)',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>{m.emoji}</span>
                      {m.label}
                    </button>
                  ))}
                  <button 
                    onClick={() => setActiveSubView('cave')}
                    style={{ marginLeft: 'auto', padding: '8px 16px', borderRadius: '100px', border: 'none', background: '#F5F5F7', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                  >
                    Retour à la liste
                  </button>
                </div>
                <div style={{ flex: 1 }}>
                  {activeMapType === 'france' && <FranceMapPage onSelectRegion={(r) => { setLocationFilter(r); setActiveSubView('cave'); }} />}
                  {activeMapType === 'europe' && <EuropeMapPage onSelectCountry={(c) => { setLocationFilter(c); setActiveSubView('cave'); }} />}
                  {activeMapType === 'world' && <WorldMapPage onSelectCountry={(c) => { setLocationFilter(c); setActiveSubView('cave'); }} />}
                </div>
              </div>
            ) : (
              <CellarView 
                category={activeCategory} 
                subView={activeSubView} 
                setSubView={setActiveSubView} 
                locationFilter={locationFilter}
                onClearLocationFilter={() => setLocationFilter(null)}
              />
            )}
          </main>
          
          <BottomNav 
            activeCategory={activeCategory} 
            activeSubView={activeSubView} 
            onSelectCategory={(cat) => { setActiveCategory(cat); setActiveSubView('cave'); }} 
            onSelectSubView={(v) => setActiveSubView(v)}
          />
        </div>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </BeverageProvider>
    </ToastContext.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </BrowserRouter>
  );
}
