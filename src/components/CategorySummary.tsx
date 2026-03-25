import { useMemo } from 'react';
import type { BaseFields, CategoryType, WineAttributes, WhiskyAttributes, BeerAttributes, CoffeeAttributes, TeaAttributes } from '../types';
import { CATEGORY_CONFIG } from '../types';

interface AllAttributes extends WineAttributes, WhiskyAttributes, BeerAttributes, CoffeeAttributes, TeaAttributes {}

interface CategorySummaryProps {
  category: CategoryType;
  items: BaseFields[];
}

export default function CategorySummary({ category, items }: CategorySummaryProps) {
  const config = CATEGORY_CONFIG[category];

  const stats = useMemo(() => {
    const catItems = items.filter(i => i.category === category && i.in_stock);
    const byRegion: Record<string, number> = {};
    const byType: Record<string, number> = {};

    catItems.forEach(item => {
      const region = item.region || 'Inconnu';
      byRegion[region] = (byRegion[region] || 0) + (item.quantity || 1);
      
      const attrs = item.attributes as AllAttributes;
      const type = attrs.wine_type || attrs.style || attrs.tea_type || 'Classique';
      byType[type] = (byType[type] || 0) + (item.quantity || 1);
    });

    const topRegions = Object.entries(byRegion).sort((a,b) => b[1] - a[1]).slice(0, 3);
    const types = Object.entries(byType).sort((a,b) => b[1] - a[1]);

    return { topRegions, types, total: catItems.length };
  }, [items, category]);

  if (stats.total === 0) return null;

  return (
    <div className="glass-card stagger-item" style={{ 
      padding: '24px', 
      borderRadius: '20px', 
      marginBottom: '32px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '32px'
    }}>
      <div>
        <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Répartition par Terroir</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {stats.topRegions.map(([name, count]) => (
            <div key={name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600 }}>{name}</span>
                <span style={{ opacity: 0.6 }}>{count}</span>
              </div>
              <div style={{ height: '4px', background: '#EEE', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  background: config.color, 
                  width: `${(count / stats.total) * 100}%`,
                  transition: 'width 1s ease-out'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Styles & Variétés</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {stats.types.map(([name, count]) => (
            <div key={name} style={{ 
              padding: '6px 12px', 
              borderRadius: '8px', 
              background: config.soft, 
              color: config.color,
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              {name} <span style={{ opacity: 0.5, fontWeight: 400 }}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
