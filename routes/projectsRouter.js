const express = require('express');
const {    getProjectsByUser,
    getProjectById,
    createProject,
    deleteProject,
    updateProject} = require('../services/projectService');
const validatorHandler = require('../middlewares/validatorHandler');
const {
    createProjectSchema,
    getProjectSchema
} = require('../shemas/projectSchema');

const router = express.Router();


router.get('/', async (req, res, next) => {
    try {
        const id  = req.user.user._id;
        const projectFound = await getProjectsByUser(id);
        if (projectFound) {
            res.status(200).json(projectFound);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
});

router.get('/:id', validatorHandler(getProjectSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const projectFound = await getProjectById(id);
            if (projectFound) {
                res.status(200).json(projectFound);
            } else {
                res.status(404).json({ message: 'Project not found' });
            }
        } catch (error) {
            next(error);
        }
    })

router.post('/', validatorHandler(createProjectSchema, 'body'), async (req, res, next) => {
    try {
        console.log(req.body, req.user.user);
        const newProject = req.body;
        newProject.userId = req.user.user._id;
        const createdProject = await createProject(newProject);
        res.status(201).json({
            message: 'Project created successfully',
            data: createdProject
        });
    } catch (error) {
        next(error);
    }
})

router.put('/:id',  validatorHandler(getProjectSchema, 'params'), validatorHandler(createProjectSchema, 'body'), async (req, res, next) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const project = await updateProject(id, body);
        res.json(project);
    } catch (error) {
        next(error);
    }
})

router.delete('/:id', validatorHandler(getProjectSchema, 'params'), async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await deleteProject(id);
        res.json(data);
    } catch (error) {
        next(error);
    }
})

module.exports = router;