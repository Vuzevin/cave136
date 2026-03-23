import React, { useState, useEffect } from 'react';
import type { BaseFields, CategoryType } from '../types';
import { CATEGORY_CONFIG } from '../types';
import RatingStars from './RatingStars';
import { Search } from 'lucide-react';

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
});

export default function AddItemModal({ category, initialData, onSave, onClose }: AddItemModalProps) {
  const config = CATEGORY_CONFIG[category];
  const [form, setForm] = useState(() => initialData ? { ...initialData } : defaultForm(category));
  const [attrs, setAttrs] = useState<Record<string, unknown>>(initialData?.attributes || {});
  const [imageSearch, setImageSearch] = useState('');
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    onSave({ ...form, category, attributes: attrs });
    onClose();
  }

  function updateAttr(key: string, val: unknown) {
    setAttrs(prev => ({ ...prev, [key]: val }));
  }

  async function handleAutoImage() {
    if (!imageSearch && !form.name) return;
    setImageLoading(true);
    const mockImages: Record<CategoryType, string> = {
      wine: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
      whisky: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&q=80',
      beer: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&q=80',
      coffee: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
      tea: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80',
    };
    setTimeout(() => {
      setForm(f => ({ ...f, image_url: mockImages[category] }));
      setImageLoading(false);
    }, 700);
  }

  const rowStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 };
  const twoCol: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%', maxWidth: 680, maxHeight: '90vh',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid #2A2A2E',
          background: `linear-gradient(90deg, ${config.color}22, transparent)`,
        }}>
          <h2 style={{ fontSize: 22, color: '#F0EDE8', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 28 }}>{config.emoji}</span>
            {initialData ? 'Modifier' : 'Ajouter'} — {config.label.replace('Ma Cave à ', '')}
          </h2>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: 10, border: '1px solid #2A2A2E',
            background: 'transparent', cursor: 'pointer', color: '#9A948C',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} style={{ overflowY: 'auto', padding: '20px 24px', flex: 1 }}>
          {/* Image */}
          <div style={rowStyle}>
            <label>Image (URL)</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={form.image_url || ''}
                onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                placeholder="https://…"
                style={{ flex: 1 }}
              />
              <input
                value={imageSearch}
                onChange={e => setImageSearch(e.target.value)}
                placeholder="Recherche auto…"
                style={{ flex: 1 }}
              />
              <button type="button" onClick={handleAutoImage} disabled={imageLoading} style={{
                padding: '0 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: `linear-gradient(135deg, ${config.color}, ${config.accent})`,
                color: 'white', fontWeight: 600, fontSize: 13, display: 'flex',
                alignItems: 'center', gap: 6, whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                {imageLoading ? '…' : <><Search size={13} /> Auto</>}
              </button>
            </div>
            {form.image_url && (
              <img src={form.image_url} alt="preview" style={{
                width: '100%', height: 140, objectFit: 'cover',
                borderRadius: 10, border: '1px solid #2A2A2E', marginTop: 4,
              }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            )}
          </div>

          {/* Name + Price */}
          <div style={twoCol}>
            <div style={rowStyle}>
              <label>Nom *</label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nom de la boisson" />
            </div>
            <div style={rowStyle}>
              <label>Prix (€)</label>
              <input type="number" value={form.price ?? ''} onChange={e => setForm(f => ({ ...f, price: e.target.value ? Number(e.target.value) : undefined }))} placeholder="0.00" step="0.01" />
            </div>
          </div>

          {/* Country + Region */}
          <div style={twoCol}>
            <div style={rowStyle}>
              <label>Pays</label>
              <input value={form.country || ''} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} placeholder="France" />
            </div>
            <div style={rowStyle}>
              <label>Région</label>
              <input value={form.region || ''} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} placeholder="Bordeaux" />
            </div>
          </div>

          {/* WINE */}
          {category === 'wine' && (
            <>
              <div style={twoCol}>
                <div style={rowStyle}>
                  <label>Type de vin</label>
                  <select value={(attrs.wine_type as string) || ''} onChange={e => updateAttr('wine_type', e.target.value)}>
                    <option value="">Choisir…</option>
                    {WINE_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div style={rowStyle}>
                  <label>Millésime</label>
                  <input type="number" value={(attrs.year as number) || ''} onChange={e => updateAttr('year', Number(e.target.value))} placeholder="2020" min="1800" max="2030" />
                </div>
              </div>
              <div style={twoCol}>
                <div style={rowStyle}>
                  <label>Cépage</label>
                  <input value={(attrs.grape as string) || ''} onChange={e => updateAttr('grape', e.target.value)} placeholder="Pinot Noir" />
                </div>
                <div style={rowStyle}>
                  <label>Date d'apogée</label>
                  <input value={(attrs.peak_date as string) || ''} onChange={e => updateAttr('peak_date', e.target.value)} placeholder="2025-2030" />
                </div>
              </div>
              <div style={twoCol}>
                <div style={rowStyle}>
                  <label>Maison / Domaine</label>
                  <input value={(attrs.domain as string) || ''} onChange={e => updateAttr('domain', e.target.value)} placeholder="Château Margaux" />
                </div>
                <div style={rowStyle}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, flexDirection: 'row', marginBottom: 0 }}>
                    <input type="checkbox" checked={!!attrs.bio} onChange={e => updateAttr('bio', e.target.checked)} style={{ width: 'auto' }} />
                    🌿 Agriculture Biologique
                  </label>
                </div>
              </div>
              <div style={rowStyle}>
                <label>Accords mets / vins</label>
                <input value={form.food_pairing || ''} onChange={e => setForm(f => ({ ...f, food_pairing: e.target.value }))} placeholder="Agneau rôti, fromages…" />
              </div>
              <div style={twoCol}>
                <div style={rowStyle}>
                  <label>Note dégustation 1 {config.ratingIcon}</label>
                  <RatingStars value={form.rating_general} onChange={v => setForm(f => ({ ...f, rating_general: v }))} icon={config.ratingIcon} />
                </div>
                <div style={rowStyle}>
                  <label>Note dégustation 2 ⭐</label>
                  <RatingStars value={form.rating_secondary || 0} onChange={v => setForm(f => ({ ...f, rating_secondary: v }))} icon="⭐" />
                </div>
              </div>
              <div style={twoCol}>
                <div style={rowStyle}>
                  <label>Ressenti 1</label>
                  <textarea value={form.feeling_1 || ''} onChange={e => setForm(f => ({ ...f, feeling_1: e.target.value }))} rows={3} placeholder="Arômes, bouche, finale…" />
                </div>
                <div style={rowStyle}>
                  <label>Ressenti 2</label>
                  <textarea value={form.feeling_2 || ''} onChange={e => setForm(f => ({ ...f, feeling_2: e.target.value }))} rows={3} placeholder="Évolution, complexité…" />
                </div>
              </div>
              <div style={rowStyle}>
                <label>Plat consommé avec</label>
                <input value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Filet de bœuf…" />
              </div>
            </>
          )}

          {/* WHISKY */}
          {category === 'whisky' && (
            <>
              <div style={twoCol}>
                <div style={rowStyle}>
                  <label>Distillerie</label>
                  <input value={(attrs.distillery as string) || ''} onChange={e => updateAttr('distillery', e.target.value)} placeholder="Glenfiddich" />
                </div>
                <div style={rowStyle}>
                  <label>Âge (années)</label>
                  <input type="number" value={(attrs.age as number) || ''} onChange={e => updateAttr('age', Number(e.target.value))} placeholder="12" />
                </div>
              </div>
              <div style={twoCol}>
                <div style={rowStyle}>
                  <label>Type de fût</label>
                  <input value={(attrs.cask_type as string) || ''} onChange={e => updateAttr('cask_type', e.target.value)} placeholder="Sherry, Bourbon…" />
                </div>
                <div style={rowStyle}>
                  <label>Niveau de tourbe</label>
                  <select value={(attrs.peat_level as string) || ''} onChange={e => updateAttr('peat_level', e.target.value)}>
                    <option value="">Choisir…</option>
                    <option>Non-tourbé</option><option>Légèrement tourbé</option>
                    <option>Moyennement tourbé</option><option>Très tourbé</option>
                  </select>
                </div>
              </div>
              <div style={rowStyle}><label>Note {config.ratingIcon}</label><RatingStars value={form.rating_general} onChange={v => setForm(f => ({ ...f, rating_general: v }))} icon={config.ratingIcon} /></div>
              <div style={rowStyle}><label>Notes de dégustation</label><textarea value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} placeholder="Vanille, caramel, fumée…" /></div>
            </>
          )}

          {/* BEER */}
          {category === 'beer' && (
            <>
              <div style={twoCol}>
                <div style={rowStyle}><label>Brasserie</label><input value={(attrs.brewery as string) || ''} onChange={e => updateAttr('brewery', e.target.value)} placeholder="Duvel" /></div>
                <div style={rowStyle}>
                  <label>Style</label>
                  <select value={(attrs.style as string) || ''} onChange={e => updateAttr('style', e.target.value)}>
                    <option value="">Choisir…</option>
                    {['IPA', 'Double IPA', 'APA', 'Stout', 'Porter', 'Blonde', 'Blanche', 'Brune', 'Ambrée', 'Triple', 'Quadruple', 'Sour', 'Lager', 'Pilsner'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={twoCol}>
                <div style={rowStyle}><label>IBU (amertume)</label><input type="number" value={(attrs.ibu as number) || ''} onChange={e => updateAttr('ibu', Number(e.target.value))} placeholder="45" /></div>
                <div style={rowStyle}><label>Degré d'alcool (%)</label><input type="number" value={(attrs.abv as number) || ''} onChange={e => updateAttr('abv', Number(e.target.value))} placeholder="6.5" step="0.1" /></div>
              </div>
              <div style={rowStyle}><label>Note {config.ratingIcon}</label><RatingStars value={form.rating_general} onChange={v => setForm(f => ({ ...f, rating_general: v }))} icon={config.ratingIcon} /></div>
              <div style={rowStyle}><label>Impressions</label><textarea value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} placeholder="Houblons, malts…" /></div>
            </>
          )}

          {/* COFFEE */}
          {category === 'coffee' && (
            <>
              <div style={twoCol}>
                <div style={rowStyle}><label>Origine</label><input value={(attrs.origin as string) || ''} onChange={e => updateAttr('origin', e.target.value)} placeholder="Éthiopie" /></div>
                <div style={rowStyle}><label>Torréfacteur</label><input value={(attrs.roaster as string) || ''} onChange={e => updateAttr('roaster', e.target.value)} placeholder="Lomi…" /></div>
              </div>
              <div style={twoCol}>
                <div style={rowStyle}>
                  <label>Méthode d'extraction</label>
                  <select value={(attrs.extraction_method as string) || ''} onChange={e => updateAttr('extraction_method', e.target.value)}>
                    <option value="">Choisir…</option>
                    {['Espresso', 'V60', 'Chemex', 'AeroPress', 'Cafetière', 'Cold Brew', 'Moka', 'Capsules'].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div style={rowStyle}><label>Notes aromatiques</label><input value={(attrs.aroma_notes as string) || ''} onChange={e => updateAttr('aroma_notes', e.target.value)} placeholder="Fruits rouges, chocolat…" /></div>
              </div>
              <div style={rowStyle}><label>Note {config.ratingIcon}</label><RatingStars value={form.rating_general} onChange={v => setForm(f => ({ ...f, rating_general: v }))} icon={config.ratingIcon} /></div>
              <div style={rowStyle}><label>Impressions</label><textarea value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} placeholder="Corps, acidité…" /></div>
            </>
          )}

          {/* TEA */}
          {category === 'tea' && (
            <>
              <div style={twoCol}>
                <div style={rowStyle}>
                  <label>Type de thé</label>
                  <select value={(attrs.tea_type as string) || ''} onChange={e => updateAttr('tea_type', e.target.value)}>
                    <option value="">Choisir…</option>
                    {['Vert', 'Noir', 'Blanc', 'Oolong', 'Pu-erh', 'Rooibos', 'Matcha', 'Chai'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div style={rowStyle}><label>Origine</label><input value={(attrs.origin as string) || ''} onChange={e => updateAttr('origin', e.target.value)} placeholder="Japon, Chine…" /></div>
              </div>
              <div style={twoCol}>
                <div style={rowStyle}><label>Temps d'infusion</label><input value={(attrs.steep_time as string) || ''} onChange={e => updateAttr('steep_time', e.target.value)} placeholder="3 min" /></div>
                <div style={rowStyle}><label>Température de l'eau</label><input value={(attrs.water_temp as string) || ''} onChange={e => updateAttr('water_temp', e.target.value)} placeholder="80°C" /></div>
              </div>
              <div style={rowStyle}><label>Note {config.ratingIcon}</label><RatingStars value={form.rating_general} onChange={v => setForm(f => ({ ...f, rating_general: v }))} icon={config.ratingIcon} /></div>
              <div style={rowStyle}><label>Impressions</label><textarea value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} placeholder="Couleur, arômes, saveur…" /></div>
            </>
          )}

          {/* Submit */}
          <button type="submit" style={{
            width: '100%', padding: '14px',
            borderRadius: 12, background: `linear-gradient(135deg, ${config.color}, ${config.accent})`,
            color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer',
            border: 'none', marginTop: 8,
            boxShadow: `0 4px 20px ${config.color}66`,
          }}>
            {initialData ? '💾 Enregistrer' : `${config.emoji} Ajouter à la cave`}
          </button>
        </form>
      </div>
    </div>
  );
}
