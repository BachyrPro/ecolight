# 🌱 Ecolight Backend API

## Système de Gestion Intelligente des Déchets

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-blue.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![API Documentation](https://img.shields.io/badge/API-Swagger-green.svg)](http://localhost:3000/api-docs)

---

## 📋 Table des Matières

- [🎯 Présentation](#-présentation)
- [🚀 Démarrage rapide](#-démarrage-rapide)
- [🏗️ Architecture](#️-architecture)
- [📦 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🐳 Docker](#-docker)
- [📚 Documentation API](#-documentation-api)
- [🧪 Tests](#-tests)
- [🚀 Déploiement](#-déploiement)
- [🤝 Contribution](#-contribution)

---

## 🎯 Présentation

Ecolight Backend est une API REST complète développée avec Node.js et Express pour gérer un système intelligent de collecte des déchets. L'application permet aux citoyens de s'abonner à des collecteurs privés, de consulter les horaires de collecte, de signaler des décharges sauvages et de recevoir des notifications.

### ✨ Fonctionnalités Principales

- **👥 Gestion des utilisateurs** : Inscription, authentification JWT, profils
- **🏢 Collecteurs privés** : CRUD complet avec recherche et filtres
- **📝 Abonnements** : Système de souscription utilisateur-collecteur
- **📅 Horaires** : Gestion des plannings de collecte
- **🔔 Notifications** : Système de notifications avec envoi d'emails
- **📍 Signalements** : Rapports de décharges sauvages avec géolocalisation
- **🔒 Sécurité** : Authentification JWT, validation, rate limiting
- **📊 Analytics** : Statistiques et métriques détaillées

---

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 16+ 
- MySQL 8.0+
- npm ou yarn

### Installation Express

```bash
# 1. Cloner le repository
git clone https://github.com/ecolight/ecolight-backend.git
cd ecolight-backend

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env
# Éditer le fichier .env avec vos configurations

# 4. Initialiser la base de données
mysql -u root -p < ecolight_database.sql

# 5. Démarrer en mode développement
npm run dev
```

L'API sera accessible sur `http://localhost:3000`

---

## 🏗️ Architecture

### Structure du Projet

```
ecolight-backend/
├── 📁 controllers/          # Logique métier des routes
│   ├── userController.js
│   ├── collectorController.js
│   ├── subscriptionController.js
│   ├── scheduleController.js
│   ├── notificationController.js
│   └── reportController.js
├── 📁 routes/               # Définition des routes Express
│   ├── userRoutes.js
│   ├── collectorRoutes.js
│   ├── subscriptionRoutes.js
│   ├── scheduleRoutes.js
│   ├── notificationRoutes.js
│   └── reportRoutes.js
├── 📁 middleware/           # Middlewares personnalisés
│   └── auth.js             # Authentification JWT
├── 📁 logs/                # Fichiers de logs
├── 📁 uploads/             # Fichiers uploadés
├── 📄 db.js                # Configuration base de données
├── 📄 server.js            # Point d'entrée principal
├── 📄 swagger.json         # Documentation API
├── 📄 Dockerfile           # Configuration Docker
├── 📄 Jenkinsfile          # Pipeline CI/CD
└── 📄 ecolight_database.sql # Script base de données
```

### Technologies Utilisées

- **Runtime** : Node.js 18+
- **Framework** : Express.js 4.18+
- **Base de données** : MySQL 8.0+
- **Authentification** : JWT (jsonwebtoken)
- **Validation** : express-validator
- **Documentation** : Swagger/OpenAPI
- **Logging** : Winston
- **Sécurité** : Helmet, CORS, bcryptjs
- **Tests** : Jest, Supertest
- **Container** : Docker

---

## 📦 Installation

### Installation Locale

```bash
# Installation des dépendances
npm install

# Installation globale des outils de développement (optionnel)
npm install -g nodemon jest eslint
```

### Base de Données

1. **Créer la base de données :**
```sql
CREATE DATABASE ecolight_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **Importer le schéma :**
```bash
mysql -u [username] -p ecolight_db < ecolight_database.sql
```

3. **Vérifier l'installation :**
```sql
USE ecolight_db;
SHOW TABLES;
```

---

## ⚙️ Configuration

### Variables d'Environnement

Créer un fichier `.env` à la racine :

```bash
# Configuration du serveur
NODE_ENV=development
PORT=3000
HOST=localhost

# Base de données MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ecolight_db
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_refresh_token_secret_key
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3001

# Email Configuration (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@ecolight.com

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs/ecolight.log

# Sécurité
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Documentation Swagger
SWAGGER_ENABLED=true
API_DOCS_PATH=/api-docs
```

### Configuration de Production

Pour la production, modifier les variables suivantes :

```bash
NODE_ENV=production
JWT_SECRET=your_production_jwt_secret_very_long_and_complex
DB_HOST=your_production_db_host
DB_PASSWORD=your_production_db_password
CORS_ORIGIN=https://your-production-domain.com
LOG_LEVEL=error
SWAGGER_ENABLED=false
```

---

## 🐳 Docker

### Développement avec Docker

```bash
# Build de l'image de développement
docker build --target development -t ecolight-backend:dev .

# Démarrage avec live reload
docker run -d \
  --name ecolight-backend-dev \
  -p 3000:3000 \
  -v $(pwd):/app \
  --env-file .env \
  ecolight-backend:dev
```

### Production avec Docker

```bash
# Build de l'image de production
docker build --target production -t ecolight-backend:prod .

# Démarrage en production
docker run -d \
  --name ecolight-backend-prod \
  -p 3000:3000 \
  --env-file .env.production \
  --restart unless-stopped \
  ecolight-backend:prod
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build:
      context: .
      target: production
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
    depends_on:
      - mysql
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: ecolight_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./ecolight_database.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  mysql_data:
```

Démarrage avec Docker Compose :
```bash
docker-compose up -d
```

---

## 📚 Documentation API

### Swagger/OpenAPI

La documentation interactive est disponible à :
- **Développement** : http://localhost:3000/api-docs
- **JSON** : http://localhost:3000/api-docs.json

### Endpoints Principaux

| Endpoint | Méthode | Description | Auth |
|----------|---------|-------------|------|
| `/api/users/register` | POST | Inscription utilisateur | ❌ |
| `/api/users/login` | POST | Connexion utilisateur | ❌ |
| `/api/users/profile` | GET | Profil utilisateur | ✅ |
| `/api/collectors` | GET | Liste des collecteurs | ❌ |
| `/api/collectors/{id}` | GET | Détails collecteur | ❌ |
| `/api/subscriptions` | GET/POST | Gestion abonnements | ✅ |
| `/api/schedules/user` | GET | Horaires personnalisés | ✅ |
| `/api/notifications` | GET | Notifications utilisateur | ✅ |
| `/api/reports` | GET/POST | Signalements | ✅ |

### Authentification

L'API utilise JWT pour l'authentification. Incluez le token dans l'en-tête :

```bash
Authorization: Bearer <your_jwt_token>
```

### Exemples d'utilisation

**Inscription :**
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Jean Dupont",
    "email": "jean@example.com",
    "password": "MonMotDePasse123!",
    "ville": "Paris"
  }'
```

**Connexion :**
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean@example.com",
    "password": "MonMotDePasse123!"
  }'
```

**Créer un signalement :**
```bash
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "localisation": "25 Rue de Rivoli, 75004 Paris",
    "latitude": 48.8566,
    "longitude": 2.3522,
    "description": "Accumulation de déchets ménagers",
    "type_dechet": "ménagers",
    "niveau_urgence": "moyen"
  }'
```

---

## 🧪 Tests

### Structure des Tests

```
tests/
├── 📁 unit/                 # Tests unitaires
│   ├── controllers/
│   ├── middleware/
│   └── utils/
├── 📁 integration/          # Tests d'intégration
│   ├── auth.test.js
│   ├── users.test.js
│   ├── collectors.test.js
│   └── reports.test.js
└── 📁 fixtures/            # Données de test
    └── testData.js
```

### Commandes de Test

```bash
# Tous les tests
npm test

# Tests avec couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch

# Tests d'intégration uniquement
npm run test:integration

# Tests unitaires uniquement
npm run test:unit

# Linting
npm run lint
npm run lint:fix
```

### Configuration Jest

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/logs/**'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Exemple de Test

```javascript
// tests/integration/users.test.js
const request = require('supertest');
const app = require('../../server');

describe('Users API', () => {
  describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
      const userData = {
        nom: 'Test User',
        email: 'test@example.com',
        password: 'Password123!'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('tokens');
    });
  });
});
```

---

## 🚀 Déploiement

### Déploiement Manuel

1. **Préparation du serveur :**
```bash
# Sur le serveur de production
sudo apt update
sudo apt install nginx mysql-server nodejs npm

# Configuration de la base de données
sudo mysql -u root -p < ecolight_database.sql
```

2. **Déploiement de l'application :**
```bash
# Clone du repository
git clone https://github.com/ecolight/ecolight-backend.git
cd ecolight-backend

# Installation des dépendances
npm ci --only=production

# Configuration
cp .env.example .env
# Éditer .env avec les configurations de production

# Démarrage avec PM2
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Configuration PM2

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'ecolight-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### Configuration Nginx

```nginx
# /etc/nginx/sites-available/ecolight-backend
server {
    listen 80;
    server_name api.ecolight.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Déploiement avec Docker

```bash
# Sur le serveur de production
docker pull registry.ecolight.com/ecolight-backend:latest

# Démarrage avec docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Vérification
docker ps
docker logs ecolight-backend-prod
```

### CI/CD avec Jenkins

Le projet inclut un `Jenkinsfile` complet qui automatise :

- ✅ Tests automatisés
- 🐳 Build Docker
- 🔒 Analyse de sécurité
- 📦 Publication des artefacts
- 🚀 Déploiement automatique

Configuration Jenkins requise :
- Plugin NodeJS
- Plugin Docker
- Credentials pour Docker Registry
- Webhook Slack (optionnel)

---

## 🔧 Maintenance

### Monitoring

```bash
# Vérification de l'état
curl http://localhost:3000/health

# Logs de l'application
tail -f logs/ecolight.log

# Monitoring PM2
pm2 monit

# Métriques Docker
docker stats ecolight-backend-prod
```

### Sauvegarde Base de Données

```bash
# Sauvegarde quotidienne
mysqldump -u root -p ecolight_db > backup_$(date +%Y%m%d).sql

# Script de sauvegarde automatique
#!/bin/bash
# backup.sh
BACKUP_DIR="/var/backups/ecolight"
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u root -p$DB_PASSWORD ecolight_db > $BACKUP_DIR/ecolight_$DATE.sql
gzip $BACKUP_DIR/ecolight_$DATE.sql

# Garder seulement les 7 dernières sauvegardes
find $BACKUP_DIR -name "ecolight_*.sql.gz" -mtime +7 -delete
```

### Mise à Jour

```bash
# Arrêt de l'application
pm2 stop ecolight-backend

# Sauvegarde de la base
mysqldump -u root -p ecolight_db > backup_before_update.sql

# Mise à jour du code
git pull origin main
npm ci --only=production

# Migration de la base si nécessaire
# mysql -u root -p ecolight_db < migration.sql

# Redémarrage
pm2 restart ecolight-backend
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

- **ESLint** : Configuration Airbnb
- **Prettier** : Formatage automatique
- **Commits** : Convention Conventional Commits
- **Tests** : Couverture minimum 80%

### Commits Conventionnels

```
feat: ajout du système de notifications
fix: correction de la validation des emails
docs: mise à jour du README
test: ajout des tests d'intégration
refactor: amélioration de la structure des contrôleurs
```

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👥 Équipe

- **Lead Developer** : [@team-lead](https://github.com/team-lead)
- **Backend Developer** : [@backend-dev](https://github.com/backend-dev)
- **DevOps Engineer** : [@devops-engineer](https://github.com/devops-engineer)

---

## 🆘 Support

- **Documentation** : [docs.ecolight.com](https://docs.ecolight.com)
- **Issues** : [GitHub Issues](https://github.com/ecolight/ecolight-backend/issues)
- **Email** : support@ecolight.com
- **Slack** : [#ecolight-support](https://ecolight.slack.com/channels/ecolight-support)

---

## 🔗 Liens Utiles

- [🌐 Frontend React](https://github.com/ecolight/ecolight-frontend)
- [📱 Application Mobile](https://github.com/ecolight/ecolight-mobile)
- [🐳 Docker Hub](https://hub.docker.com/r/ecolight/backend)
- [📊 Monitoring](https://monitoring.ecolight.com)

---

<div align="center">

**[⬆ Retour en haut](#-ecolight-backend-api)**

Made with ❤️ by the Ecolight Team

</div>