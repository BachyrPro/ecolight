const { validationResult } = require('express-validator');
const db = require('../config/db');

// Obtenir tous les horaires
const getAllSchedules = async (req, res) => {
    try {
        console.log('🔍 Récupération de tous les horaires');

        const [schedules] = await db.execute(`
            SELECT 
                s.id,
                s.jour,
                s.heure,
                s.type_dechet,
                s.zone,
                c.nom as collector_nom,
                c.contact as collector_contact,
                c.telephone as collector_telephone
            FROM schedules s
            JOIN collectors c ON s.collector_id = c.id
            ORDER BY 
                FIELD(s.jour, 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'),
                s.heure
        `);

        res.json({
            success: true,
            message: 'Horaires récupérés avec succès',
            data: schedules,
            count: schedules.length
        });
    } catch (error) {
        console.error('💥 Erreur lors de la récupération des horaires:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

// Obtenir les horaires des collecteurs auxquels l'utilisateur est abonné
const getUserSchedules = async (req, res) => {
    try {
        console.log('🔍 Récupération des horaires pour utilisateur:', req.user.id);

        const [schedules] = await db.execute(`
            SELECT 
                s.id,
                s.jour,
                s.heure,
                s.type_dechet,
                s.zone,
                c.nom as collector_nom,
                c.contact as collector_contact,
                c.telephone as collector_telephone
            FROM schedules s
            JOIN collectors c ON s.collector_id = c.id
            JOIN subscriptions sub ON sub.collector_id = c.id
            WHERE sub.user_id = ? AND sub.statut = 'actif'
            ORDER BY 
                FIELD(s.jour, 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'),
                s.heure
        `, [req.user.id]);

        res.json({
            success: true,
            message: 'Horaires récupérés avec succès',
            data: schedules,
            count: schedules.length
        });
    } catch (error) {
        console.error('💥 Erreur lors de la récupération des horaires:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

// Obtenir les horaires d'un collecteur spécifique
const getCollectorSchedules = async (req, res) => {
    try {
        const { collectorId } = req.params;

        const [schedules] = await db.execute(`
            SELECT 
                s.id,
                s.jour,
                s.heure,
                s.type_dechet,
                s.zone,
                c.nom as collector_nom
            FROM schedules s
            JOIN collectors c ON s.collector_id = c.id
            WHERE s.collector_id = ?
            ORDER BY 
                FIELD(s.jour, 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'),
                s.heure
        `, [collectorId]);

        res.json({
            success: true,
            message: 'Horaires du collecteur récupérés avec succès',
            data: schedules,
            count: schedules.length
        });
    } catch (error) {
        console.error('💥 Erreur lors de la récupération des horaires:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

module.exports = {
    getAllSchedules,
    getUserSchedules,
    getCollectorSchedules
};