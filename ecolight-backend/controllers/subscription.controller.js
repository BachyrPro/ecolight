const { validationResult } = require('express-validator');
const db = require('../config/db');

// Obtenir les abonnements de l'utilisateur connecté
const getUserSubscriptions = async (req, res) => {
    try {
        console.log('🔍 Récupération des abonnements pour l\'utilisateur:', req.user?.id);
        
        // Vérifier que l'utilisateur est authentifié
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non authentifié'
            });
        }

        const [subscriptions] = await db.execute(`
            SELECT 
                s.id,
                s.statut,
                s.date_subscription,
                c.nom as collector_nom,
                c.description as collector_description,
                c.contact as collector_contact,
                c.email as collector_email,
                c.telephone as collector_telephone,
                c.adresse as collector_adresse,
                c.zone_couverture
            FROM subscriptions s
            JOIN collectors c ON s.collector_id = c.id
            WHERE s.user_id = ?
            ORDER BY s.date_subscription DESC
        `, [req.user.id]);

        res.json({
            success: true,
            message: 'Abonnements récupérés avec succès',
            data: subscriptions,
            count: subscriptions.length
        });
    } catch (error) {
        console.error('💥 Erreur lors de la récupération des abonnements:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

// Créer un nouvel abonnement
const createSubscription = async (req, res) => {
    try {
        console.log('📝 Création d\'abonnement:', req.body);
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Données invalides',
                errors: errors.array()
            });
        }

        // Vérifier que l'utilisateur est authentifié
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non authentifié'
            });
        }

        const { collector_id } = req.body;

        // Vérifier que le collecteur existe
        const [collectors] = await db.execute(
            'SELECT id FROM collectors WHERE id = ?',
            [collector_id]
        );

        if (collectors.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Collecteur non trouvé'
            });
        }

        // Vérifier si l'abonnement existe déjà
        const [existingSubscriptions] = await db.execute(
            'SELECT id FROM subscriptions WHERE user_id = ? AND collector_id = ?',
            [req.user.id, collector_id]
        );

        if (existingSubscriptions.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Vous êtes déjà abonné à ce collecteur'
            });
        }

        // Créer l'abonnement
        const [result] = await db.execute(`
            INSERT INTO subscriptions (user_id, collector_id, statut)
            VALUES (?, ?, 'actif')
        `, [req.user.id, collector_id]);

        console.log('✅ Abonnement créé avec ID:', result.insertId);

        res.status(201).json({
            success: true,
            message: 'Abonnement créé avec succès',
            data: {
                id: result.insertId,
                user_id: req.user.id,
                collector_id,
                statut: 'actif'
            }
        });

    } catch (error) {
        console.error('💥 Erreur lors de la création de l\'abonnement:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

// Obtenir un abonnement par ID
const getSubscriptionById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Vérifier que l'utilisateur est authentifié
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non authentifié'
            });
        }

        const [subscriptions] = await db.execute(`
            SELECT 
                s.id,
                s.statut,
                s.date_subscription,
                c.nom as collector_nom,
                c.description as collector_description,
                c.contact as collector_contact,
                c.zone_couverture
            FROM subscriptions s
            JOIN collectors c ON s.collector_id = c.id
            WHERE s.id = ? AND s.user_id = ?
        `, [id, req.user.id]);

        if (subscriptions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Abonnement non trouvé'
            });
        }

        res.json({
            success: true,
            data: subscriptions[0]
        });
    } catch (error) {
        console.error('💥 Erreur lors de la récupération de l\'abonnement:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

// Mettre à jour le statut d'un abonnement
const updateSubscriptionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut } = req.body;
        
        // Vérifier que l'utilisateur est authentifié
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non authentifié'
            });
        }

        // Valider le statut
        const validStatuses = ['actif', 'inactif', 'suspendu'];
        if (!validStatuses.includes(statut)) {
            return res.status(400).json({
                success: false,
                message: 'Statut invalide. Valeurs acceptées: actif, inactif, suspendu'
            });
        }

        const [result] = await db.execute(
            'UPDATE subscriptions SET statut = ? WHERE id = ? AND user_id = ?',
            [statut, id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Abonnement non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Statut mis à jour avec succès'
        });
    } catch (error) {
        console.error('💥 Erreur lors de la mise à jour du statut:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

// Supprimer un abonnement
const deleteSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Vérifier que l'utilisateur est authentifié
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non authentifié'
            });
        }

        const [result] = await db.execute(
            'DELETE FROM subscriptions WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Abonnement non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Abonnement supprimé avec succès'
        });
    } catch (error) {
        console.error('💥 Erreur lors de la suppression:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

module.exports = {
    getUserSubscriptions,
    createSubscription,
    getSubscriptionById,
    updateSubscriptionStatus,
    deleteSubscription
};