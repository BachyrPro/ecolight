const express = require('express');
const { body } = require('express-validator');
const subscriptionController = require('../controllers/subscription.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Validation (selon le schéma BD)
const subscriptionValidation = [
    body('collector_id').isInt().withMessage('ID du collecteur invalide')
];

// Routes protégées
router.use(authMiddleware);

router.get('/my-subscriptions', subscriptionController.getUserSubscriptions);
router.post('/', subscriptionValidation, subscriptionController.createSubscription);
router.delete('/:id', subscriptionController.deleteSubscription);
router.get('/:id', subscriptionController.getSubscriptionById);
router.put('/:id/status', subscriptionController.updateSubscriptionStatus);

module.exports = router;