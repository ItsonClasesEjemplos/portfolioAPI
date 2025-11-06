const express = require('express');
const projectsRouter = require('./projectsRouter.js');
const authRouter = require('./authRouter.js');

function routerApi(app) {
    const router = express.Router();

    app.use('/api/v1', router);

    router.use('/auth', authRouter);

    router.use('/projects', projectsRouter);

    //router.use('/education', verifyToken, subjectRouter);

}
module.exports = routerApi;