const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        try {
            // Vérifier si l'utilisateur est authentifié
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentification requise'
                });
            }

            // Vérifier si le rôle de l'utilisateur est autorisé
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: 'Accès refusé - Privilèges insuffisants',
                    requiredRoles: allowedRoles,
                    userRole: req.user.role
                });
            }

            next();
        } catch (error) {
            console.error('Erreur dans le middleware de rôle:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    };
};

module.exports = roleMiddleware;