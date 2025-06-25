const express = require('express');
const collectorController = require('../controllers/collector.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Appliquer le middleware d'authentification à toutes les routes
router.use(authMiddleware);

// Routes pour les collecteurs
router.get('/', collectorController.getAllCollectors);
router.get('/search', collectorController.searchByZone);
router.get('/:id', collectorController.getCollectorById);

module.exports = router;