import type { BaseFields, WineAttributes, WhiskyAttributes, BeerAttributes, CoffeeAttributes, TeaAttributes } from '../types';
import { CATEGORY_CONFIG } from '../types';
import RatingStars from './RatingStars';
import { Trash2, Edit2, MapPin } from 'lucide-react';

interface AllAttributes extends WineAttributes, WhiskyAttributes, BeerAttributes, CoffeeAttributes, TeaAttributes {}

interface BeverageCardProps {
  item: BaseFields;
  onEdit: (item: BaseFields) => void;
  onDelete: (id: string) => void;
}

export default function BeverageCard({ item, onEdit, onDelete }: BeverageCardProps) {
  const config = CATEGORY_CONFIG[item.category];
  const attrs = item.attributes as AllAttributes;

  return (
    <div className="card animate-fade-in" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Image Area */}
      <div style={{ 
        height: '200px', 
        backgroundColor: config.soft,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ fontSize: '64px' }}>{config.emoji}</span>
        )}

        {/* Category-specific Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: '#FFFFFF',
          padding: '6px 12px',
          borderRadius: '100px',
          fontSize: '11px',
          fontWeight: 700,
          color: config.color,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {attrs.wine_type || attrs.style || attrs.tea_type || config.label}
        </div>

        {/* Quantity Badge (for cave items) */}
        {item.in_stock && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: config.color,
            color: '#FFFFFF',
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 700
          }}>
            {item.quantity || 1}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '18px', margin: 0, fontWeight: 700, lineHeight: 1.2 }}>{item.name}</h3>
          {item.price && <span style={{ fontWeight: 700, color: config.color }}>{item.price}€</span>}
        </div>

        {(item.region || item.country) && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px', 
            fontSize: '12px', 
            color: 'var(--text-secondary)',
            marginBottom: '12px'
          }}>
            <MapPin size={12} />
            {item.region}{item.region && item.country ? ', ' : ''}{item.country}
          </div>
        )}

        {/* Key Attributes Row */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {attrs.year && (
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', backgroundColor: '#F0F0F0', padding: '2px 8px', borderRadius: '4px' }}>
              Année {attrs.year}
            </div>
          )}
          {attrs.abv && (
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', backgroundColor: '#F0F0F0', padding: '2px 8px', borderRadius: '4px' }}>
              {attrs.abv}% alc.
            </div>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <RatingStars value={item.rating_general} readonly icon={config.ratingIcon} size={16} />
        </div>

        {item.notes && (
          <p style={{ 
            fontSize: '13px', 
            color: 'var(--text-secondary)', 
            fontStyle: 'italic',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            margin: '0 0 20px 0'
          }}>
            "{item.notes}"
          </p>
        )}

        {/* Footer Actions */}
        <div style={{ 
          marginTop: 'auto', 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '8px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-soft)'
        }}>
          <button 
            onClick={() => onEdit(item)}
            className="btn-icon"
            style={{ 
              background: 'none', border: 'none', padding: '6px', cursor: 'pointer',
              color: 'var(--text-muted)', borderRadius: '6px', transition: 'all 0.2s'
            }}
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => onDelete(item.id!)}
            className="btn-icon"
            style={{ 
              background: 'none', border: 'none', padding: '6px', cursor: 'pointer',
              color: 'var(--text-muted)', borderRadius: '6px', transition: 'all 0.2s'
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <style>{`
        .btn-icon:hover { color: var(--text-primary) !important; background-color: #F5F5F5 !important; }
        .btn-icon:last-child:hover { color: #E53E3E !important; }
      `}</style>
    </div>
  );
}
