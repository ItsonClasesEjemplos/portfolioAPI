const express = require('express');
const {    getProjectsByUser,
    getProjectById,
    createProject,
    deleteProject,
    updateProject} = require('../services/projectService');

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const id  = "1";
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

router.get('/:id', async (req, res) => {

})

router.post('/', async (req, res) => {

})

router.patch('/:id', async (req, res) => {

})

router.delete('/:id', async (req, res) => {

})

module.exports = router;