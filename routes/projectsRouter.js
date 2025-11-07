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

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Endpoints para gestionar proyectos del usuario
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Obtiene todos los proyectos del usuario autenticado
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proyectos del usuario
 *         content:
 *           application/json:
 *             example:
 *               - _id: "6730c8d5a2ef12345"
 *                 title: "Portafolio Personal"
 *                 description: "Proyecto desarrollado con React y Node.js"
 *                 repository: "https://github.com/brianda/portfolio"
 *                 technologies: ["React", "Node.js", "MongoDB"]
 *                 images: ["https://i.imgur.com/imagen1.png"]
 *                 userId: "672c9f2b9f14ab0013e6b4a0"
 *       404:
 *         description: Usuario sin proyectos o no encontrado
 *       401:
 *         description: Token inválido o ausente
 */
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

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Obtiene un proyecto por su ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del proyecto (ObjectId de MongoDB)
 *         schema:
 *           type: string
 *           example: "6730c8d5a2ef12345"
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *         content:
 *           application/json:
 *             example:
 *               _id: "6730c8d5a2ef12345"
 *               title: "Portafolio Personal"
 *               description: "Proyecto desarrollado con React y Node.js"
 *               repository: "https://github.com/brianda/portfolio"
 *               technologies: ["React", "Node.js"]
 *               images: []
 *               userId: "672c9f2b9f14ab0013e6b4a0"
 *       404:
 *         description: Proyecto no encontrado
 *       401:
 *         description: Token inválido
 */
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

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Crea un nuevo proyecto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: "Portafolio Personal"
 *               description:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 1024
 *                 example: "Proyecto desarrollado para mostrar mis habilidades"
 *               repository:
 *                 type: string
 *                 example: "https://github.com/brianda/portfolio"
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["React", "Node.js", "MongoDB"]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://i.imgur.com/imagen1.png"]
 *     responses:
 *       201:
 *         description: Proyecto creado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Project created successfully"
 *               data:
 *                 _id: "6730c8d5a2ef12345"
 *                 title: "Portafolio Personal"
 *                 description: "Proyecto desarrollado con React y Node.js"
 *                 repository: "https://github.com/brianda/portfolio"
 *                 technologies: ["React", "Node.js", "MongoDB"]
 *                 images: []
 *                 userId: "672c9f2b9f14ab0013e6b4a0"
 *       400:
 *         description: Error en los datos enviados
 *       401:
 *         description: Token inválido
 */
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

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Actualiza un proyecto existente por ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del proyecto a actualizar
 *         schema:
 *           type: string
 *           example: "6730c8d5a2ef12345"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Portafolio actualizado"
 *               description:
 *                 type: string
 *                 example: "Nueva descripción del proyecto"
 *               repository:
 *                 type: string
 *                 example: "https://github.com/brianda/portfolio-v2"
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["React", "Next.js", "MongoDB"]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://i.imgur.com/imagen2.png"]
 *     responses:
 *       200:
 *         description: Proyecto actualizado correctamente
 *       404:
 *         description: Proyecto no encontrado
 *       401:
 *         description: Token inválido
 */
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

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Elimina un proyecto existente por ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del proyecto a eliminar
 *         schema:
 *           type: string
 *           example: "6730c8d5a2ef12345"
 *     responses:
 *       200:
 *         description: Proyecto eliminado correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Project deleted successfully"
 *               deletedId: "6730c8d5a2ef12345"
 *       404:
 *         description: Proyecto no encontrado
 *       401:
 *         description: Token inválido
 */
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