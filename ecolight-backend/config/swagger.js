const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ecolight API',
            version: '1.0.0',
            description: 'API pour l\'application de gestion des déchets Ecolight',
            contact: {
                name: 'Ecolight Support',
                email: 'support@ecolight.cm'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Serveur de développement'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./routes/*.js', './swagger/*.js']
};

module.exports = swaggerJsdoc(options);