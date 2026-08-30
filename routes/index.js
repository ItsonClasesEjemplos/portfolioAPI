const express = require('express');
const path = require('path');
const projectsRouter = require('./projectsRouter.js');
const charactersRouter = require('./charactersRouter.js');
const authRouter = require('./authRouter.js');
const publicRouter = require('./publicRouter');
const {verifyToken} = require("../middlewares/validate-token");

function routerApi(app) {
    const router = express.Router();

    app.use('/api/v1', router);

    router.use('/auth', authRouter);
    router.use('/publicProjects', publicRouter);
    router.use('/characters', charactersRouter);
    router.use('/projects', verifyToken, projectsRouter);

    app.get('/characters/education', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/characters-education.html'));
    });

    //router.use('/education', verifyToken, subjectRouter);

}
module.exports = routerApi;