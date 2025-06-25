const { validationResult } = require('express-validator');
const db = require('../config/db');

// Obtenir tous les signalements (admin)
const getAllReports = async (req, res) => {
    try {
        console.log('🔍 Récupération de tous les signalements');

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé'
            });
        }

        const [reports] = await db.execute(`
            SELECT 
                r.id,
                r.localisation,
                r.description,
                r.latitude,
                r.longitude,
                r.image_url,
                r.statut,
                r.date_report,
                u.nom as user_nom,
                u.email as user_email
            FROM reports r
            JOIN users u ON r.user_id = u.id
            ORDER BY r.date_report DESC
        `);

        res.json({
            success: true,
            message: 'Signalements récupérés avec succès',
            data: reports,
            count: reports.length
        });
    } catch (error) {
        console.error('💥 Erreur lors de la récupération des signalements:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

// Obtenir les signalements de l'utilisateur connecté
const getUserReports = async (req, res) => {
    try {
        console.log('🔍 Récupération des signalements pour utilisateur:', req.user.id);

        const [reports] = await db.execute(`
            SELECT 
                id,
                localisation,
                description,
                latitude,
                longitude,
                image_url,
                statut,
                date_report
            FROM reports
            WHERE user_id = ?
            ORDER BY date_report DESC
        `, [req.user.id]);

        res.json({
            success: true,
            message: 'Signalements récupérés avec succès',
            data: reports,
            count: reports.length
        });
    } catch (error) {
        console.error('💥 Erreur lors de la récupération des signalements:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

// Créer un nouveau signalement
const createReport = async (req, res) => {
    try {
        console.log('📝 Création d\'un signalement:', req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Données invalides',
                errors: errors.array()
            });
        }

        const { localisation, description, latitude, longitude } = req.body;
        const image_url = req.file ? `/uploads/reports/${req.file.filename}` : null;

        const [result] = await db.execute(`
            INSERT INTO reports (user_id, localisation, description, latitude, longitude, image_url, statut)
            VALUES (?, ?, ?, ?, ?, ?, 'nouveau')
        `, [req.user.id, localisation, description, latitude, longitude, image_url]);

        console.log('✅ Signalement créé avec ID:', result.insertId);

        res.status(201).json({
            success: true,
            message: 'Signalement créé avec succès',
            data: {
                id: result.insertId,
                user_id: req.user.id,
                localisation,
                description,
                latitude,
                longitude,
                image_url,
                statut: 'nouveau'
            }
        });
    } catch (error) {
        console.error('💥 Erreur lors de la création du signalement:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

// Obtenir un signalement par ID
const getReportById = async (req, res) => {
    try {
        const { id } = req.params;

        const [reports] = await db.execute(`
            SELECT 
                r.id,
                r.localisation,
                r.description,
                r.latitude,
                r.longitude,
                r.image_url,
                r.statut,
                r.date_report,
                u.nom as user_nom,
                u.email as user_email
            FROM reports r
            JOIN users u ON r.user_id = u.id
            WHERE r.id = ? AND (r.user_id = ? OR ? = 'admin')
        `, [id, req.user.id, req.user.role]);

        if (reports.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Signalement non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Signalement récupéré avec succès',
            data: reports[0]
        });
    } catch (error) {
        console.error('💥 Erreur lors de la récupération du signalement:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

// Supprimer un signalement
const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.execute(
            'DELETE FROM reports WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Signalement non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Signalement supprimé avec succès'
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
    getAllReports,
    getUserReports,
    createReport,
    getReportById,
    deleteReport
};