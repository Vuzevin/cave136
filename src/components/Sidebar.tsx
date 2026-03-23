import type { CategoryType } from '../types';
import { CATEGORY_CONFIG } from '../types';
import { useAuth } from '../context/AuthContext';
import { useBeverages } from '../context/BeverageContext';
import { LogOut, MapPin, BarChart2, Wine } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (v: string) => void;
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const { user, signOut } = useAuth();
  const { setFilterCategory, filterCategory, items } = useBeverages();

  const categories: CategoryType[] = ['wine', 'whisky', 'beer', 'coffee', 'tea'];

  function handleCategoryClick(cat: CategoryType) {
    setFilterCategory(cat);
    setActiveView('cellar');
  }

  function countByCategory(cat: CategoryType) {
    return items.filter(i => i.category === cat).length;
  }

  return (
    <div style={{
      width: 260, minHeight: '100vh', background: 'rgba(13, 13, 15, 0.95)',
      borderRight: '1px solid #2A2A2E', display: 'flex', flexDirection: 'column',
      padding: '24px 0', position: 'sticky', top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 20px 28px', borderBottom: '1px solid #2A2A2E' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #8B1A1A, #C0392B)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px #8B1A1A55',
          }}>
            <Wine size={22} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: 20, color: '#F0EDE8', fontFamily: "'Playfair Display', serif" }}>Cave136</h2>
            <p style={{ fontSize: 11, color: '#9A948C' }}>Carnet de dégustation</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '20px 12px', overflowY: 'auto' }}>
        {/* All */}
        <button
          onClick={() => { setFilterCategory(null); setActiveView('cellar'); }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: activeView === 'cellar' && !filterCategory ? 'rgba(255,255,255,0.08)' : 'transparent',
            color: activeView === 'cellar' && !filterCategory ? '#F0EDE8' : '#9A948C',
            marginBottom: 4, transition: 'all 0.2s', textAlign: 'left',
          }}
        >
          <span style={{ fontSize: 18 }}>🍶</span>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Toutes les caves</span>
          <span style={{
            marginLeft: 'auto', fontSize: 11, background: 'rgba(255,255,255,0.1)',
            borderRadius: 20, padding: '2px 8px', color: '#9A948C',
          }}>{items.length}</span>
        </button>

        <div style={{ margin: '8px 0 4px 12px', fontSize: 11, color: '#555', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
          Mes Caves
        </div>

        {categories.map(cat => {
          const config = CATEGORY_CONFIG[cat];
          const isActive = activeView === 'cellar' && filterCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: isActive ? `${config.color}22` : 'transparent',
                color: isActive ? config.accent : '#9A948C',
                marginBottom: 2, transition: 'all 0.2s', textAlign: 'left',
                borderLeft: isActive ? `3px solid ${config.color}` : '3px solid transparent',
              }}
            >
              <span style={{ fontSize: 18 }}>{config.emoji}</span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{config.label}</span>
              <span style={{
                marginLeft: 'auto', fontSize: 11,
                background: isActive ? `${config.color}44` : 'rgba(255,255,255,0.05)',
                borderRadius: 20, padding: '2px 8px',
                color: isActive ? config.accent : '#9A948C',
              }}>{countByCategory(cat)}</span>
            </button>
          );
        })}

        <div style={{ margin: '16px 0 4px 12px', fontSize: 11, color: '#555', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
          Visualisation
        </div>

        {[
          { id: 'map-france', label: 'Carte de France', icon: <MapPin size={16} /> },
          { id: 'map-world', label: 'Carte du Monde', icon: <BarChart2 size={16} /> },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: activeView === item.id ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: activeView === item.id ? '#F0EDE8' : '#9A948C',
              marginBottom: 2, transition: 'all 0.2s', textAlign: 'left',
            }}
          >
            {item.icon}
            <span style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '20px', borderTop: '1px solid #2A2A2E' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #8B1A1A, #C0392B)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: 'white',
          }}>
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#F0EDE8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={signOut}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '9px', borderRadius: 10, border: '1px solid #2A2A2E', cursor: 'pointer',
            background: 'transparent', color: '#9A948C', fontSize: 13, fontWeight: 500,
            transition: 'all 0.2s',
          }}
        >
          <LogOut size={14} />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
