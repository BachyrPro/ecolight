const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');

module.exports = (req, res, next) => {
    try {
        // Récupérer le token depuis le header Authorization
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ 
                message: 'Token d\'authentification manquant' 
            });
        }

        // Format attendu: "Bearer TOKEN"
        const parts = authHeader.split(' ');
        
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ 
                message: 'Format de token invalide' 
            });
        }

        const token = parts[1];

        // Vérifier et décoder le token
        jwt.verify(token, jwtConfig.secret, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ 
                        message: 'Token expiré' 
                    });
                }
                if (err.name === 'JsonWebTokenError') {
                    return res.status(401).json({ 
                        message: 'Token invalide' 
                    });
                }
                return res.status(401).json({ 
                    message: 'Erreur d\'authentification' 
                });
            }

            // Ajouter l'ID de l'utilisateur à la requête
            req.userId = decoded.id;
            next();
        });
    } catch (error) {
        console.error('Erreur dans le middleware d\'authentification:', error);
        res.status(500).json({ 
            message: 'Erreur serveur lors de l\'authentification' 
        });
    }
};