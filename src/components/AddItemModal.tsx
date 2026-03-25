import React, { useState, useEffect } from 'react';
import type { BaseFields, CategoryType, WineAttributes, WhiskyAttributes, BeerAttributes, CoffeeAttributes, TeaAttributes } from '../types';
import { CATEGORY_CONFIG } from '../types';
import RatingStars from './RatingStars';
import { X, Camera, Loader2 } from 'lucide-react';
import { useToast } from '../App';
import BarcodeScanner from './BarcodeScanner';

interface AllAttributes extends WineAttributes, WhiskyAttributes, BeerAttributes, CoffeeAttributes, TeaAttributes {}

interface AddItemModalProps {
  category: CategoryType;
  initialData?: BaseFields | null;
  onSave: (item: Omit<BaseFields, 'id' | 'user_id' | 'created_at'>) => void;
  onClose: () => void;
}

const WINE_TYPES = ['Rouge', 'Blanc', 'Rosé', 'Champagne'];

const defaultForm = (cat: CategoryType): Omit<BaseFields, 'id' | 'user_id' | 'created_at'> => ({
  category: cat,
  name: '',
  image_url: '',
  rating_general: 0,
  rating_secondary: 0,
  feeling_1: '',
  feeling_2: '',
  food_pairing: '',
  country: '',
  region: '',
  price: undefined,
  notes: '',
  attributes: {},
  in_stock: true,
  quantity: 1
});

