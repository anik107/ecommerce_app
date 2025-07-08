const app = require('./app');
const sequelize = require('./util/database');
const appConfig = require('./config/app');
const logger = require('./config/logger');

// Import models for associations (they need to be imported before sync)
require('./models/user');
require('./models/product');
require('./models/cart');
require('./models/cart-item');
require('./models/order');
require('./models/order-item');

const User = require('./models/user');

const startServer = async () => {
  try {
    // Sync database
    if (appConfig.app.env === 'development') {
      // For development, check if we need to add password column
      try {
        const [results] = await sequelize.query(`
          SELECT column_name
          FROM information_schema.columns
          WHERE table_name = 'users' AND column_name = 'password';
        `);

        if (results.length === 0) {
          logger.info('Password column not found, adding it...');
          await sequelize.query(`
            ALTER TABLE users ADD COLUMN password VARCHAR(255) NULL;
          `);
          logger.info('Password column added successfully');
        }
      } catch (error) {
        logger.warn('Could not check/add password column:', error.message);
      }

      await sequelize.sync({ alter: false }); // Use alter: false for safety
    } else {
      await sequelize.sync();
    }

    logger.info('Database synchronized successfully');

    // Create session table
    const SequelizeStore = require('connect-session-sequelize')(require('express-session').Store);
    const sessionStore = new SequelizeStore({
      db: sequelize,
      tableName: 'Sessions'
    });
    await sessionStore.sync();

    // Create default user if it doesn't exist (for development only)
    if (appConfig.app.env === 'development') {
      let user = await User.findByPk(1);
      if (!user) {
        user = await User.create({
          name: 'Development User',
          email: 'dev@example.com',
          password: 'dev-password' // Add a default password
        });
        await user.createCart();
        logger.info('Default development user created');
      }
    }

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
  sequelize.close().then(() => {
    logger.info('Database connection closed.');
    process.exit(0);
  });
});

startServer();
