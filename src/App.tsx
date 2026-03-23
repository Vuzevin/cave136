import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { BeverageProvider } from './context/BeverageContext';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/Sidebar';
import CellarView from './pages/CellarView';
import FranceMapPage from './pages/FranceMapPage';
import WorldMapPage from './pages/WorldMapPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeView, setActiveView] = useState('cellar');

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0D0D0F',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🍷</div>
          <p style={{ color: '#9A948C', fontSize: 14 }}>Chargement de Cave136…</p>
        </div>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return (
    <BeverageProvider>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main style={{ flex: 1, overflowY: 'auto', background: '#0D0D0F' }}>
          {activeView === 'cellar' && <CellarView />}
          {activeView === 'map-france' && <FranceMapPage />}
          {activeView === 'map-world' && <WorldMapPage />}
        </main>
      </div>
    </BeverageProvider>
  );
}

export default function App() {
  return <AppContent />;
}
