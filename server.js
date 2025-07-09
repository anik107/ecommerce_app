const createApp = require('./app');
const appConfig = require('./config/app');
const logger = require('./config/logger');
const defineAssociations = require('./config/associations');
const { setupSessionStore } = require('./config/database-setup');

// Import models to ensure they're loaded before associations
require('./models/user');
require('./models/product');
require('./models/cart');
require('./models/cart-item');
require('./models/order');
require('./models/order-item');

/**
 * Initialize and start the server
 */
const startServer = async () => {
    try {
        // Define database associations first
        defineAssociations();

        // Setup session store
        const sessionStore = await setupSessionStore();

        // Create Express app
        const app = createApp(sessionStore);

        // Start server
        const port = appConfig.app.port;
        app.listen(port, () => {
            logger.info(`🚀 Server running on port ${port} in ${appConfig.app.env} mode`);
            logger.info(`📱 App: ${appConfig.app.name} v${appConfig.app.version}`);
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

/**
 * Setup process event handlers
 */
const setupProcessHandlers = () => {
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
        logger.error('Unhandled Promise Rejection:', err);
        process.exit(1);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', err => {
        logger.error('Uncaught Exception:', err);
        process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        logger.info('SIGTERM received. Shutting down gracefully...');
        const sequelize = require('./util/database');
        sequelize.close().then(() => {
            logger.info('Database connection closed.');
            process.exit(0);
        });
    });
};

// Initialize process handlers and start server
setupProcessHandlers();
startServer();
