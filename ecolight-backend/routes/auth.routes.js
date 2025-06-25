const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Validation pour l'inscription
const registerValidation = [
    body('nom')
        .trim()
        .notEmpty().withMessage('Le nom est requis')
        .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères'),
    body('email')
        .trim()
        .notEmpty().withMessage('L\'email est requis')
        .isEmail().withMessage('Email invalide')
        .normalizeEmail(),
    body('mot_de_passe')
        .notEmpty().withMessage('Le mot de passe est requis')
        .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
        .matches(/\d/).withMessage('Le mot de passe doit contenir au moins un chiffre'),
    body('role')
        .optional()
        .isIn(['citoyen', 'admin', 'collecteur']).withMessage('Rôle invalide')
];

// Validation pour la connexion
const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('L\'email est requis')
        .isEmail().withMessage('Email invalide')
        .normalizeEmail(),
    body('mot_de_passe')
        .notEmpty().withMessage('Le mot de passe est requis')
];

// Routes publiques
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

// Routes protégées
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;