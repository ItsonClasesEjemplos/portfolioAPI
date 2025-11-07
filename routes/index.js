const express = require('express');
const projectsRouter = require('./projectsRouter.js');
const authRouter = require('./authRouter.js');
const publicRouter = require('./publicRouter');
const {verifyToken} = require("../middlewares/validate-token");

function routerApi(app) {
    const router = express.Router();

    app.use('/api/v1', router);

    router.use('/auth', authRouter);

    router.use('/projects', verifyToken, projectsRouter);
    router.use('/publicProjects', publicRouter);

    //router.use('/education', verifyToken, subjectRouter);

}
module.exports = routerApi;