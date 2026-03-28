import { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { useBeverages } from '../context/BeverageContext';

const EUROPE_GEO = 'https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson';

// Map common names to GeoJSON property names if needed
const COUNTRY_NORMALIZE: Record<string, string[]> = {
  'France': ['france', 'fra', 'fr'],
  'Italy': ['italy', 'italie', 'ita', 'it'],
  'Spain': ['spain', 'espagne', 'esp', 'es'],
  'Germany': ['germany', 'allemagne', 'deu', 'de'],
  'United Kingdom': ['united kingdom', 'uk', 'grande-bretagne', 'gb', 'gbr'],
  'Portugal': ['portugal', 'prt', 'pt'],
  'Belgium': ['belgium', 'belgique', 'bel', 'be'],
  'Netherlands': ['netherlands', 'pays-bas', 'nld', 'nl'],
  'Switzerland': ['switzerland', 'suisse', 'che', 'ch'],
  'Austria': ['austria', 'autriche', 'aut', 'at'],
  'Greece': ['greece', 'grèce', 'grc', 'gr'],
  'Ireland': ['ireland', 'irlande', 'irl', 'ie'],
};

export default function EuropeMapPage({ onSelectCountry }: { onSelectCountry: (c: string) => void }) {
  const { items } = useBeverages();

  const countryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    items
      .filter(i => !!i.country)
      .forEach(item => {
        const normalized = item.country!.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        for (const [country, aliases] of Object.entries(COUNTRY_NORMALIZE)) {
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
    .domain([0, maxCount * 0.2, maxCount])
    .range(['#1a1a2e', '#4A1212', '#C0392B']);

  return (
    <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
      <h1 style={{ fontSize: 32, color: '#F0EDE8', marginBottom: 8 }}>🇪🇺 Carte d'Europe</h1>
      <p style={{ color: '#9A948C', fontSize: 14, marginBottom: 24 }}>
        Vos découvertes européennes. Heatmap basée sur le nombre de références par pays.
      </p>

      <div className="glass-card" style={{ padding: 24 }}>
        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
          {Object.entries(countryCounts).sort(([,a], [,b]) => b - a).slice(0, 8).map(([country, count]) => (
            <div key={country} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 12, color: '#9A948C',
            }}>
              <div style={{
                width: 12, height: 12, borderRadius: 3,
                background: colorScale(count),
                border: '1px solid #2A2A2E',
              }} />
              <span style={{ color: '#F0EDE8' }}>{country}</span>
              <span style={{
                background: '#8B1A1A33', borderRadius: 8, padding: '1px 6px',
                color: '#C0392B', fontWeight: 600,
              }}>{count}</span>
            </div>
          ))}
          {Object.keys(countryCounts).length === 0 && (
            <p style={{ color: '#9A948C', fontSize: 13 }}>
              Ajoutez des produits venant d'Europe pour voir cette carte s'animer !
            </p>
          )}
        </div>

        <ComposableMap
          projection="geoAzimuthalEqualArea"
          projectionConfig={{ rotate: [-20, -52, 0], scale: 800 }}
          style={{ width: '100%', height: 500 }}
        >
          <ZoomableGroup center={[10, 50]} zoom={1}>
            <Geographies geography={EUROPE_GEO}>
              {({ geographies }: { geographies: Array<{ rsmKey: string; properties: { NAME: string } }> }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.NAME;
                  // Try to find count for this country
                  let count = 0;
                  let matchingCountry = '';
                  const geoNameLower = countryName.toLowerCase();
                  for (const [k, aliases] of Object.entries(COUNTRY_NORMALIZE)) {
                    if (k.toLowerCase() === geoNameLower || aliases.includes(geoNameLower)) {
                      count = countryCounts[k] || 0;
                      matchingCountry = k;
                      break;
                    }
                  }

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={colorScale(count)}
                      stroke="#2A2A2E"
                      strokeWidth={0.5}
                      onClick={() => count > 0 && onSelectCountry(matchingCountry)}
                      style={{
                        default: { outline: 'none', transition: 'all 0.3s ease' },
                        hover: { fill: count > 0 ? '#E74C3C' : '#2A2A2E', outline: 'none', cursor: count > 0 ? 'pointer' : 'default', filter: count > 0 ? 'drop-shadow(0 0 8px rgba(192,57,43,0.4))' : 'none' },
                        pressed: { outline: 'none', scale: 0.98 },
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
