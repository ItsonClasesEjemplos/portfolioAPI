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