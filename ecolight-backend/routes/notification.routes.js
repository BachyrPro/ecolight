const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const db = require('../config/db');
const { validationResult } = require('express-validator');

const router = express.Router();

// Validation
const notificationValidation = [
    body('titre').trim().notEmpty().withMessage('Le titre est requis'),
    body('message').trim().notEmpty().withMessage('Le message est requis'),
    body('type').isIn(['info', 'warning', 'success', 'error']).withMessage('Type invalide')
];

// Routes protégées
router.use(authMiddleware);

// Obtenir les notifications de l'utilisateur
router.get('/my-notifications', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const [notifications] = await db.execute(`
            SELECT id, titre, message, type, lu, created_at
            FROM notifications 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
        `, [req.user.id, limit, offset]);

        // Compter les notifications non lues
        const [unreadCount] = await db.execute(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND lu = 0',
            [req.user.id]
        );

        res.json({
            success: true,
            data: notifications,
            unreadCount: unreadCount[0].count,
            pagination: {
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
});

// Marquer une notification comme lue
router.put('/:id/mark-read', async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.execute(
            'UPDATE notifications SET lu = 1, updated_at = NOW() WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Notification non trouvée'
            });
        }

        res.json({
            success: true,
            message: 'Notification marquée comme lue'
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la notification:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
});

// Marquer toutes les notifications comme lues
router.put('/mark-all-read', async (req, res) => {
    try {
        await db.execute(
            'UPDATE notifications SET lu = 1, updated_at = NOW() WHERE user_id = ?',
            [req.user.id]
        );

        res.json({
            success: true,
            message: 'Toutes les notifications ont été marquées comme lues'
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour des notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
});

// Supprimer une notification
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.execute(
            'DELETE FROM notifications WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Notification non trouvée'
            });
        }

        res.json({
            success: true,
            message: 'Notification supprimée avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de la notification:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
});

// Envoyer une notification à un utilisateur spécifique (admin)
router.post('/send', roleMiddleware(['admin']), notificationValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Données invalides',
                errors: errors.array()
            });
        }

        const { user_id, titre, message, type } = req.body;

        // Vérifier que l'utilisateur existe
        const [users] = await db.execute(
            'SELECT id FROM users WHERE id = ?',
            [user_id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        const [result] = await db.execute(`
            INSERT INTO notifications (user_id, titre, message, type)
            VALUES (?, ?, ?, ?)
        `, [user_id, titre, message, type]);

        res.status(201).json({
            success: true,
            message: 'Notification envoyée avec succès',
            data: {
                id: result.insertId,
                user_id,
                titre,
                message,
                type
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
});

// Diffuser une notification à tous les utilisateurs (admin)
router.post('/broadcast', roleMiddleware(['admin']), notificationValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Données invalides',
                errors: errors.array()
            });
        }

        const { titre, message, type, role } = req.body;

        // Obtenir tous les utilisateurs actifs (filtrés par rôle si spécifié)
        let query = 'SELECT id FROM users WHERE 1=1';
        let params = [];

        if (role) {
            query += ' AND role = ?';
            params.push(role);
        }

        const [users] = await db.execute(query, params);

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Aucun utilisateur trouvé'
            });
        }

        // Créer les notifications pour tous les utilisateurs
        const notifications = users.map(user => [user.id, titre, message, type]);
        
        await db.execute(`
            INSERT INTO notifications (user_id, titre, message, type)
            VALUES ${notifications.map(() => '(?, ?, ?, ?)').join(', ')}
        `, notifications.flat());

        res.status(201).json({
            success: true,
            message: `Notification diffusée à ${users.length} utilisateur(s)`,
            data: {
                titre,
                message,
                type,
                recipientsCount: users.length
            }
        });
    } catch (error) {
        console.error('Erreur lors de la diffusion de la notification:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
});

module.exports = router;