export default function AddItemModal({ category, initialData, onSave, onClose }: AddItemModalProps) {
  const config = CATEGORY_CONFIG[category];
  const [form, setForm] = useState(() => initialData ? { ...initialData } : defaultForm(category));
  const [attrs, setAttrs] = useState<AllAttributes>((initialData?.attributes as AllAttributes) || {});
  const [showScanner, setShowScanner] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const { addToast } = useToast();

  const handleScan = async (barcode: string) => {
    setScanLoading(true);
    try {
      const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${barcode}?fields=product_name,origins,brands,image_url,countries`);
      const data = await response.json();
      
      if (data.status === 1 && data.product) {
        const p = data.product;
        setForm(prev => ({
          ...prev,
          name: p.product_name || prev.name,
          country: p.origins || p.countries || prev.country,
          image_url: p.image_url || prev.image_url
        }));
        if (p.brands) {
          setAttrs(prev => ({ ...prev, domain: p.brands, distillery: p.brands, brewery: p.brands }));
        }
        addToast("Produit identifié avec succès !", "success");
      } else {
        alert("Produit non trouvé dans la base Open Food Facts.");
      }
    } catch (err) {
      console.error("OpenFoodFacts Error:", err);
    } finally {
      setScanLoading(false);
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    onSave({ ...form, category, attributes: attrs as Record<string, unknown> });
    onClose();
  }

  function updateAttr(key: string, val: string | number | boolean | undefined) {
    setAttrs(prev => ({ ...prev, [key]: val }));
  }

  const rowStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 };
  const twoCol: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="glass-card animate-fade-in modal-form" style={{
        width: '100%', maxWidth: '640px', maxHeight: '90vh',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px', borderBottom: '1px solid #2A2A2E',
        }}>
          <div>
            <h2 style={{ fontSize: '20px', color: '#F0EDE8', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>{config.emoji}</span>
              {initialData ? 'Modifier' : 'Ajouter'} {config.label}
            </h2>
            <p style={{ fontSize: '13px', color: '#9A948C', marginTop: '4px' }}>Remplissez les informations ci-dessous</p>
          </div>
          <button onClick={onClose} style={{
            width: '32px', height: '32px', borderRadius: '8px', border: 'none',
            background: '#2A2A2E', cursor: 'pointer', color: '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}><X size={18} /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} style={{ overflowY: 'auto', padding: '24px', flex: 1 }}>
          
          {/* Main Info */}
          <div style={rowStyle}>
            <label>Nom de l'item *</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Château Margaux, Lagavulin 16, etc." style={{ flex: 1 }} />
              <button 
                type="button"
                onClick={() => setShowScanner(true)}
                style={{ 
                  background: scanLoading ? '#F5F5F7' : config.bg, 
                  color: config.color, 
                  borderRadius: '12px', 
                  padding: '0 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {scanLoading ? <Loader2 className="animate-spin" size={18} /> : <Camera size={18} />}
                {scanLoading ? '...' : 'Scanner'}
              </button>
            </div>
          </div>

          <div style={twoCol}>
            <div style={rowStyle}>
              <label>Prix (€)</label>
              <input 
                type="number" 
                value={form.price === undefined ? '' : form.price} 
                onChange={e => setForm(f => ({ ...f, price: e.target.value === '' ? undefined : Number(e.target.value) }))} 
                placeholder="0.00" 
                step="0.01" 
              />
            </div>
            <div style={rowStyle}>
              <label>Pays / Région</label>
              <input 
                value={(form.country || '') + (form.country && form.region ? ', ' : '') + (form.region || '')} 
                onChange={e => {
                  const val = e.target.value;
                  if (!val.includes(',')) {
                    setForm(f => ({ ...f, country: val.trim(), region: '' }));
                  } else {
                    const [c, ...r] = val.split(',');
                    setForm(f => ({ ...f, country: c.trim(), region: r.join(',').trim() }));
                  }
                }} 
                placeholder="France, Bordeaux" 
              />
            </div>
          </div>

          {/* Type Selection (for Wine) */}
          {category === 'wine' && (
            <div style={twoCol}>
              <div style={rowStyle}>
                <label>Type de vin</label>
                <select value={(attrs.wine_type as string) || ''} onChange={e => updateAttr('wine_type', e.target.value)}>
                  <option value="">Sélectionner</option>
                  {WINE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={rowStyle}>
                <label>Millésime</label>
                <input type="number" value={(attrs.year as number) || ''} onChange={e => updateAttr('year', Number(e.target.value))} placeholder="2020" />
              </div>
            </div>
          )}

          {/* In Stock / Quantity Section */}
          <div style={{ 
            background: 'rgba(255,255,255,0.03)', 
            padding: '20px', 
            borderRadius: '12px', 
            border: '1px solid #2A2A2E',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: form.in_stock ? '16px' : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#F0EDE8', fontWeight: 600, fontSize: '14px' }}>Possédé dans la cave</span>
                <span style={{ fontSize: '12px', color: '#9A948C' }}>Si décoché, sera considéré comme une dégustation passée</span>
              </div>
              <div 
                onClick={() => setForm(f => ({ ...f, in_stock: !f.in_stock }))}
                style={{
                  width: '48px', height: '24px', borderRadius: '24px', cursor: 'pointer',
                  backgroundColor: form.in_stock ? config.color : '#444',
                  position: 'relative', transition: '.2s'
                }}
              >
                <div style={{
                  position: 'absolute', height: '18px', width: '18px', left: form.in_stock ? '26px' : '4px', bottom: '3px',
                  backgroundColor: 'white', borderRadius: '50%', transition: '.2s'
                }} />
              </div>
            </div>

            {form.in_stock && (
              <div style={rowStyle}>
                <label>Nombre de bouteilles / packs</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button type="button" onClick={() => setForm(f => ({ ...f, quantity: Math.max(1, (f.quantity || 1) - 1) }))} style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', background: '#333', color: 'white', cursor: 'pointer' }}>-</button>
                  <span style={{ fontSize: '18px', fontWeight: 700, width: '30px', textAlign: 'center', color: '#FFFFFF' }}>{form.quantity || 1}</span>
                  <button type="button" onClick={() => setForm(f => ({ ...f, quantity: (f.quantity || 1) + 1 }))} style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', background: '#333', color: 'white', cursor: 'pointer' }}>+</button>
                </div>
              </div>
            )}
          </div>

          {/* Category-Specific Advanced Fields */}
          <div style={{ 
            marginTop: '24px', 
            paddingTop: '24px', 
            borderTop: '1px solid #2A2A2E',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h4 style={{ fontSize: '13px', color: '#9A948C', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Détails Spécifiques</h4>
            
            {category === 'wine' && (
              <>
                <div style={twoCol}>
                  <div style={rowStyle}>
                    <label>Appellation</label>
                    <input value={(attrs.appellation as string) || ''} onChange={e => updateAttr('appellation', e.target.value)} placeholder="Ex: Pomerol" />
                  </div>
                  <div style={rowStyle}>
                    <label>Cépage</label>
                    <input value={(attrs.grape as string) || ''} onChange={e => updateAttr('grape', e.target.value)} placeholder="Ex: Merlot" />
                  </div>
                </div>
                <div style={rowStyle}>
                  <label>Terroir / Parcelle</label>
                  <input value={(attrs.terroir as string) || ''} onChange={e => updateAttr('terroir', e.target.value)} placeholder="Ex: Argiles bleues" />
                </div>
              </>
            )}

            {category === 'whisky' && (
              <>
                <div style={twoCol}>
                  <div style={rowStyle}>
                    <label>Distillerie</label>
                    <input value={(attrs.distillery as string) || ''} onChange={e => updateAttr('distillery', e.target.value)} placeholder="Ex: Ardbeg" />
                  </div>
                  <div style={rowStyle}>
                    <label>Âge (ans)</label>
                    <input type="number" value={(attrs.age as number) || ''} onChange={e => updateAttr('age', e.target.value ? Number(e.target.value) : undefined)} placeholder="10" />
                  </div>
                </div>
                <div style={twoCol}>
                  <div style={rowStyle}>
                    <label>Type de fût</label>
                    <input value={(attrs.cask_type as string) || ''} onChange={e => updateAttr('cask_type', e.target.value)} placeholder="Ex: Sherry Cask" />
                  </div>
                  <div style={rowStyle}>
                    <label>Alcool (%)</label>
                    <input type="number" step="0.1" value={(attrs.strength as number) || ''} onChange={e => updateAttr('strength', e.target.value ? Number(e.target.value) : undefined)} placeholder="46.3" />
                  </div>
                </div>
                <div style={rowStyle}>
                  <label>Niveau de tourbe</label>
                  <input value={(attrs.peat_level as string) || ''} onChange={e => updateAttr('peat_level', e.target.value)} placeholder="Ex: Très tourbé" />
                </div>
              </>
            )}

            {category === 'beer' && (
              <>
                <div style={twoCol}>
                  <div style={rowStyle}>
                    <label>Brasserie</label>
                    <input value={(attrs.brewery as string) || ''} onChange={e => updateAttr('brewery', e.target.value)} placeholder="Ex: BrewDog" />
                  </div>
                  <div style={rowStyle}>
                    <label>Style</label>
                    <input value={(attrs.style as string) || ''} onChange={e => updateAttr('style', e.target.value)} placeholder="Ex: IPA" />
                  </div>
                </div>
                <div style={twoCol}>
                  <div style={rowStyle}>
                    <label>Alcool (%)</label>
                    <input type="number" step="0.1" value={(attrs.abv as number) || ''} onChange={e => updateAttr('abv', e.target.value ? Number(e.target.value) : undefined)} placeholder="6.5" />
                  </div>
                  <div style={rowStyle}>
                    <label>IBU (Amertume)</label>
                    <input type="number" value={(attrs.ibu as number) || ''} onChange={e => updateAttr('ibu', e.target.value ? Number(e.target.value) : undefined)} placeholder="45" />
                  </div>
                </div>
              </>
            )}

            {category === 'coffee' && (
              <>
                <div style={twoCol}>
                  <div style={rowStyle}>
                    <label>Torréfacteur</label>
                    <input value={(attrs.roaster as string) || ''} onChange={e => updateAttr('roaster', e.target.value)} placeholder="Ex: Blue Bottle" />
                  </div>
                  <div style={rowStyle}>
                    <label>Origine</label>
                    <input value={(attrs.origin as string) || ''} onChange={e => updateAttr('origin', e.target.value)} placeholder="Ex: Éthiopie Sidamo" />
                  </div>
                </div>
                <div style={rowStyle}>
                  <label>Méthode d'extraction</label>
                  <input value={(attrs.extraction_method as string) || ''} onChange={e => updateAttr('extraction_method', e.target.value)} placeholder="Ex: V60, Espresso" />
                </div>
                <div style={rowStyle}>
                  <label>Notes aromatiques</label>
                  <input value={(attrs.aroma_notes as string) || ''} onChange={e => updateAttr('aroma_notes', e.target.value)} placeholder="Ex: Myrtille, Chocolat" />
                </div>
              </>
            )}

            {category === 'tea' && (
              <>
                <div style={twoCol}>
                  <div style={rowStyle}>
                    <label>Type de thé</label>
                    <input value={(attrs.tea_type as string) || ''} onChange={e => updateAttr('tea_type', e.target.value)} placeholder="Ex: Oolong, Sencha" />
                  </div>
                  <div style={rowStyle}>
                    <label>Origine</label>
                    <input value={(attrs.origin as string) || ''} onChange={e => updateAttr('origin', e.target.value)} placeholder="Ex: Yunnan, Chine" />
                  </div>
                </div>
                <div style={twoCol}>
                  <div style={rowStyle}>
                    <label>Temps d'infusion</label>
                    <input value={(attrs.steep_time as string) || ''} onChange={e => updateAttr('steep_time', e.target.value)} placeholder="Ex: 3 min" />
                  </div>
                  <div style={rowStyle}>
                    <label>Température (°C)</label>
                    <input value={(attrs.water_temp as string) || ''} onChange={e => updateAttr('water_temp', e.target.value)} placeholder="Ex: 80°C" />
                  </div>
                </div>
              </>
            )}
          </div>

          <div style={rowStyle}>
            <label>Note générale</label>
            <RatingStars value={form.rating_general} onChange={v => setForm(f => ({ ...f, rating_general: v }))} icon={config.ratingIcon} />
          </div>

          <div style={rowStyle}>
            <label>Notes de dégustation</label>
            <textarea value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} placeholder="Arômes, robe, impressions personnelles..." />
          </div>

          <div style={rowStyle}>
            <label>Image (URL)</label>
            <input value={form.image_url || ''} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." />
          </div>

          <button type="submit" style={{
            width: '100%', padding: '16px', borderRadius: '12px',
            background: config.color, color: 'white', fontWeight: 700,
            fontSize: '16px', border: 'none', cursor: 'pointer',
            boxShadow: `0 8px 24px ${config.color}44`,
            marginTop: '12px'
          }}>
            {initialData ? '💾 Enregistrer les modifications' : '✨ Ajouter à Cave136'}
          </button>
        </form>

        {showScanner && (
          <BarcodeScanner 
            onScan={handleScan}
            onClose={() => setShowScanner(false)}
          />
        )}
      </div>
    </div>
  );
}
