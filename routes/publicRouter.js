const express = require("express");
const {getProjectByItsonId} = require("../services/projectService");
const router = express.Router();

router.get('/:itsonId',
    async (req, res, next) => {
        try {
            const { itsonId } = req.params;
            const projectsFound = await getProjectByItsonId(itsonId);
            if (projectsFound) {
                res.status(200).json(projectsFound);
            } else {
                res.status(404).json({ message: 'Student not found' });
            }
        } catch (error) {
            next(error);
        }
    })


module.exports = router;