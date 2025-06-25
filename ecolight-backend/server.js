const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Initialiser l'application Express
const app = express();

// Configuration du trust proxy AVANT le rate limiting
app.set('trust proxy', 1); // ✅ Ajout de cette ligne importante

// Configuration CORS
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
    optionsSuccessStatus: 200
};

// Middlewares de sécurité et logging
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('combined'));

// Rate limiting - APRÈS la configuration trust proxy
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limite chaque IP à 100 requêtes par windowMs
    message: {
        success: false,
        message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
    },
    standardHeaders: true, // Retourner les infos de rate limit dans les headers
    legacyHeaders: false, // Désactiver les headers `X-RateLimit-*`
});
app.use(limiter);

// Middlewares pour parser les données
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques (uploads)
app.use('/uploads', express.static('uploads'));

// Routes de l'API
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/reports', require('./routes/report.routes'));
app.use('/api/collectors', require('./routes/collector.routes'));
app.use('/api/schedules', require('./routes/schedule.routes'));
app.use('/api/subscriptions', require('./routes/subscription.routes'));
// app.use('/api/notifications', require('./routes/notification.routes')); // Commenté temporairement

// Route de base
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Bienvenue sur l\'API Ecolight - Waste Management',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            reports: '/api/reports',
            collectors: '/api/collectors',
            schedules: '/api/schedules',
            subscriptions: '/api/subscriptions'
        }
    });
});

// Route de santé de l'API
app.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Middleware pour gérer les routes non trouvées
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée',
        requestedUrl: req.originalUrl
    });
});

// Middleware global de gestion d'erreurs
app.use((error, req, res, next) => {
    console.error('Erreur globale:', error);
    
    // Erreur de validation Multer
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'Fichier trop volumineux'
        });
    }
    
    // Erreur de validation JSON
    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({
            success: false,
            message: 'Format JSON invalide'
        });
    }
    
    // Erreur générique
    res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
});

// Configuration du port
const PORT = process.env.PORT || 3000;

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`
🚀 Serveur Ecolight démarré avec succès !
📍 Port: ${PORT}
🌍 Environnement: ${process.env.NODE_ENV || 'development'}
🔗 URL: http://localhost:${PORT}
📚 API Docs: http://localhost:${PORT}/
⏰ Démarré à: ${new Date().toLocaleString()}
    `);
});

// Gestion gracieuse de l'arrêt du serveur
process.on('SIGTERM', () => {
    console.log('🛑 Signal SIGTERM reçu, arrêt du serveur...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Signal SIGINT reçu, arrêt du serveur...');
    process.exit(0);
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
    console.error('❌ Erreur non capturée:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesse rejetée non gérée à:', promise, 'raison:', reason);
    process.exit(1);
});

module.exports = app;