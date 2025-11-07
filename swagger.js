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
            description: 'Producción (Vercel)',
        },
        {
            url: 'http://localhost:3000/api/v1',
            description: 'Servidor local',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js', './routes/**/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
    const isVercel = !!process.env.VERCEL;

    if (isVercel) {
        const html = swaggerUi.generateHTML(swaggerSpec);
        app.get('/api-docs', (req, res) => {
            res.setHeader('Content-Type', 'text/html');
            res.send(html);
        });
    } else {
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }

    console.log(`Swagger docs activo en /api-docs (${isVercel ? 'inline' : 'normal'})`);
}

module.exports = { swaggerDocs };
