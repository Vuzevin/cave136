import { useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { useBeverages } from '../context/BeverageContext';

// GeoJSON for mainland France regions (simplified)
const FRANCE_GEO = 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions-version-simplifiee.geojson';

// French region name normalization map
const REGION_NORMALIZE: Record<string, string[]> = {
  'Île-de-France': ['ile de france', 'idf', 'paris'],
  'Nouvelle-Aquitaine': ['nouvelle aquitaine', 'bordeaux', 'bordeaux'],
  'Occitanie': ['occitanie', 'languedoc', 'roussillon'],
  'Auvergne-Rhône-Alpes': ['auvergne', 'rhone alpes', 'rhône alpes', 'beaujolais'],
  'Bretagne': ['bretagne', 'bretagne'],
  'Normandie': ['normandie'],
  'Hauts-de-France': ['hauts de france', 'nord pas de calais'],
  'Grand Est': ['grand est', 'alsace', 'lorraine', 'champagne'],
  'Pays de la Loire': ['pays de la loire', 'anjou', 'muscadet'],
  'Centre-Val de Loire': ['centre val de loire', 'loire', 'touraine'],
  'Bourgogne-Franche-Comté': ['bourgogne', 'franche comté', 'chablis'],
  "Provence-Alpes-Côte d'Azur": ['provence', 'paca', 'cote d azur'],
  'Corse': ['corse'],
};

function matchRegion(itemRegion: string): string | null {
  const normalized = itemRegion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [region, aliases] of Object.entries(REGION_NORMALIZE)) {
    for (const alias of aliases) {
      if (normalized.includes(alias.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) {
        return region;
      }
    }
  }
  return null;
}

export default function FranceMapPage({ onSelectRegion }: { onSelectRegion: (r: string) => void }) {
  const { items } = useBeverages();

  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    items
      .filter(i => (i.category === 'wine' || i.category === 'beer') && i.country?.toLowerCase().includes('france'))
      .forEach(item => {
        if (!item.region) return;
        const matched = matchRegion(item.region);
        if (matched) counts[matched] = (counts[matched] || 0) + 1;
      });
    return counts;
  }, [items]);

  const maxCount = Math.max(1, ...Object.values(regionCounts));
  const colorScale = scaleLinear<string>()
    .domain([0, maxCount * 0.2, maxCount])
    .range(['#1a1a2e', '#4A0E0E', '#C0392B']);

  return (
    <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
      <h1 style={{ fontSize: 32, color: '#F0EDE8', marginBottom: 8 }}>🗺️ Carte de France</h1>
      <p style={{ color: '#9A948C', fontSize: 14, marginBottom: 24 }}>
        Heatmap de vos vins et bières par région française. Plus la région est foncée, plus vous y avez goûté de références.
      </p>

      <div className="glass-card" style={{ padding: 24 }}>
        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
          {Object.entries(regionCounts).sort(([,a], [,b]) => b - a).slice(0, 10).map(([region, count]) => (
            <div key={region} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 12, color: '#9A948C',
            }}>
              <div style={{
                width: 12, height: 12, borderRadius: 3,
                background: colorScale(count),
                border: '1px solid #2A2A2E',
              }} />
              <span style={{ color: '#F0EDE8' }}>{region}</span>
              <span style={{
                background: '#8B1A1A33', borderRadius: 8, padding: '1px 6px',
                color: '#C0392B', fontWeight: 600,
              }}>{count}</span>
            </div>
          ))}
          {Object.keys(regionCounts).length === 0 && (
            <p style={{ color: '#9A948C', fontSize: 13 }}>
              Ajoutez des vins ou bières avec "France" comme pays et une région pour voir la carte s'animer !
            </p>
          )}
        </div>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [2.5, 46.5], scale: 2800 }}
          style={{ width: '100%', height: 500 }}
        >
          <Geographies geography={FRANCE_GEO}>
            {({ geographies }: { geographies: Array<{ rsmKey: string; properties: { nom: string } }> }) =>
              geographies.map((geo) => {
                const regionName = geo.properties.nom;
                const count = regionCounts[regionName] || 0;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={colorScale(count)}
                    stroke="#2A2A2E"
                    strokeWidth={0.8}
                    onClick={() => count > 0 && onSelectRegion(regionName)}
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
        </ComposableMap>
      </div>
    </div>
  );
}
