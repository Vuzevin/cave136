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
    const types = Object.entries(byType).sort((a,b) => b[1] - a[1]).slice(0, 6);

    const totalBottles = catItems.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
    const totalValue = catItems.reduce((acc, curr) => acc + (curr.price || 0) * (curr.quantity || 1), 0);
    const maxRating = Math.max(0, ...catItems.map(i => i.rating_general).filter(Boolean) as number[]);
    const maxPrice = Math.max(0, ...catItems.map(i => i.price).filter(Boolean) as number[]);

    return { topRegions, types, total: catItems.length, totalBottles, totalValue, maxRating, maxPrice };
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h4 style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Origines Dominantes</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stats.topRegions.map(([name, count]) => (
              <div key={name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600 }}>{name}</span>
                  <span style={{ opacity: 0.6 }}>{count} bottles</span>
                </div>
                <div style={{ height: '4px', background: '#F1F1F1', borderRadius: '100px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    background: config.color, 
                    width: `${(count / stats.totalBottles) * 100}%`,
                    transition: 'width 1s cubic-bezier(0.17, 0.67, 0.83, 0.67)'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ background: '#F8F9FA', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#9A948C', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Note Max</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: config.color }}>{stats.maxRating}/5</span>
          </div>
          <div style={{ background: '#F8F9FA', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#9A948C', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Valeur Tot.</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#27AE60' }}>{Math.round(stats.totalValue)}€</span>
          </div>
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Styles & Variétés</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {stats.types.map(([name, count]) => (
            <div key={name} style={{ 
              padding: '10px', 
              borderRadius: '12px', 
              background: '#FFFFFF', 
              border: '1px solid #F0F0F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#333' }}>{name}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{count} références</span>
            </div>
          ))}
          {stats.types.length === 0 && (
            <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '12px' }}>
              Pas encore de styles répertoriés.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
