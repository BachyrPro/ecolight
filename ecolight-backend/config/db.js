const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuration de la connexion
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3308,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ecolight_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Créer le pool de connexions
const pool = mysql.createPool(dbConfig);

// Tester la connexion
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connexion à la base de données réussie');
        console.log(`📍 Host: ${dbConfig.host}:${dbConfig.port}`);
        console.log(`🗄️  Database: ${dbConfig.database}`);
        connection.release();
    } catch (error) {
        console.error('❌ Erreur de connexion à la base de données:', error.message);
        process.exit(1);
    }
};

testConnection();

module.exports = pool;