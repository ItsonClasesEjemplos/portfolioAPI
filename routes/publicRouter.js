const express = require("express");
const {getProjectByItsonId} = require("../services/projectService");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Public
 *   description: Endpoints públicos para consultar proyectos por ID de Itson
 */

/**
 * @swagger
 * /publicProjects/{itsonId}:
 *   get:
 *     summary: Obtiene los proyectos públicos de un estudiante por su Itson ID
 *     tags: [Public]
 *     parameters:
 *       - in: path
 *         name: itsonId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estudiante
 *     responses:
 *       200:
 *         description: Proyectos encontrados
 *       404:
 *         description: No se encontró estudiante o proyectos
 */
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