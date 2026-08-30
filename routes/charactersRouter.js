const express = require('express');
const Joi = require('joi');
const {
    getCharacterByName,
    getCharacterById,
    getCharacterByAlias,
    createCharacter,
    deleteCharacter,
    updateCharacter,
    getAllCharacters,
    updateCharacterPartial
} = require('../services/characterService');
const validatorHandler = require('../middlewares/validatorHandler');
const {
    createCharacterSchema,
    getCharacterSchema,
    getCharacterByNameSchema,
    getCharacterByAliasSchema
} = require('../shemas/characterSchema');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Characters
 *   description: Endpoints para gestionar personajes
 */

/**
 * @swagger
 * /characters:
 *   get:
 *     summary: Obtiene una lista paginada de personajes
 *     tags: [Characters]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad máxima de resultados por página
 *     responses:
 *       200:
 *         description: Lista de personajes
 *       500:
 *         description: Error del servidor
 */
router.get('/', async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const characters = await getAllCharacters(page, limit);
        res.status(200).json(characters);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /characters/name/{name}:
 *   get:
 *     summary: Busca personajes por nombre
 *     tags: [Characters]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del personaje
 *     responses:
 *       200:
 *         description: Personajes encontrados
 *       404:
 *         description: No se encontraron personajes
 */
router.get('/name/:name', validatorHandler(getCharacterByNameSchema, 'params'), async (req, res, next) => {
    try {
        const { name } = req.params;
        const character = await getCharacterByName(name);
        res.status(200).json(character);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /characters/alias:
 *   get:
 *     summary: Busca un personaje por su alias enviado en la cabecera
 *     tags: [Characters]
 *     parameters:
 *       - in: header
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: Alias del personaje que se desea buscar
 *     responses:
 *       200:
 *         description: Personaje encontrado
 *       404:
 *         description: Personaje no encontrado
 */
const aliasHeaderSchema = Joi.object({
    alias: Joi.string().min(2).max(100).required()
}).unknown(true);

router.get('/alias', validatorHandler(aliasHeaderSchema, 'headers'), async (req, res, next) => {
    try {
        const alias = req.headers.alias;
        const character = await getCharacterByAlias(alias);
        res.status(200).json(character);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /characters/{id}:
 *   get:
 *     summary: Obtiene un personaje por su ID
 *     tags: [Characters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de MongoDB del personaje
 *     responses:
 *       200:
 *         description: Personaje encontrado
 *       404:
 *         description: Personaje no encontrado
 */
router.get('/:id', validatorHandler(getCharacterSchema, 'params'), async (req, res, next) => {
    try {
        const { id } = req.params;
        const character = await getCharacterById(id);
        res.status(200).json(character);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /characters:
 *   post:
 *     summary: Crea un nuevo personaje
 *     tags: [Characters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - alias
 *               - description
 *               - species
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Astra"
 *               alias:
 *                 type: string
 *                 example: "The Starfall"
 *               description:
 *                 type: string
 *                 example: "Personaje con poderes astrales"
 *               species:
 *                 type: string
 *                 example: "Humana"
 *               age:
 *                 type: number
 *                 example: 24
 *               weakness:
 *                 type: string
 *                 example: "No soporta la luz directa"
 *               photo:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/character.png"
 *     responses:
 *       201:
 *         description: Personaje creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', validatorHandler(createCharacterSchema, 'body'), async (req, res, next) => {
    try {
        const newCharacter = await createCharacter(req.body);
        res.status(201).json({
            message: 'Character created successfully',
            data: newCharacter
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /characters/{id}:
 *   put:
 *     summary: Reemplaza completamente un personaje por ID
 *     tags: [Characters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Character'
 *     responses:
 *       200:
 *         description: Personaje actualizado
 *       404:
 *         description: Personaje no encontrado
 */
router.put('/:id', validatorHandler(getCharacterSchema, 'params'), validatorHandler(createCharacterSchema, 'body'), async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedCharacter = await updateCharacter(id, req.body);
        res.status(200).json(updatedCharacter);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /characters/{id}:
 *   patch:
 *     summary: Actualiza parcialmente un personaje por ID
 *     tags: [Characters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               alias:
 *                 type: string
 *               description:
 *                 type: string
 *               species:
 *                 type: string
 *               age:
 *                 type: number
 *               weakness:
 *                 type: string
 *               photo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Personaje actualizado parcialmente
 *       404:
 *         description: Personaje no encontrado
 */
router.patch('/:id', validatorHandler(getCharacterSchema, 'params'), async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedCharacter = await updateCharacterPartial(id, req.body);
        res.status(200).json(updatedCharacter);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /characters/{id}:
 *   delete:
 *     summary: Elimina un personaje por su ID
 *     tags: [Characters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del personaje a eliminar
 *     responses:
 *       200:
 *         description: Personaje eliminado correctamente
 *       404:
 *         description: Personaje no encontrado
 */
router.delete('/:id', validatorHandler(getCharacterSchema, 'params'), async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await deleteCharacter(id);
        res.status(200).json({
            message: 'Character deleted successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
