const express = require('express');
const cors = require('cors');
const routerApi = require('./routes')
const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/errorHandler')
const { swaggerDocs } = require('./swagger');

const app = express();

app.use(express.json());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'auth-token']
}));

require('./auth/index')

routerApi(app);

swaggerDocs(app);

app.use(boomErrorHandler)

app.use(logErrors);

app.use(errorHandler);

module.exports = app;