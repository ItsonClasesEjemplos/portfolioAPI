const path = require('path');
const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerUiDist = require('swagger-ui-dist');

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
    const swaggerUiAssetPath = swaggerUiDist.getAbsoluteFSPath();
    app.use('/swagger-ui', express.static(swaggerUiAssetPath));

    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    app.get('/api-docs', (req, res) => {
        res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Swagger UI</title>
          <link rel="stylesheet" type="text/css" href="/swagger-ui/swagger-ui.css" />
          <link rel="icon" type="image/png" href="/swagger-ui/favicon-32x32.png" />
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="/swagger-ui/swagger-ui-bundle.js"></script>
          <script src="/swagger-ui/swagger-ui-standalone-preset.js"></script>
          <script>
            window.onload = function() {
              SwaggerUIBundle({
                url: '/api-docs.json',
                dom_id: '#swagger-ui',
              });
            };
          </script>
        </body>
      </html>
    `);
    });

    console.log('Swagger UI disponible en /api-docs');
}

module.exports = { swaggerDocs };
