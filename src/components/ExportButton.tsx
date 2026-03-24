import { Download } from 'lucide-react';
import type { BaseFields, CategoryType } from '../types';

interface ExportButtonProps {
  category: CategoryType;
  items: BaseFields[];
}

export default function ExportButton({ category, items }: ExportButtonProps) {
  const exportToCSV = () => {
    const catItems = items.filter(i => i.category === category);
    if (catItems.length === 0) return;

    const headers = ['Nom', 'Pays', 'Région', 'Prix', 'Note', 'Stock', 'Quantité', 'Notes de dégustation'];
    const rows = catItems.map(i => [
      i.name,
      i.country || '',
      i.region || '',
      i.price || 0,
      i.rating_general,
      i.in_stock ? 'Oui' : 'Non',
      i.quantity || 1,
      `"${(i.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `cave136_${category}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={exportToCSV}
      style={{
        background: 'none',
        border: '1px solid var(--border-soft)',
        borderRadius: '10px',
        padding: '0 12px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        transition: 'all 0.2s'
      }}
      title="Exporter en CSV"
    >
      <Download size={18} />
    </button>
  );
}
