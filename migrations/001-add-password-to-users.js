const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if password column already exists
    const tableDescription = await queryInterface.describeTable('users');

    if (!tableDescription.password) {
      // Add password column with allowNull: true initially
      await queryInterface.addColumn('users', 'password', {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      });

      console.log('Password column added successfully to users table');
    } else {
      console.log('Password column already exists in users table');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove password column if rolling back
    const tableDescription = await queryInterface.describeTable('users');

    if (tableDescription.password) {
      await queryInterface.removeColumn('users', 'password');
      console.log('Password column removed from users table');
    }
  }
};
