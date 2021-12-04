'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Monitor', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      siteUrl: {
        allowNull: false, 
        type: Sequelize.STRING
      },
      selector: {
        allowNull: true, // required if using certain types of monitors 
        type: Sequelize.STRING
      },
      frequencySeconds: {
        allowNull: true, // defaults to 60s
        type: Sequelize.INTEGER
      },
      differenceId: { // relationship with Difference
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {        
          model: 'Difference',
          key: 'id'
        }  
      },
      templateId: { // relationship with Template
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {        
          model: 'Template',
          key: 'id'
        }
      },
      discordWebhookId: { // relationship with DiscordWebhook
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {        
          model: 'DiscordWebhook',
          key: 'id'
        }
      },
      nestedSelectorId: { // relationship with NestedSelector
        allowNull: true, // will not be required in most cases
        type: Sequelize.INTEGER,
        references: {        
          model: 'NestedSelector',
          key: 'id'
        }
      },
      monitorTypeId: { // relationship with MonitorType
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'MonitorType',
          key: 'id'
        }
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
  down: async (queryInterface) => {
    await queryInterface.dropTable('Monitor');
  }
};