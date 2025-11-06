const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');


const verifyToken = (req, res, next) => {
    /**
     * JWT token extracted from the request headers.
     * @type {string}
     */
    const token = req.header('auth-token');
    if (!token) {
        next(boom.unauthorized('Access denied'));
    } else {
        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = verified;
            next();
        } catch (error) {
            next(boom.unauthorized('Invalid token'));
        }
    }
};

module.exports = { verifyToken };