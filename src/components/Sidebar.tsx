import { LayoutDashboard, Map, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../App';
import { CATEGORY_CONFIG } from '../types';
import type { CategoryType } from '../types';

interface SidebarProps {
  activeCategory: CategoryType | null;
  onSelectCategory: (cat: CategoryType | null) => void;
  onSelectMap: () => void;
}

export default function Sidebar({ activeCategory, onSelectCategory, onSelectMap }: SidebarProps) {
  const { signOut, user } = useAuth();
  const { addToast } = useToast();
  const categories: CategoryType[] = ['wine', 'whisky', 'beer', 'coffee', 'tea'];

  return (
    <div className="desktop-only" style={{ 
      width: '280px', 
      background: '#FFFFFF', 
      borderRight: '1px solid var(--border-soft)', 
      padding: '32px 24px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '32px',
      position: 'sticky',
      top: 0,
      height: '100vh'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: '32px' }}>🍷</div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Cave136</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button 
          onClick={() => onSelectCategory(null)}
          style={{ 
            padding: '12px 16px', borderRadius: '12px', border: 'none', textAlign: 'left', fontWeight: 700, 
            display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
            background: activeCategory === null ? '#F5F5F7' : 'transparent',
            color: activeCategory === null ? 'var(--text-primary)' : 'var(--text-secondary)',
            transition: 'all 0.2s'
          }}
        >
          <LayoutDashboard size={20} /> Hub Central
        </button>

        <div style={{ marginTop: '16px', marginBottom: '8px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', paddingLeft: '12px' }}>Univers</div>
        
        {categories.map(cat => {
          const config = CATEGORY_CONFIG[cat];
          const isActive = activeCategory === cat;
          return (
            <button 
              key={cat} 
              onClick={() => onSelectCategory(cat)}
              style={{ 
                padding: '12px 16px', borderRadius: '12px', border: 'none', textAlign: 'left', fontWeight: 700, 
                display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
                background: isActive ? config.bg : 'transparent',
                color: isActive ? config.color : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '18px' }}>{config.emoji}</span> {config.label}
            </button>
          );
        })}

        <div style={{ marginTop: '16px', marginBottom: '8px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', paddingLeft: '12px' }}>Exploration</div>
        
        <button 
          onClick={onSelectMap}
          style={{ 
            padding: '12px 16px', borderRadius: '12px', border: 'none', textAlign: 'left', fontWeight: 700, 
            display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
            background: 'transparent', color: 'var(--text-secondary)',
            transition: 'all 0.2s'
          }}
        >
          <Map size={20} /> Cartes de Cave
        </button>
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-soft)', paddingTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingLeft: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EEE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 }}>
            {user?.email?.[0].toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email?.split('@')[0]}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Collectionneur</div>
          </div>
        </div>
        <button 
          onClick={() => { signOut(); addToast('Déconnexion réussie!', 'info'); }}
          style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#FEF2F2', border: 'none', color: '#DC2626', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <LogOut size={18} /> Quitter
        </button>
      </div>
    </div>
  );
}
