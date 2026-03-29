import React, { useState, useRef } from 'react';
import { X, Upload, Loader2, FileText, AlertCircle } from 'lucide-react';
import type { CategoryType } from '../types';
import { CATEGORY_CONFIG } from '../types';
import { useToast } from '../App';

interface ImportDataModalProps {
  category: CategoryType;
  onImport: (items: any[]) => Promise<void>;
  onClose: () => void;
}

export default function ImportDataModal({ category, onImport, onClose }: ImportDataModalProps) {
  const config = CATEGORY_CONFIG[category];
  const [loading, setLoading] = useState(false);
  const [errorLine, setErrorLine] = useState('');
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const expectedHeaders = ['Nom', 'Pays', 'Region', 'Prix', 'Note', 'Stock', 'Quantite', 'Notes'];

  const parseCSV = (text: string) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length < 2) throw new Error("Le fichier semble vide ou ne contient que les entêtes.");
    
    // Check headers loosely
    const headerLine = lines[0].toLowerCase();
    if (!headerLine.includes('nom')) throw new Error("La colonne 'Nom' est obligatoire.");

    const items = [];
    for (let i = 1; i < lines.length; i++) {
        const rawLine = lines[i];
        // Simple fallback if regex fails
        const simpleCols = rawLine.split(',').map((c: string) => c.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
        
        try {
            const name = simpleCols[0] || 'Inconnu';
            const country = simpleCols[1] || '';
            const region = simpleCols[2] || '';
            const price = simpleCols[3] ? parseFloat(simpleCols[3]) : undefined;
            const rating = simpleCols[4] ? parseInt(simpleCols[4]) : 0;
            const inStock = simpleCols[5] ? simpleCols[5].toLowerCase().startsWith('o') : true; // 'oui', 'o', 'yes'
            const quantity = simpleCols[6] ? parseInt(simpleCols[6]) : 1;
            const notes = simpleCols[7] || '';

            items.push({
                category,
                name,
                country,
                region,
                price: isNaN(price as number) ? undefined : price,
                rating_general: isNaN(rating) ? 0 : Math.min(5, Math.max(0, rating)),
                in_stock: inStock,
                quantity: isNaN(quantity) ? 1 : quantity,
                notes,
                attributes: {},
                bio: false
            });
        } catch (e: any) {
            setErrorLine(`Erreur ligne ${i+1}: ${e.message}`);
            throw new Error(`Erreur ligne ${i+1}: Vérifiez le format.`);
        }
    }
    return items;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setErrorLine('');
    
    try {
        const text = await file.text();
        const itemsToImport = parseCSV(text);
        await onImport(itemsToImport);
        addToast(`${itemsToImport.length} items importés avec succès`, 'success');
        onClose();
    } catch (err: any) {
        setErrorLine(err.message || 'Erreur lors de la lecture du fichier CSV');
    } finally {
        setLoading(false);
    }
  };

  const currentExpected = expectedHeaders.join(', ');

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%', maxWidth: '500px',
        padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '24px', color: '#F0EDE8', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Upload size={24} color={config.color} /> Import CSV
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#9A948C', cursor: 'pointer'
          }}><X size={20} /></button>
        </div>

        <div style={{ color: '#9A948C', fontSize: '14px', lineHeight: 1.6 }}>
          <p>Importez votre collection via un fichier CSV (séparateur: virgule).</p>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', marginTop: '12px' }}>
            <strong style={{ color: '#F0EDE8', display: 'block', marginBottom: '8px' }}>Format attendu des colonnes :</strong>
            <code style={{ fontSize: '12px', color: config.accent, wordBreak: 'break-all' }}>
              {currentExpected}
            </code>
          </div>
        </div>

        {errorLine && (
          <div style={{ background: 'rgba(229, 62, 62, 0.1)', color: '#FC8181', padding: '12px', borderRadius: '8px', display: 'flex', fontSize: '13px', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} /> {errorLine}
          </div>
        )}

        <input 
          type="file" 
          accept=".csv" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />

        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          style={{
            width: '100%', padding: '16px', borderRadius: '12px',
            background: config.color, color: 'white', fontWeight: 700,
            fontSize: '16px', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
          }}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
          {loading ? 'Importation en cours...' : 'Sélectionner un fichier CSV'}
        </button>
      </div>
    </div>
  );
}
