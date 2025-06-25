const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const userController = {
    // Obtenir le profil de l'utilisateur connecté
    getProfile: async (req, res) => {
        try {
            const [users] = await db.execute(`
                SELECT id, email, nom, role, date_creation 
                FROM users WHERE id = ?
            `, [req.user.id]);

            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            res.json({
                success: true,
                data: users[0]
            });
        } catch (error) {
            console.error('Erreur lors de la récupération du profil:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    },

    // Mettre à jour le profil
    updateProfile: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Données invalides',
                    errors: errors.array()
                });
            }

            const { nom } = req.body;

            await db.execute(`
                UPDATE users 
                SET nom = ?
                WHERE id = ?
            `, [nom, req.user.id]);

            const [updatedUser] = await db.execute(`
                SELECT id, email, nom, role, date_creation 
                FROM users WHERE id = ?
            `, [req.user.id]);

            res.json({
                success: true,
                message: 'Profil mis à jour avec succès',
                data: updatedUser[0]
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    },

    // Changer le mot de passe
    changePassword: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Données invalides',
                    errors: errors.array()
                });
            }

            const { currentPassword, newPassword } = req.body;

            // Vérifier le mot de passe actuel
            const [users] = await db.execute(
                'SELECT mot_de_passe FROM users WHERE id = ?',
                [req.user.id]
            );

            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, users[0].mot_de_passe);
            if (!isCurrentPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Mot de passe actuel incorrect'
                });
            }

            // Hasher le nouveau mot de passe
            const hashedNewPassword = await bcrypt.hash(newPassword, 12);

            // Mettre à jour le mot de passe
            await db.execute(
                'UPDATE users SET mot_de_passe = ? WHERE id = ?',
                [hashedNewPassword, req.user.id]
            );

            res.json({
                success: true,
                message: 'Mot de passe changé avec succès'
            });
        } catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    },

    // Obtenir tous les utilisateurs (admin seulement)
    getAllUsers: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Accès refusé'
                });
            }

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const search = req.query.search || '';
            const role = req.query.role || '';

            let query = `
                SELECT id, email, nom, role, date_creation
                FROM users WHERE 1=1
            `;
            let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
            let params = [];

            if (search) {
                query += ' AND (nom LIKE ? OR email LIKE ?)';
                countQuery += ' AND (nom LIKE ? OR email LIKE ?)';
                params.push(`%${search}%`, `%${search}%`);
            }

            if (role) {
                query += ' AND role = ?';
                countQuery += ' AND role = ?';
                params.push(role);
            }

            query += ' ORDER BY date_creation DESC LIMIT ? OFFSET ?';
            const queryParams = [...params, limit, offset];

            const [users] = await db.execute(query, queryParams);
            const [countResult] = await db.execute(countQuery, params);

            const total = countResult[0].total;
            const totalPages = Math.ceil(total / limit);

            res.json({
                success: true,
                data: users,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: total,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    },

    // Obtenir les collecteurs disponibles (depuis la table collectors)
    getCollectors: async (req, res) => {
        try {
            const [collectors] = await db.execute(`
                SELECT id, nom, email, telephone, adresse, zone_couverture, description
                FROM collectors 
                ORDER BY nom
            `);

            res.json({
                success: true,
                data: collectors
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des collecteurs:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }
};

module.exports = userController;