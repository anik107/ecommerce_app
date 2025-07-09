const User = require('../models/user');
const logger = require('../config/logger');

/**
 * Middleware to fetch authenticated user from session
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const fetchUser = (req, res, next) => {
    if (!req.session.user) {
        return next();
    }

    User.findByPk(req.session.user.id)
        .then(user => {
            if (!user) {
                req.session.destroy(err => {
                    logger.error('Session destruction error:', err);
                });
                return res.redirect('/login');
            }
            req.user = user;
            next();
        })
        .catch(err => {
            logger.error('User fetch error:', err);
            next(err);
        });
};

/**
 * Middleware to set authentication locals
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const setAuthLocals = (req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
};

module.exports = {
    fetchUser,
    setAuthLocals
};
