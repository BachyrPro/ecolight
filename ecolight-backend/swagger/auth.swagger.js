/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - nom
 *         - email
 *         - mot_de_passe
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique de l'utilisateur
 *         nom:
 *           type: string
 *           description: Nom de l'utilisateur
 *         email:
 *           type: string
 *           format: email
 *           description: Email de l'utilisateur
 *         role:
 *           type: string
 *           enum: [citoyen, admin, collecteur]
 *           description: Rôle de l'utilisateur
 *         date_creation:
 *           type: string
 *           format: date-time
 *           description: Date de création du compte
 *
 *     RegisterInput:
 *       type: object
 *       required:
 *         - nom
 *         - email
 *         - mot_de_passe
 *       properties:
 *         nom:
 *           type: string
 *           minLength: 2
 *         email:
 *           type: string
 *           format: email
 *         mot_de_passe:
 *           type: string
 *           minLength: 6
 *         role:
 *           type: string
 *           enum: [citoyen, admin, collecteur]
 *           default: citoyen
 *
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - mot_de_passe
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         mot_de_passe:
 *           type: string
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *           description: JWT token
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Inscription réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Email déjà utilisé
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Email ou mot de passe incorrect
 */

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Obtenir le profil de l'utilisateur connecté
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 */