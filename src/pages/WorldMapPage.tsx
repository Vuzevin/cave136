import { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { useBeverages } from '../context/BeverageContext';

const WORLD_GEO = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Map ISO-3 numeric codes to country names (simplified key subset)
const COUNTRY_NAMES: Record<string, string[]> = {
  'France': ['fr', 'france', 'fra'],
  'Italy': ['it', 'italy', 'ita', 'italie'],
  'Spain': ['es', 'spain', 'esp', 'espagne'],
  'Germany': ['de', 'germany', 'deu', 'allemagne'],
  'United Kingdom': ['gb', 'uk', 'gbr', 'angleterre', 'royaume-uni'],
  'United States': ['us', 'usa', 'united states', 'états-unis'],
  'Portugal': ['pt', 'portugal'],
  'Argentina': ['ar', 'argentina', 'argentine'],
  'Chile': ['cl', 'chile', 'chili'],
  'Australia': ['au', 'australia', 'australie'],
  'Japan': ['jp', 'japan', 'japon'],
  'China': ['cn', 'china', 'chine'],
  'Belgium': ['be', 'belgium', 'belgique'],
  'Ireland': ['ie', 'ireland', 'irlande'],
  'Czech Republic': ['cz', 'czech', 'tchéquie'],
  'Ethiopia': ['et', 'ethiopia', 'éthiopie'],
  'Colombia': ['co', 'colombia', 'colombie'],
  'Brazil': ['br', 'brazil', 'brésil'],
  'Kenya': ['ke', 'kenya'],
  'Mexico': ['mx', 'mexico', 'mexique'],
  'South Africa': ['za', 'south africa', 'afrique du sud'],
  'New Zealand': ['nz', 'new zealand', 'nouvelle-zélande'],
};

export default function WorldMapPage() {
  const { items } = useBeverages();

  const countryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      if (!item.country) return;
      const normalized = item.country.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      for (const [country, aliases] of Object.entries(COUNTRY_NAMES)) {
        if (aliases.some(a => normalized.includes(a))) {
          counts[country] = (counts[country] || 0) + 1;
          break;
        }
      }
    });
    return counts;
  }, [items]);

  const maxCount = Math.max(1, ...Object.values(countryCounts));
  const colorScale = scaleLinear<string>()
    .domain([0, maxCount])
    .range(['#1a1a2e', '#8B1A1A']);

  return (
    <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
      <h1 style={{ fontSize: 32, color: '#F0EDE8', marginBottom: 8 }}>🌍 Carte du Monde</h1>
      <p style={{ color: '#9A948C', fontSize: 14, marginBottom: 24 }}>
        Vos explorations gustatives à travers le monde. Toutes catégories confondues.
      </p>

      <div className="glass-card" style={{ padding: 24 }}>
        {/* Top countries */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          {Object.entries(countryCounts).sort(([,a], [,b]) => b - a).slice(0, 10).map(([country, count]) => (
            <div key={country} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#8B1A1A22', border: '1px solid #8B1A1A44',
              borderRadius: 20, padding: '4px 12px',
            }}>
              <span style={{ fontSize: 12, color: '#F0EDE8', fontWeight: 600 }}>{country}</span>
              <span style={{
                fontSize: 11, background: '#8B1A1A55', borderRadius: 10,
                padding: '1px 6px', color: '#C0392B', fontWeight: 700,
              }}>{count}</span>
            </div>
          ))}
          {Object.keys(countryCounts).length === 0 && (
            <p style={{ color: '#9A948C', fontSize: 13 }}>
              Ajoutez des boissons avec un pays pour voir la carte du monde s'animer !
            </p>
          )}
        </div>

        <ComposableMap
          projection="geoNaturalEarth1"
          style={{ width: '100%', height: 500 }}
        >
          <ZoomableGroup>
            <Geographies geography={WORLD_GEO}>
              {({ geographies }: { geographies: Array<{ rsmKey: string; properties: { name: string } }> }) =>
                geographies.map((geo) => {
                  const name = geo.properties.name;
                  const count = countryCounts[name] || 0;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={colorScale(count)}
                      stroke="#2A2A2E"
                      strokeWidth={0.3}
                      style={{
                        default: { outline: 'none', transition: 'fill 0.3s' },
                        hover: { fill: '#C0392B', outline: 'none', cursor: 'pointer' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </div>
  );
}
