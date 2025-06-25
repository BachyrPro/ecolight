const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const jwtConfig = require('../config/jwt.config');

// Générer un token JWT
const generateToken = (userId, email, role) => {
    return jwt.sign(
        { 
            id: userId, 
            email: email,
            role: role 
        },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
    );
};

// Inscription d'un nouvel utilisateur
const register = async (req, res) => {
    try {
        console.log('📝 Tentative d\'inscription avec:', req.body);
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('❌ Erreurs de validation:', errors.array());
            return res.status(400).json({
                success: false,
                message: 'Données invalides',
                errors: errors.array()
            });
        }

        const { nom, email, mot_de_passe, role = 'citoyen' } = req.body;

        // Vérifier si l'utilisateur existe déjà - CORRECTION ICI
        const [existingUsers] = await db.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            console.log('❌ Utilisateur existe déjà:', email);
            return res.status(409).json({
                success: false,
                message: 'Un utilisateur avec cet email existe déjà'
            });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(mot_de_passe, 12);

        // Créer le nouvel utilisateur
        const [result] = await db.execute(`
            INSERT INTO users (nom, email, mot_de_passe, role)
            VALUES (?, ?, ?, ?)
        `, [nom, email, hashedPassword, role]);

        console.log('✅ Utilisateur créé avec ID:', result.insertId);

        // Générer le token
        const token = generateToken(result.insertId, email, role);

        // Retourner la réponse
        res.status(201).json({
            success: true,
            message: 'Inscription réussie',
            token: token,
            user: {
                id: result.insertId,
                nom,
                email,
                role
            }
        });

    } catch (error) {
        console.error('💥 Erreur lors de l\'inscription:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Connexion d'un utilisateur
const login = async (req, res) => {
    try {
        console.log('🔐 Tentative de connexion avec:', req.body.email);
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Données invalides',
                errors: errors.array()
            });
        }

        const { email, mot_de_passe } = req.body;

        // Trouver l'utilisateur
        const [users] = await db.execute(
            'SELECT id, nom, email, mot_de_passe, role FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            console.log('❌ Utilisateur non trouvé:', email);
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        const user = users[0];

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if (!isPasswordValid) {
            console.log('❌ Mot de passe incorrect pour:', email);
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Générer le token
        const token = generateToken(user.id, user.email, user.role);

        console.log('✅ Connexion réussie pour:', email);

        // Retourner la réponse
        res.json({
            success: true,
            message: 'Connexion réussie',
            token: token,
            user: {
                id: user.id,
                nom: user.nom,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('💥 Erreur lors de la connexion:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

// Obtenir le profil de l'utilisateur connecté
const getProfile = async (req, res) => {
    try {
        const [users] = await db.execute(
            'SELECT id, nom, email, role, date_creation FROM users WHERE id = ?',
            [req.user.id]
        );

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
};

module.exports = {
    register,
    login,
    getProfile
};