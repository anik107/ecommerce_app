const sequelize = require('../util/database');
const appConfig = require('./app');
const logger = require('./logger');
const User = require('../models/user');


/**
 * Setup session store
 */
const setupSessionStore = async () => {
    const session = require('express-session');
    const SequelizeStore = require('connect-session-sequelize')(session.Store);

    const sessionStore = new SequelizeStore({
        db: sequelize,
        tableName: 'Sessions'
    });

    await sessionStore.sync();
    logger.info('Session store synchronized');
    return sessionStore;
};

module.exports = {
    setupSessionStore
};
