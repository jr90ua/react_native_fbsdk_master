'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ResponseHistories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bot_id: {
        type: Sequelize.INTEGER
      },
      messager_id: {
        type: Sequelize.STRING
      },
      messager_name: {
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.STRING
      },
      reply_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ResponseHistories');
  }
};