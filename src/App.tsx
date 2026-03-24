import { useState } from 'react';
import { BeverageProvider } from './context/BeverageContext';
import Sidebar from './components/Sidebar';
import CellarView from './pages/CellarView';
import FranceMapPage from './pages/FranceMapPage';
import WorldMapPage from './pages/WorldMapPage';

export default function App() {
  const [activeView, setActiveView] = useState('cellar');

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
