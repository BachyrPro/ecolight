# 🌱 Ecolight Frontend

## Interface Utilisateur React pour la Gestion Intelligente des Déchets

[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3+-38B2AC.svg)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-purple.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

---

## 📋 Table des Matières

- [🎯 Présentation](#-présentation)
- [🚀 Démarrage rapide](#-démarrage-rapide)
- [🏗️ Architecture](#️-architecture)
- [📦 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🎨 Design System](#-design-system)
- [🧪 Tests](#-tests)
- [🚀 Build & Déploiement](#-build--déploiement)
- [📱 Progressive Web App](#-progressive-web-app)
- [🔧 Optimisations](#-optimisations)

---

## 🎯 Présentation

Ecolight Frontend est une application React moderne et responsive qui offre une interface utilisateur intuitive pour la gestion des déchets. L'application permet aux citoyens d'interagir facilement avec les services de collecte, de gérer leurs abonnements, et de contribuer à un environnement plus propre.

### ✨ Fonctionnalités Principales

- **🔐 Authentification complète** : Inscription, connexion, gestion de profil
- **📱 Interface responsive** : Optimisée pour mobile, tablette et desktop
- **🎨 Design moderne** : Interface élégante avec Tailwind CSS et Framer Motion
- **⚡ Performance optimisée** : Lazy loading, code splitting, cache intelligent
- **🌐 PWA Ready** : Fonctionnement hors ligne et installation native
- **♿ Accessibilité** : Conforme aux standards WCAG 2.1
- **🔄 État synchronisé** : Gestion d'état globale avec React Context
- **📊 Visualisations** : Graphiques et statistiques avec Recharts
- **🗺️ Cartes interactives** : Géolocalisation avec React Leaflet

---

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 16+
- npm ou yarn
- Backend Ecolight en cours d'exécution

### Installation Express

```bash
# 1. Cloner le repository
git clone https://github.com/ecolight/ecolight-frontend.git
cd ecolight-frontend

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env
# Éditer le fichier .env avec vos configurations

# 4. Démarrer en mode développement
npm start
```

L'application sera accessible sur `http://localhost:3000`

---

## 🏗️ Architecture

### Structure du Projet

```
ecolight-frontend/
├── 📁 public/                  # Fichiers statiques
│   ├── index.html
│   ├── manifest.json
│   └── icons/
├── 📁 src/
│   ├── 📁 components/          # Composants React
│   │   ├── 📁 common/          # Composants réutilisables
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── Pagination.js
│   │   │   └── StatsCard.js
│   │   ├── 📁 layout/          # Composants de layout
│   │   │   ├── Header.js
│   │   │   ├── Sidebar.js
│   │   │   └── Layout.js
│   │   ├── Dashboard.js        # Page tableau de bord
│   │   ├── LoginRegister.js    # Authentification
│   │   ├── Collectors.js       # Liste des collecteurs
│   │   ├── Notifications.js    # Gestion notifications
│   │   └── ...
│   ├── 📁 hooks/               # Hooks personnalisés
│   │   ├── useAuth.js          # Authentification
│   │   ├── useApi.js           # Requêtes API
│   │   └── useLocalStorage.js  # Storage local
│   ├── 📁 services/            # Services externes
│   │   ├── api.js              # Client API centralisé
│   │   ├── auth.js             # Service authentification
│   │   └── storage.js          # Gestion du stockage
│   ├── 📁 utils/               # Utilitaires
│   │   ├── constants.js        # Constantes
│   │   ├── helpers.js          # Fonctions utilitaires
│   │   └── validators.js       # Validateurs
│   ├── 📁 styles/              # Styles CSS
│   │   ├── globals.css         # Styles globaux
│   │   └── components.css      # Styles composants
│   ├── App.js                  # Composant racine
│   └── index.js                # Point d'entrée
├── 📄 package.json
├── 📄 tailwind.config.js       # Configuration Tailwind
├── 📄 Dockerfile              # Configuration Docker
└── 📄 nginx.conf               # Configuration Nginx
```

### Technologies Utilisées

**Core :**
- React 18+ avec Hooks
- React Router 6 pour le routing
- React Hook Form pour les formulaires
- Axios pour les requêtes HTTP

**UI/UX :**
- Tailwind CSS pour le styling
- Framer Motion pour les animations
- Heroicons pour les icônes
- React Hot Toast pour les notifications

**État et données :**
- React Context pour l'état global
- React Query pour le cache et synchronisation
- Local Storage pour la persistance

**Cartes et géolocalisation :**
- React Leaflet pour les cartes
- OpenStreetMap comme fournisseur de tuiles

**Outils de développement :**
- ESLint pour le linting
- Prettier pour le formatage
- Husky pour les git hooks

---

## 📦 Installation

### Installation Locale Détaillée

```bash
# Installation des dépendances
npm install

# Installation des outils de développement (optionnel)
npm install -g serve

# Vérification de l'installation
npm run lint
npm test
```

### Configuration des Variables d'Environnement

Créer un fichier `.env` :

```bash
# API Backend
REACT_APP_API_URL=http://localhost:3000
REACT_APP_API_TIMEOUT=10000

# Application
REACT_APP_NAME=Ecolight
REACT_APP_VERSION=1.0.0

# Cartes
REACT_APP_MAP_DEFAULT_CENTER_LAT=48.8566
REACT_APP_MAP_DEFAULT_CENTER_LNG=2.3522
REACT_APP_MAP_DEFAULT_ZOOM=13

# Authentification
REACT_APP_JWT_STORAGE_KEY=ecolight_token
REACT_APP_SESSION_TIMEOUT=86400000

# Debug
REACT_APP_DEBUG_MODE=true
REACT_APP_SHOW_DEV_TOOLS=true

# Analytics (optionnel)
REACT_APP_GOOGLE_ANALYTICS_ID=GA-XXXX-X
```

---

## ⚙️ Configuration

### Configuration Tailwind CSS

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
          900: '#064e3b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### Configuration ESLint

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    'react-hooks/exhaustive-deps': 'warn',
    'no-unused-vars': 'warn',
    'prefer-const': 'error'
  }
}
```

---

## 🎨 Design System

### Palette de Couleurs

```css
/* Couleurs principales */
--color-primary: #10B981;     /* Vert principal */
--color-secondary: #059669;   /* Vert foncé */
--color-accent: #F59E0B;      /* Orange accent */
--color-danger: #EF4444;      /* Rouge erreur */
--color-success: #22C55E;     /* Vert succès */

/* Couleurs neutres */
--color-gray-50: #F9FAFB;
--color-gray-100: #F3F4F6;
--color-gray-500: #6B7280;
--color-gray-900: #111827;
```

### Typographie

```css
/* Tailles de police */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */

/* Poids de police */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Composants UI

**Boutons :**
```jsx
// Bouton principal
<button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
  Action
</button>

// Bouton secondaire
<button className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
  Annuler
</button>
```

**Cards :**
```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  {/* Contenu */}
</div>
```

---

## 🧪 Tests

### Structure des Tests

```
src/
├── 📁 __tests__/              # Tests globaux
├── 📁 components/
│   ├── Dashboard.test.js      # Tests composants
│   └── __tests__/
└── 📁 hooks/
    └── __tests__/
        └── useAuth.test.js    # Tests hooks
```

### Commandes de Test

```bash
# Tous les tests
npm test

# Tests avec couverture
npm run test:coverage

# Tests en mode watch
npm test -- --watch

# Tests d'un fichier spécifique
npm test Dashboard.test.js
```

### Exemple de Test

```javascript
// Dashboard.test.js
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { AuthProvider } from '../../hooks/useAuth';

const DashboardWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Dashboard', () => {
  test('affiche le message de bienvenue', () => {
    render(
      <DashboardWrapper>
        <Dashboard />
      </DashboardWrapper>
    );
    
    expect(screen.getByText(/Bonjour/)).toBeInTheDocument();
  });
});
```

---

## 🚀 Build & Déploiement

### Build de Production

```bash
# Build optimisé
npm run build

# Analyse du bundle
npm run analyze

# Servir les fichiers buildés localement
npm run serve
```

### Déploiement avec Docker

```bash
# Build de l'image de production
docker build -t ecolight-frontend:prod .

# Démarrage du conteneur
docker run -p 80:80 ecolight-frontend:prod

# Avec variables d'environnement
docker run -p 80:80 \
  -e REACT_APP_API_URL=https://api.ecolight.com \
  ecolight-frontend:prod
```

### Déploiement sur Netlify

```bash
# Install de Netlify CLI
npm install -g netlify-cli

# Déploiement
netlify deploy --prod --dir=build
```

### Déploiement sur Vercel

```bash
# Install de Vercel CLI
npm install -g vercel

# Déploiement
vercel --prod
```

---

## 📱 Progressive Web App

### Configuration du Manifest

```json
{
  "name": "Ecolight - Gestion des Déchets",
  "short_name": "Ecolight",
  "description": "Application de gestion intelligente des déchets",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#10B981",
  "background_color": "#FFFFFF",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker

```javascript
// public/sw.js
const CACHE_NAME = 'ecolight-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
```

---

## 🔧 Optimisations

### Performance

**Lazy Loading :**
```javascript
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Collectors = React.lazy(() => import('./components/Collectors'));
```

**Memoization :**
```javascript
const MemoizedComponent = React.memo(({ data }) => {
  return <div>{data.name}</div>;
});
```

**Code Splitting :**
```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
```

### SEO

**Meta Tags :**
```jsx
import { Helmet } from 'react-helmet-async';

function Dashboard() {
  return (
    <>
      <Helmet>
        <title>Tableau de bord - Ecolight</title>
        <meta name="description" content="Gérez vos déchets intelligemment" />
      </Helmet>
      {/* Composant */}
    </>
  );
}
```

### Accessibilité

**ARIA Labels :**
```jsx
<button
  aria-label="Marquer la notification comme lue"
  onClick={markAsRead}
>
  <CheckIcon />
</button>
```

**Navigation au clavier :**
```jsx
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && onClick()}
  onClick={onClick}
>
  Élément cliquable
</div>
```

---

## 🤝 Contribution

### Workflow de Développement

1. **Fork** le repository
2. **Créer** une branche feature : `git checkout -b feature/amazing-feature`
3. **Commit** vos changements : `git commit -m 'Add amazing feature'`
4. **Push** vers la branche : `git push origin feature/amazing-feature`
5. **Ouvrir** une Pull Request

### Standards de Code

```bash
# Avant chaque commit
npm run lint:fix
npm run format
npm test
```

### Structure des Commits

```
feat: ajout du système de notifications
fix: correction du bug de pagination
docs: mise à jour du README
style: amélioration du design des cartes
refactor: restructuration des composants
test: ajout des tests pour Dashboard
```

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👥 Équipe

- **Frontend Developer** : [@frontend-dev](https://github.com/frontend-dev)
- **UI/UX Designer** : [@ui-designer](https://github.com/ui-designer)
- **QA Engineer** : [@qa-engineer](https://github.com/qa-engineer)

---

## 🆘 Support

- **Documentation** : [docs.ecolight.com](https://docs.ecolight.com)
- **Issues** : [GitHub Issues](https://github.com/ecolight/ecolight-frontend/issues)
- **Email** : frontend@ecolight.com
- **Discord** : [#ecolight-frontend](https://discord.gg/ecolight)

---

<div align="center">

**[⬆ Retour en haut](#-ecolight-frontend)**

Made with ❤️ and ♻️ by the Ecolight Team

</div>