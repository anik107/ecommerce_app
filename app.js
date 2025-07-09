const path = require('path');
const express = require('express');
const session = require('express-session');
const csrf = require('csurf');

// Import configurations
const appConfig = require('./config/app');
const logger = require('./config/logger');

// Import middleware
const setupSecurity = require('./middleware/security');
const { globalErrorHandler } = require('./middleware/error-handler');
const { fetchUser, setAuthLocals } = require('./middleware/auth');

// Import controllers
const errorController = require('./controllers/error');

// Import routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

/**
 * Create and configure Express application
 * @param {Object} sessionStore - Session store instance
 * @returns {Object} Configured Express app
 */
const createApp = (sessionStore) => {
    const app = express();

    // View engine configuration
    app.set('view engine', 'ejs');
    app.set('views', 'views');

    // Security middleware
    setupSecurity(app);

    // Static files
    app.use(express.static(path.join(__dirname, 'public')));

    // Session configuration
    app.use(session({
        ...appConfig.session,
        store: sessionStore
    }));

    // Body parser middleware
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    // CSRF protection
    const csrfProtection = csrf();
    app.use(csrfProtection);

    // Authentication middleware
    app.use(fetchUser);
    app.use(setAuthLocals);

    // Routes
    app.use('/admin', adminRoutes);
    app.use(shopRoutes);
    app.use(authRoutes);

    // Error handling
    app.use(errorController.get404);
    app.use(globalErrorHandler);

    return app;
};

module.exports = createApp;
