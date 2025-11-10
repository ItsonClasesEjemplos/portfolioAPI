const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
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
    const swaggerUiPath = swaggerUiDist.getAbsoluteFSPath();

    app.use('/api/swagger-ui', express.static(swaggerUiPath));

    app.get('/api/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    app.get('/api/api-docs', (req, res) => {
        res.send(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Swagger UI</title>
          <link rel="stylesheet" type="text/css" href="/api/swagger-ui/swagger-ui.css" />
          <link rel="icon" type="image/png" href="/api/swagger-ui/favicon-32x32.png" />
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="/api/swagger-ui/swagger-ui-bundle.js"></script>
          <script src="/api/swagger-ui/swagger-ui-standalone-preset.js"></script>
          <script>
            window.onload = function() {
              SwaggerUIBundle({
                url: '/api/api-docs.json',
                dom_id: '#swagger-ui',
              });
            };
          </script>
        </body>
      </html>
    `);
    });

    console.log('Swagger disponible en /api/api-docs');
}

module.exports = { swaggerDocs };
