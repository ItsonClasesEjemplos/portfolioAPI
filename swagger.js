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
            url: 'https://portfolio-api-three-black.vercel.app/api/v1',
            description: 'Servidor en producción',
        },
        {
            url: 'http://localhost:3000/api/v1',
            description: 'Servidor local',
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
    security: [{ bearerAuth: [] }],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js', './routes/**/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
    const swaggerHTML = swaggerUi.generateHTML(swaggerSpec);

    app.get('/api-docs', (req, res) => {
        res.setHeader('Content-Type', 'text/html');
        res.send(swaggerHTML);
    });

    console.log('Swagger Docs disponibles en /api-docs');
}

module.exports = { swaggerDocs };
