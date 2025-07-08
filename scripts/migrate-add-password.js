const sequelize = require('../util/database');
const logger = require('../config/logger');

// Import the migration
const addPasswordMigration = require('../migrations/001-add-password-to-users');

const runMigration = async () => {
  try {
    logger.info('Starting password column migration...');

    // Run the migration
    await addPasswordMigration.up(sequelize.getQueryInterface(), sequelize.constructor);

    logger.info('Migration completed successfully');

    // Sync the models with the database
    await sequelize.sync({ alter: false });

    logger.info('Database synchronized');

  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  }
};

// Run the migration if this file is executed directly
if (require.main === module) {
  runMigration()
    .then(() => {
      logger.info('Migration script completed successfully');
      process.exit(0);
    })
    .catch(error => {
      logger.error('Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = runMigration;
