interface RatingStarsProps {
  value: number;
  onChange?: (val: number) => void;
  icon?: string;
  readonly?: boolean;
  size?: number;
}

export default function RatingStars({ value, onChange, icon = '⭐', readonly = false, size = 20 }: RatingStarsProps) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange && onChange(star)}
          style={{
            fontSize: size,
            cursor: readonly ? 'default' : 'pointer',
            border: 'none',
            background: 'none',
            padding: 0,
            filter: star <= value ? 'none' : 'grayscale(100%) opacity(0.3)',
            transition: 'filter 0.2s, transform 0.1s',
          }}
          onMouseEnter={e => { if (!readonly) (e.currentTarget as HTMLElement).style.transform = 'scale(1.2)'; }}
          onMouseLeave={e => { if (!readonly) (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
