const express = require('express');
const scheduleController = require('../controllers/schedule.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Appliquer le middleware d'authentification à toutes les routes
router.use(authMiddleware);

// Routes pour les horaires
router.get('/', scheduleController.getAllSchedules);
router.get('/user', scheduleController.getUserSchedules);
router.get('/collector/:collectorId', scheduleController.getCollectorSchedules);

module.exports = router;