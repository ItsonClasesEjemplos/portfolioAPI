const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Portfolio API',
        version: '1.0.0',
        description: 'Documentación de la API para proyectos, usuarios y autenticación.',
    },
    servers: [
        {
            url: 'http://localhost:3000/api/v1',
            description: 'Servidor local',
        },
        {
            url: 'https://portfolio-api-three-black.vercel.app/api/v1',
            description: 'Servidor en producción',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'apiKey',
                in: 'header',
                name: 'auth-token',
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js', './routes/**/*.js'], // Rutas donde buscarás los comentarios de documentación
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('Swagger Docs disponible en /api-docs');
}

module.exports = { swaggerDocs };
