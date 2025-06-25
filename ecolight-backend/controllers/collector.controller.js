const { validationResult } = require('express-validator');
const db = require('../config/db');

// Obtenir tous les collecteurs
const getAllCollectors = async (req, res) => {
    try {
        console.log('🔍 Récupération de tous les collecteurs');

        const [collectors] = await db.execute(`
            SELECT 
                id,
                nom,
                description,
                contact,
                email,
                telephone,
                adresse,
                zone_couverture,
                date_creation
            FROM collectors
            ORDER BY nom ASC
        `);

        res.json({
            success: true,
            message: 'Collecteurs récupérés avec succès',
            data: collectors,
            count: collectors.length
        });
    } catch (error) {
        console.error('💥 Erreur lors de la récupération des collecteurs:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

// Obtenir un collecteur par ID
const getCollectorById = async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log('🔍 Récupération du collecteur ID:', id);

        const [collectors] = await db.execute(`
            SELECT 
                id,
                nom,
                description,
                contact,
                email,
                telephone,
                adresse,
                zone_couverture,
                date_creation
            FROM collectors
            WHERE id = ?
        `, [id]);

        if (collectors.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Collecteur non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Collecteur récupéré avec succès',
            data: collectors[0]
        });
    } catch (error) {
        console.error('💥 Erreur lors de la récupération du collecteur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

// Rechercher des collecteurs par zone
const searchByZone = async (req, res) => {
    try {
        const { zone } = req.query;
        
        if (!zone) {
            return res.status(400).json({
                success: false,
                message: 'Paramètre zone requis'
            });
        }

        const [collectors] = await db.execute(`
            SELECT 
                id,
                nom,
                description,
                contact,
                email,
                telephone,
                adresse,
                zone_couverture,
                date_creation
            FROM collectors
            WHERE zone_couverture LIKE ?
            ORDER BY nom ASC
        `, [`%${zone}%`]);

        res.json({
            success: true,
            message: 'Recherche effectuée avec succès',
            data: collectors,
            count: collectors.length
        });
    } catch (error) {
        console.error('💥 Erreur lors de la recherche:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

module.exports = {
    getAllCollectors,
    getCollectorById,
    searchByZone
};