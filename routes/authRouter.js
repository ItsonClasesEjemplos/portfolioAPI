const router = require('express').Router();
const passport = require('passport');
const {
    userRegisterSchema,
    userLoginSchema
} = require('../shemas/userSchema.js');
const { registerUser, updateUser } = require('../services/userService.js');
const validatorHandler = require('../middlewares/validatorHandler.js');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middlewares/validate-token.js');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints para registro y autenticación de usuarios
 */


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - itsonId
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *                 example: "Brianda Campoy"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "brianda@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 20
 *                 example: "123456"
 *               itsonId:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 example: "203045"
 *     responses:
 *       200:
 *         description: Usuario registrado correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: "User created successfully"
 *               data:
 *                 _id: "672c9f2b9f14ab0013e6b4a0"
 *                 name: "Brianda Campoy"
 *                 email: "brianda@example.com"
 *                 itsonId: "203045"
 *       400:
 *         description: Error de validación o conflicto (usuario existente)
 */

router.post(
    '/register',
    validatorHandler(userRegisterSchema, 'body'),
    async (req, res, next) => {
        try {
            const result = await registerUser(req.body);
            res.send(result);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Obtiene el perfil del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario
 *       401:
 *         description: No autorizado
 */
router.get('/profile', verifyToken, async (req, res, next) => {
    try {
        const { iat, ...user } = req.user;
        const { password, ...publicUser } = user.user;
        res.send(publicUser);
    } catch (error) {
        next(error);
    }
});


router.patch('/:id', verifyToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const result = await updateUser(id, body);
        res.send(result);
    } catch (error) {}
});


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión y obtiene un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "brianda@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Usuario autenticado con éxito
 *         headers:
 *           auth-token:
 *             schema:
 *               type: string
 *             description: Token JWT para autenticar peticiones
 *         content:
 *           application/json:
 *             example:
 *               userPublicData:
 *                 _id: "672c9f2b9f14ab0013e6b4a0"
 *                 name: "Brianda Campoy"
 *                 email: "brianda@example.com"
 *                 itsonId: "203045"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Credenciales incorrectas
 */
router.post(
    '/login',
    validatorHandler(userLoginSchema, 'body'),
    passport.authenticate('local', { session: false }),
    async (req, res, next) => {
        try {
            const user = req.user;
            const payload = {
                user
            };

            const token = jwt.sign(payload, process.env.TOKEN_SECRET);

            const { password, ...userPublicData } = user.toObject();
            res.header('auth-token', token).json({ userPublicData, token });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;