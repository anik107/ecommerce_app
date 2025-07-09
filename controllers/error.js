const logger = require('../config/logger');

exports.get404 = (req, res, next) => {
    logger.warn(`404 - Page not found: ${req.url}`);
    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        path: req.url,
        isAuthenticated: req.session.isLoggedIn,
    });
};

exports.get500 = (req, res, next) => {
    logger.error('500 - Internal Server Error');
    res.status(500).render('error', {
        title: 'Internal Server Error',
        msg: 'Something went wrong on our end. Please try again later.',
        pageTitle: 'Error',
        path: '/error',
        isAuthenticated: req.session.isLoggedIn,
    });
};