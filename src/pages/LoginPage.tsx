import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Wine } from 'lucide-react';

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('funfact1806@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await signIn(email, password);
    if (error) setError('Email ou mot de passe incorrect.');
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 30% 40%, #2a0a0a 0%, #0d0d0f 60%)' }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, #8B1A1A33, transparent)',
        top: '10%', left: '-10%', filter: 'blur(60px)',
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, #B8860B22, transparent)',
        bottom: '10%', right: '-5%', filter: 'blur(60px)',
      }} />

      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: 420, padding: 40, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #8B1A1A, #C0392B)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px #8B1A1A66',
          }}>
            <Wine size={32} color="white" />
          </div>
          <h1 style={{ fontSize: 32, color: '#F0EDE8', marginBottom: 4 }}>Cave136</h1>
          <p style={{ color: '#9A948C', fontSize: 14 }}>Votre carnet de dégustation</p>
        </div>

        {error && (
          <div style={{
            background: '#8B1A1A33', border: '1px solid #8B1A1A',
            borderRadius: 10, padding: '10px 14px', marginBottom: 20,
            color: '#ff7b7b', fontSize: 14,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>
          <div>
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              padding: '14px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #8B1A1A, #C0392B)',
              color: 'white',
              fontWeight: 700,
              fontSize: 15,
              cursor: loading ? 'not-allowed' : 'pointer',
              border: 'none',
              transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 20px #8B1A1A55',
            }}
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: '#9A948C', fontSize: 13 }}>
          Compte de démonstration : funfact1806@gmail.com
        </p>
      </div>
    </div>
  );
}
