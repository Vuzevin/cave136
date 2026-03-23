# 🍷 Cave136 — Carnet de Dégustation Multi-Boissons

Cave136 est une application web complète de gestion de caves et de carnets de dégustation pour **Vin, Whisky, Bière, Café et Thé**.

## Stack

- **Frontend** : React + TypeScript + Vite + Tailwind CSS
- **Backend / Auth / DB** : Supabase (PostgreSQL + Auth)
- **Déploiement** : Netlify
- **Cartes interactives** : react-simple-maps + d3-scale

## Fonctionnalités

- 🔐 Authentification Supabase sécurisée
- 🍷 Cave à Vin : double notation, double ressenti, cépage, millésime, bio, accords mets/vins
- 🥃 Cave à Whisky : distillerie, âge, fût, tourbe
- 🍺 Cave à Bière : style, brasserie, IBU, degré d'alcool
- ☕ Cave à Café : origine, torréfacteur, méthode d'extraction
- 🍵 Cave à Thé : type, infusion, température
- 🔍 Filtres avancés : pays, note, prix, texte libre, tri
- 🗺️ Carte de France interactive (heatmap régions)
- 🌍 Carte du Monde interactive (heatmap pays)

## Démarrage rapide

```bash
npm install --legacy-peer-deps
cp .env.example .env
# Remplir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env
npm run dev
```

## Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Copier l'URL et la clé anon dans `.env`
3. Exécuter `supabase/schema.sql` dans le SQL Editor
4. Créer l'utilisateur de test dans Authentication → Users :
   - Email : `funfact1806@gmail.com` / Password : `Usertest1234!`

## Déploiement Netlify

Le fichier `netlify.toml` est déjà configuré. Il suffit de :
1. Lier le repo GitHub à Netlify
2. Ajouter les variables d'environnement `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
3. Déployer !
