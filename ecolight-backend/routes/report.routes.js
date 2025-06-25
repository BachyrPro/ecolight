const express = require('express');
const { body } = require('express-validator');
const reportController = require('../controllers/report.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Validation pour créer un signalement
const reportValidation = [
    body('localisation').trim().notEmpty().withMessage('La localisation est requise'),
    body('description').trim().notEmpty().withMessage('La description est requise'),
    body('latitude').optional().isFloat().withMessage('Latitude invalide'),
    body('longitude').optional().isFloat().withMessage('Longitude invalide')
];

// Appliquer le middleware d'authentification à toutes les routes
router.use(authMiddleware);

// Routes pour les signalements
router.get('/', reportController.getAllReports);
router.get('/user', reportController.getUserReports);
router.get('/:id', reportController.getReportById);
router.post('/', reportValidation, reportController.createReport);
router.delete('/:id', reportController.deleteReport);

module.exports = router;