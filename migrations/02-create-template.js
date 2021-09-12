'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Templates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      header: {
        allowNull: false, 
        type: Sequelize.STRING
      },
      footer: {
        allowNull: true, // if no footer is specified, we will not embed
        type: Sequelize.STRING
      },
      domain: {
        allowNull: true, // optional as some href only uses relative pathing
        type: Sequelize.STRING
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Templates');
  }
};