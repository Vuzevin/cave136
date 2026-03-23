import type { BaseFields } from '../types';
import { CATEGORY_CONFIG } from '../types';
import RatingStars from './RatingStars';
import { Trash2, Edit2, MapPin, DollarSign } from 'lucide-react';

interface BeverageCardProps {
  item: BaseFields;
  onEdit: (item: BaseFields) => void;
  onDelete: (id: string) => void;
}

export default function BeverageCard({ item, onEdit, onDelete }: BeverageCardProps) {
  const config = CATEGORY_CONFIG[item.category];
  const attrs = item.attributes as Record<string, unknown>;

  return (
    <div className="glass-card animate-fade-in" style={{
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px ${config.color}33`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Image */}
      <div style={{
        height: 180, background: item.image_url
          ? `url(${item.image_url}) center/cover no-repeat`
          : `linear-gradient(135deg, ${config.color}44, ${config.color}22)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
      }}>
        {!item.image_url && (
          <span style={{ fontSize: 56, opacity: 0.6 }}>{config.emoji}</span>
        )}
        {/* Category badge */}
        <div style={{
          position: 'absolute', top: 10, left: 10,
          background: `${config.color}dd`, borderRadius: 20,
          padding: '4px 10px', fontSize: 11, fontWeight: 700, color: 'white',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {config.emoji} {String(attrs.wine_type || attrs.style || config.label.replace('Ma Cave à ', ''))}
        </div>
        {/* Bio badge */}
        {Boolean(attrs.bio) && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: '#2E7D32dd', borderRadius: 20,
            padding: '4px 8px', fontSize: 11, fontWeight: 700, color: 'white',
          }}>🌿 Bio</div>
        )}
        {/* Actions */}
        <div style={{ position: 'absolute', bottom: 10, right: 10, display: 'flex', gap: 6 }}>
          <button onClick={() => onEdit(item)} style={{
            width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
            background: 'rgba(22,22,24,0.85)', color: '#9A948C', display: 'flex',
            alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)',
            transition: 'all 0.2s',
          }}>
            <Edit2 size={14} />
          </button>
          <button onClick={() => onDelete(item.id!)} style={{
            width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
            background: 'rgba(22,22,24,0.85)', color: '#9A948C', display: 'flex',
            alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)',
            transition: 'all 0.2s',
          }}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F0EDE8', flex: 1, marginRight: 8, lineHeight: 1.3 }}>
            {item.name}
          </h3>
          {item.price !== undefined && item.price !== null && (
            <span style={{
              display: 'flex', alignItems: 'center', gap: 2,
              fontSize: 13, fontWeight: 600, color: config.accent, whiteSpace: 'nowrap',
            }}>
              <DollarSign size={12} />{item.price}€
            </span>
          )}
        </div>

        {(item.country || item.region) && (
          <p style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#9A948C', marginBottom: 10 }}>
            <MapPin size={11} />
            {[item.region, item.country].filter(Boolean).join(', ')}
          </p>
        )}

        {Boolean(attrs.year) && (
          <p style={{ fontSize: 12, color: '#9A948C', marginBottom: 8 }}>Millésime {String(attrs.year)}</p>
        )}

        <RatingStars value={item.rating_general} readonly icon={config.ratingIcon} size={16} />

        {item.rating_secondary !== undefined && item.rating_secondary > 0 && (
          <div style={{ marginTop: 4 }}>
            <RatingStars value={item.rating_secondary} readonly icon="⭐" size={14} />
          </div>
        )}

        {item.notes && (
          <p style={{
            marginTop: 10, fontSize: 12, color: '#9A948C', fontStyle: 'italic',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>"{item.notes}"</p>
        )}
      </div>

      {/* Color bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${config.color}, ${config.accent})` }} />
    </div>
  );
}
