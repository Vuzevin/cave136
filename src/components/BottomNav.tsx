import { LayoutDashboard, Map, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../App';
import { CATEGORY_CONFIG } from '../types';
import type { CategoryType, SubView } from '../types';

interface BottomNavProps {
  activeCategory: CategoryType | null;
  activeSubView: SubView;
  onSelectCategory: (cat: CategoryType | null) => void;
  onSelectSubView: (v: SubView) => void;
}

export default function BottomNav({ activeCategory, activeSubView, onSelectCategory, onSelectSubView }: BottomNavProps) {
  const { signOut } = useAuth();
  const { addToast } = useToast();

  const handleSignOut = () => {
    signOut();
    addToast('Déconnexion réussie!', 'info');
  };

  return (
    <div className="mobile-only" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '70px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid var(--border-soft)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 1000,
      paddingBottom: 'safe-area-inset-bottom'
    }}>
      {/* Hub Button */}
      <button
        onClick={() => onSelectCategory(null)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          color: activeCategory === null ? 'var(--text-primary)' : 'var(--text-muted)',
          cursor: 'pointer'
        }}
      >
        <LayoutDashboard size={24} />
        <span style={{ fontSize: '10px', fontWeight: 600 }}>Hub</span>
      </button>

      {/* Categories Dropdown/Scroll (Simplified: just active category if selected, else nothing or a generic icon) */}
      {activeCategory && (
        <button
          onClick={() => onSelectSubView('cave')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            color: activeSubView === 'cave' ? CATEGORY_CONFIG[activeCategory].color : 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '24px', lineHeight: 1 }}>{CATEGORY_CONFIG[activeCategory].emoji}</span>
          <span style={{ fontSize: '10px', fontWeight: 600 }}>{CATEGORY_CONFIG[activeCategory].label}</span>
        </button>
      )}

      {/* Map Button */}
      <button
        onClick={() => {
          if (activeCategory) {
            onSelectSubView('map');
          } else {
            // Need a category to see map technically, default to wine or just block
            onSelectCategory('wine');
            onSelectSubView('map');
          }
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          color: activeSubView === 'map' ? 'var(--text-primary)' : 'var(--text-muted)',
          cursor: 'pointer'
        }}
      >
        <Map size={24} />
        <span style={{ fontSize: '10px', fontWeight: 600 }}>Carte</span>
      </button>

      {/* Profile/Logout Button */}
      <button
        onClick={handleSignOut}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          color: '#E53E3E', // Always red for danger/logout in this simple nav
          cursor: 'pointer'
        }}
      >
        <LogOut size={24} />
        <span style={{ fontSize: '10px', fontWeight: 600 }}>Quitter</span>
      </button>
    </div>
  );
}
