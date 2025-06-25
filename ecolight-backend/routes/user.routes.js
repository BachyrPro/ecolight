const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

// Validation du profil (seulement nom dans le schéma)
const profileValidation = [
    body('nom').trim().notEmpty().withMessage('Le nom est requis')
];

// Validation du changement de mot de passe
const passwordValidation = [
    body('currentPassword').notEmpty().withMessage('Mot de passe actuel requis'),
    body('newPassword').isLength({ min: 6 }).withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
];

// Routes protégées
router.use(authMiddleware);

// Profil utilisateur
router.get('/profile', userController.getProfile);
router.put('/profile', profileValidation, userController.updateProfile);
router.put('/change-password', passwordValidation, userController.changePassword);

// Liste des collecteurs (table collectors)
router.get('/collectors', userController.getCollectors);

// Routes administrateur
router.get('/', roleMiddleware(['admin']), userController.getAllUsers);

module.exports = router;