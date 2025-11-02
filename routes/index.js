const express = require('express');
const projectsRouter = require('./projectsRouter.js');

function routerApi(app) {
    const router = express.Router();

    app.use('/api/v1', router);

    //router.use('/auth', router);

    router.use('/projects', projectsRouter);

    //router.use('/education', verifyToken, subjectRouter);

}
module.exports = routerApi;